// 토픽 파일의 형식을 검사한다. 실행: node scripts/check-topics.mjs
import { readFileSync, readdirSync } from "node:fs";

const dir = new URL("../topics/", import.meta.url);
const read = name => JSON.parse(readFileSync(new URL(name, dir), "utf8"));
const errors = [];
const need = (ok, message) => { if (!ok) errors.push(message); };
const validId = id => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id);

const ids = read("index.json");
const files = readdirSync(dir).filter(f => f.endsWith(".json") && f !== "index.json").map(f => f.slice(0, -5));
need(Array.isArray(ids), "index.json은 토픽 id 배열이어야 합니다");
for (const id of files) need(ids.includes(id), `index.json에 ${id}가 없습니다`);

const blocks = ["h", "p", "formula", "list", "callout", "table"];
for (const id of ids) {
  need(validId(id), `토픽 id 형식 오류: ${id}`);
  need(files.includes(id), `topics/${id}.json 파일이 없습니다`);
  if (!files.includes(id)) continue;
  const t = read(`${id}.json`);
  need(t.title, `${id}: title 없음`);
  need(t.addedAt && !Number.isNaN(Date.parse(t.addedAt)), `${id}: addedAt 오류`);
  need(t.scenarios?.length, `${id}: 시나리오 없음`);
  const scenarioIds = new Set();
  for (const s of t.scenarios ?? []) {
    const at = `${id}/${s.id}`;
    need(validId(s.id ?? "") && !scenarioIds.has(s.id), `${at}: 시나리오 id 오류 또는 중복`);
    scenarioIds.add(s.id);
    need(s.title && s.situation, `${at}: title 또는 situation 없음`);
    need(s.theory?.length, `${at}: 이론 없음`);
    for (const b of s.theory ?? []) need(blocks.includes(b.t), `${at}: 알 수 없는 이론 블록 ${b.t}`);
    need(s.quiz?.length, `${at}: 문제 없음`);
    need(s.practice?.length, `${at}: 실습 없음`);
    const itemIds = new Set();
    for (const q of s.quiz ?? []) {
      need(q.id && !itemIds.has(q.id), `${at}: 문제 id 오류 또는 중복 ${q.id}`);
      itemIds.add(q.id);
      need(q.q && q.why, `${at}/${q.id}: 질문 또는 해설 없음`);
      need(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < (q.options?.length ?? 0), `${at}/${q.id}: answer 범위 오류`);
    }
    for (const p of s.practice ?? []) {
      need(p.id && !itemIds.has(p.id), `${at}: 실습 id 오류 또는 중복 ${p.id}`);
      itemIds.add(p.id);
      need(p.prompt && p.solution, `${at}/${p.id}: 문제 또는 풀이 없음`);
      if (p.type === "number") need(Number.isFinite(p.answer), `${at}/${p.id}: 숫자 답 없음`);
      else if (p.type === "text") need(p.accept?.length, `${at}/${p.id}: accept 없음`);
      else if (p.type === "order") need(p.items?.length > 1, `${at}/${p.id}: items 부족`);
      else errors.push(`${at}/${p.id}: 알 수 없는 실습 유형 ${p.type}`);
    }
    need(s.apply?.prompt && s.apply?.model && s.apply?.rubric?.length, `${at}: 응용 과제, 모범 답안, 채점 기준 중 빠진 것이 있음`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`토픽 ${ids.length}개 검사 통과`);
