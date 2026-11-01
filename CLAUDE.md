# 네칸 공부

토픽을 시나리오별로 이론 → 문제 → 실습 → 응용 네 칸으로 공부하는 모바일 웹앱. GitHub Pages로 배포하는 정적 사이트다. 서버, API 키, 빌드 단계가 없다.

- 사이트: https://kds825.github.io/nekan-study/
- 앱 코드: `index.html`
- 토픽 목록: `topics/index.json` (토픽 id 배열)
- 토픽 내용: `topics/<id>.json`
- 형식 검사: `node scripts/check-topics.mjs`

`main` 브랜치에 들어간 내용이 사이트에 배포된다. 작업 브랜치에 푸시한 것은 아직 배포된 것이 아니다. 작업 브랜치라면 `main`에 병합할 PR을 만들고, 병합해야 사이트에 반영된다고 사용자에게 알린다.

진행 기록은 사용자 브라우저의 localStorage에만 있어 기기 간에 공유되지 않고, 저장소에서 읽을 수 없다. 저장소는 공개이므로 비밀번호, 고객 정보 같은 내용을 넣지 않는다.

## 사용자가 토픽을 말하면

1. 아래 형식대로 `topics/<id>.json`을 쓰고 `topics/index.json`에 id를 추가한다. id는 영문 소문자, 숫자, 하이픈만 쓰고 `--`는 쓰지 않는다.
2. 숫자 답은 node로 검산하고 `node scripts/check-topics.mjs`를 통과시킨다.
3. 변경을 커밋하고 푸시한다. 위 브랜치 규칙을 따른다.
4. 사이트 주소와 반영 상태를 알려 준다.

## 내용 원칙

- 시나리오는 구체적인 상황에서 시작하고 토픽당 2개 이상 둔다. 네 칸 모두 그 상황 안에서 진행한다.
- 폰에서 입력하기 쉬운 실습을 우선한다. 긴 코드 입력은 피하고 빈칸, 순서 맞추기, 계산으로 바꾼다.
- 객관식 정답 위치는 고르게 섞는다.
- 버전이나 수치처럼 바뀌는 사실은 공식 문서에서 확인하고, 이론 끝에 출처와 확인일을 적는다.

## 토픽 형식

```jsonc
{
  "title": "토픽 이름",
  "subtitle": "한 줄 설명",
  "addedAt": "ISO 시각. 최신 토픽이 위에 나온다",
  "scenarios": [{
    "id": "ascii-id",
    "title": "시나리오 제목",
    "situation": "상황 설명",
    "theory": [
      { "t": "h", "text": "소제목" },
      { "t": "p", "text": "문단. **굵게** 쓰면 형광펜 표시" },
      { "t": "formula", "text": "공식이나 짧은 코드" },
      { "t": "list", "items": ["항목"] },
      { "t": "callout", "text": "강조 문장" },
      { "t": "table", "head": ["열"], "rows": [["값"]] }
    ],
    "quiz": [{ "id": "q1", "q": "질문", "options": ["보기"], "answer": 0, "why": "해설" }],
    "practice": [
      { "id": "p1", "type": "number", "prompt": "", "answer": 1.5, "tolerance": 0.1, "unit": "", "signed": false, "hint": "", "solution": "" },
      { "id": "p2", "type": "text", "prompt": "", "accept": ["정답", "동의어"], "hint": "", "solution": "" },
      { "id": "p3", "type": "order", "prompt": "", "items": ["올바른 순서대로 적는다"], "hint": "", "solution": "" }
    ],
    "apply": { "prompt": "열린 과제", "rubric": ["점검 기준"], "model": "모범 답안" }
  }]
}
```

음수가 답인 숫자 문제에는 `"signed": true`를 넣는다. 아이폰 숫자 키패드에 마이너스 키가 없어서 일반 키보드로 바꾸는 값이다.
