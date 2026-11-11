# vendor

- `xlsx.full.min.js`: SheetJS Community Edition 0.18.5 (Apache-2.0), npm 레지스트리 `xlsx@0.18.5`에서 받음 (integrity sha512-dmg3LCjBPHZnQp5/F/+nnTa+miPJxUXB6vtk42YjBBKayDNagxGEeIdWApkYPOf3Z3pm3k62Knjzp7lMeTEtFQ==).
  엑셀 파일을 브라우저 안에서 읽을 때만 불러온다. 0.18.5에는 조작된 파일을 읽을 때의 알려진 취약점(CVE-2023-30533, CVE-2024-22363)이 있으므로 본인이 내보낸 명함 파일만 연다.

## ocr/ (명함 촬영 글자 인식)

명함 촬영 화면에서 사진을 고를 때만 불러온다. 사진은 브라우저 안에서만 읽고 어디로도 보내지 않는다.

- `tesseract.min.js`, `worker.min.js`: Tesseract.js 7.0.0 (Apache-2.0), npm `tesseract.js@7.0.0` (integrity sha512-exPBkd+z+wM1BuMkx/Bjv43OeLBxhL5kKWsz/9JY+DXcXdiBjiAch0V49QR3oAJqCaL5qURE0vx9Eo+G5YE7mA==). 소스맵 줄만 뺐다.
- `core/tesseract-core-{,simd-,relaxedsimd-}lstm.wasm.js`: tesseract.js-core 7.0.0 (Apache-2.0), npm `tesseract.js-core@7.0.0` (integrity sha512-WnNH518NzmbSq9zgTPeoF8c+xmilS8rFIl1YKbk/ptuuc7p6cLNELNuPAzcmsYw450ca6bLa8j3t0VAtq435Vw==). LSTM 전용 빌드만 두었고, 기기가 지원하는 SIMD 수준에 맞춰 하나만 받는다.
- `lang/kor.traineddata.gz`, `lang/eng.traineddata.gz`: `@tesseract.js-data/kor@1.0.0`, `@tesseract.js-data/eng@1.0.0`의 `4.0.0_best_int` (Apache-2.0, tesseract-ocr/tessdata 기반).
