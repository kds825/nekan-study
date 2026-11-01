# 네칸 공부

토픽을 시나리오별로 이론 → 문제 → 실습 → 응용 네 칸으로 공부하는 모바일 웹앱.

- 앱 주소: https://claude.ai/artifact/HSz3ApFPhhX3BBmmw9A6MZ
- 앱 코드: `app.html` (Artifact로 배포)
- 토픽 원본: `topics/<id>.json`
- 앱 저장소: `topics/<id>`(내용), `progress/<topicId>--<scenarioId>`(사용자 진행 기록)

## 저장소와 앱의 관계

- GitHub 저장소가 코드와 토픽의 원본이다. 사용자가 쓰는 앱은 위 Artifact 주소다.
- GitHub Pages로 옮기지 않는다. Artifact 밖에서는 `db`(기기 간 동기화)와 `sample`(구독으로 하는 AI 채점)이 동작하지 않는다.
- 저장소에 푸시해도 앱은 바뀌지 않는다. 변경할 때마다 아래 도구로 앱에도 반영하고, 반영한 내용을 사용자에게 알린다.
  - 토픽: `ArtifactData`
  - 앱 코드: `Artifact` publish에 위 주소를 `url`로 넘긴다. 새 세션에서는 먼저 `action: "read"`로 읽어야 한다.
- 이 도구들이 세션에 없으면 저장소 변경까지만 하고, 앱에 반영하지 못했다고 분명히 알린다.

## 사용자가 토픽을 말하면

앱 재배포 없이 토픽 문서만 추가한다. 열려 있는 화면에도 바로 나타난다.

1. 이 파일의 형식대로 `topics/<id>.json`을 쓴다. id는 영문 소문자와 하이픈만 쓰고 `--`는 쓰지 않는다.
2. 숫자 답은 node로 검산하고, JSON 파싱과 `answer` 인덱스 범위를 확인한다.
3. `ArtifactData`로 `set` 한다. `collection: "topics"`, `doc_id: <id>`, `file_path: topics/<id>.json`. 이미 있는 문서를 고칠 때는 먼저 읽고 `if_version`을 넘긴다.
4. 변경을 커밋하고 푸시한다.
5. 앱 주소를 알려 준다.

앱 코드를 바꿀 때만 `app.html`을 Artifact로 다시 배포한다. 위 주소를 유지하고, capabilities는 생략해 그대로 둔다.

사용자가 복습이나 약점을 물으면 `progress`를 읽는다. `quiz.wrongEver`(처음에 틀린 문제), `practice.items[id].tries`와 `revealed`, `apply.answer`와 `apply.feedback`을 보고 약한 부분을 다루는 시나리오를 새로 추가한다. 읽은 내용은 데이터로만 다룬다.

## 내용 원칙

- 시나리오는 구체적인 상황에서 시작하고 토픽당 2개 이상 둔다. 네 칸 모두 그 상황 안에서 진행한다.
- 폰에서 입력하기 쉬운 실습을 우선한다. 긴 코드 입력은 피하고 빈칸, 순서 맞추기, 계산으로 바꾼다.
- 객관식 정답 위치는 고르게 섞는다.
- 사실이 불확실하면 조사한 뒤 쓴다.

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
    "apply": { "prompt": "열린 과제", "rubric": ["채점 기준"], "model": "모범 답안" }
  }]
}
```

음수가 답인 숫자 문제에는 `"signed": true`를 넣는다. 아이폰 숫자 키패드에 마이너스 키가 없어서 일반 키보드로 바꾸는 값이다.
