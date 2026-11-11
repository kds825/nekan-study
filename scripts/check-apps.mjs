// 공부방 플랫폼의 앱 목록(apps.json) 형식을 검사한다. 실행: node scripts/check-apps.mjs
import { readFileSync, existsSync } from "node:fs";

const root = new URL("../", import.meta.url);
const data = JSON.parse(readFileSync(new URL("apps.json", root), "utf8"));
const errors = [];
const need = (ok, message) => { if (!ok) errors.push(message); };

need(data.platform?.name, "platform.name 없음");
need(Array.isArray(data.apps) && data.apps.length, "apps 배열이 비어 있음");
const ids = new Set();
for (const a of data.apps ?? []) {
  const at = `apps/${a.id}`;
  need(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(a.id ?? "") && !ids.has(a.id), `${at}: id 형식 오류 또는 중복`);
  ids.add(a.id);
  need(a.name && a.description, `${at}: name 또는 description 없음`);
  need(["live", "soon"].includes(a.status), `${at}: status는 live 또는 soon`);
  need(a.path === `apps/${a.id}/`, `${at}: path는 "apps/${a.id}/" 형식이어야 함`);
  if (a.status === "live") need(existsSync(new URL(`${a.path}index.html`, root)), `${at}: ${a.path}index.html 파일이 없음`);
  need(!a.addedAt || !Number.isNaN(Date.parse(a.addedAt)), `${at}: addedAt 날짜 오류`);
}

if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log(`앱 ${data.apps.length}개 검사 통과`);
