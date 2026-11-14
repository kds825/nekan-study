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
  if (a.url) {
    // 다른 저장소에서 따로 배포하는 앱: 첫 화면에 링크만 건다. 이 저장소에는 코드가 없다.
    need(/^https:\/\/[^/]+\/.+/.test(a.url) && !a.path, `${at}: url은 https 주소이고, url이 있으면 path는 쓰지 않음`);
    need(!existsSync(new URL(`apps/${a.id}/`, root)), `${at}: url 앱인데 apps/${a.id}/ 폴더가 있음`);
    continue;
  }
  need(a.path === `apps/${a.id}/`, `${at}: path는 "apps/${a.id}/" 형식이어야 함`);
  if (a.status === "live") need(existsSync(new URL(`${a.path}index.html`, root)), `${at}: ${a.path}index.html 파일이 없음`);
  need(!a.addedAt || !Number.isNaN(Date.parse(a.addedAt)), `${at}: addedAt 날짜 오류`);
}

/* 앱끼리 데이터가 섞이지 않게: 각 앱은 '<id>-'로 시작하는 키와 'platform-summary:<id>'만 쓰고,
   첫 화면은 'platform-summary:' 키만 읽는다. 저장소 전체를 훑거나 지우는 코드는 쓰지 않는다. */
const FORBIDDEN = [[/localStorage\.clear\s*\(/, "localStorage.clear()"], [/localStorage\.key\s*\(/, "localStorage.key()"],
  [/Object\.(keys|entries|values)\s*\(\s*localStorage/, "localStorage 전체 훑기"], [/in\s+localStorage\b/, "localStorage 전체 훑기"],
  [/sessionStorage|indexedDB/, "sessionStorage·IndexedDB(쓰려면 이 검사에 규칙을 더한다)"]];
function storageKeys(src) {
  const keys = [];
  for (const line of src.split("\n")) {
    if (line.includes("storage-migration")) continue;
    for (const m of line.matchAll(/localStorage\.(?:getItem|setItem|removeItem)\(\s*(["'`])([^"'`]*)\1/g)) keys.push(m[2]);
    for (const m of line.matchAll(/(?:const|let)\s+\w*KEY\w*\s*=\s*(["'`])([^"'`]*)\1/g)) keys.push(m[2]);
    for (const m of line.matchAll(/ls\.(?:get|set)\(\s*(["'`])([^"'`]*)\1/g)) keys.push(m[2]);
  }
  return keys;
}
function checkStorage(file, ok, label) {
  const src = readFileSync(new URL(file, root), "utf8");
  for (const [re, what] of FORBIDDEN) need(!re.test(src), `${label}: ${what}를 쓰면 안 됨`);
  for (const k of storageKeys(src)) need(ok(k), `${label}: 저장 키 '${k}'가 이 앱 것이 아님`);
}
for (const a of data.apps ?? []) {
  if (a.url || a.status !== "live" || !existsSync(new URL(`${a.path}index.html`, root))) continue;
  checkStorage(`${a.path}index.html`, k => k.startsWith(`${a.id}-`) || k === `platform-summary:${a.id}` || k.startsWith(`platform-summary:${a.id}`), `apps/${a.id}`);
}
checkStorage("index.html", k => k.startsWith("platform-summary:"), "첫 화면");

if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log(`앱 ${data.apps.length}개 검사 통과`);
