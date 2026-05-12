# 🚀 빠른 시작 가이드

## ⚡ 5분 안에 시작하기

### 1. 프로젝트 실행

```bash
# 방법 1: Python으로 로컬 서버 실행 (권장)
cd /Users/jongho/Desktop/Project/bm_report
python -m http.server 8000

# 방법 2: Node.js 있다면
npx http-server

# 방법 3: Ruby
ruby -run -ehttpd . -p8000
```

### 2. 브라우저에서 열기
```
http://localhost:8000
```

### 3. 기능 테스트
1. Excel 파일 업로드
2. 분석 대기
3. 결과 미리보기
4. Word 다운로드

## 📂 파일 구조 이해

```
bm_report/
├── index.html              ← 시작점
├── app.js                  ← 메인 로직
│
├── components/             ← UI 위젯들
│   ├── upload-widget.js    # 업로드 영역
│   ├── progress-widget.js  # 로딩 표시
│   ├── preview-widget.js   # 보고서 표시
│   └── error-widget.js     # 에러 메시지
│
├── services/               ← 비즈니스 로직
│   ├── file-service.js     # 파일 처리
│   ├── analysis-service.js # 데이터 분석
│   └── word-export-service.js  # Word 생성
│
├── models/                 ← 데이터 구조
│   └── analysis-data.js    # 분석 결과 모델
│
├── utils/                  ← 유틸리티
│   ├── formatters.js       # 포맷팅 함수
│   ├── validators.js       # 검증 함수
│   └── xml-utils.js        # XML 생성 헬퍼
│
└── docs/                   ← 문서
    ├── ARCHITECTURE.md     # 아키텍처
    ├── MIGRATION.md        # 마이그레이션
    └── REFACTORING_SUMMARY.md  # 요약
```

## 🔧 개발 시작

### 코드 추가하기

#### 1. 새 서비스 추가
```javascript
// services/my-service.js
export class MyService {
  static doSomething(data) {
    return data;
  }
}
```

#### 2. 서비스 사용
```javascript
// app.js
import MyService from './services/my-service.js';

// 사용
const result = MyService.doSomething(data);
```

#### 3. 새 위젯 추가
```javascript
// components/my-widget.js
export class MyWidget {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    this.container.innerHTML = `<!-- 마크업 -->`;
  }

  attachEventListeners() {
    // 이벤트 바인딩
  }

  show() {
    this.container.style.display = 'block';
  }

  hide() {
    this.container.style.display = 'none';
  }
}
```

## 🧩 주요 컴포넌트 설명

### UploadWidget - 파일 업로드
```javascript
// 파일 선택 시 콜백 실행
const upload = new UploadWidget('uploadContainer', (file) => {
  console.log('파일 선택:', file.name);
});

upload.show();     // 표시
upload.hide();     // 숨기기
upload.reset();    // 초기화
```

### ProgressWidget - 진행 상황
```javascript
const progress = new ProgressWidget('progressContainer');

progress.show();
progress.setStep('처리 중...');
progress.hide();
```

### PreviewWidget - 보고서 표시
```javascript
const preview = new PreviewWidget(
  'previewContainer',
  () => console.log('다운로드'),
  () => console.log('초기화')
);

// 보고서 렌더링
preview.renderReport(analysisData);
preview.show();
preview.hide();
```

## 🎯 데이터 흐름

```
사용자 파일 선택
    ↓
FileService.readFile(file)
    ↓ Excel 파싱
AnalysisService.analyze(rows)
    ↓ 데이터 분석
AnalysisData 객체 생성
    ↓
PreviewWidget.renderReport(data)
    ↓ HTML 렌더링
WordExportService.generateDocx(data)
    ↓ DOCX 생성
WordExportService.download(blob, name)
    ↓
다운로드 완료
```

## 📝 흔한 작업들

### 분석 로직 수정

```javascript
// services/analysis-service.js
static analyzeKeywords(contents) {
  // 여기서 키워드 분석 로직 수정
  const kwDefs = [
    { name: '새 키워드', keys: ['키1', '키2'], color: 'navy' },
    // ... 추가
  ];
  return kwDefs
    .map(kw => ({
      ...kw,
      count: contents.filter(c => kw.keys.some(k => c.includes(k))).length
    }))
    .filter(k => k.count > 0);
}
```

### UI 스타일 수정

```javascript
// index.html의 <style> 태그에서 직접 수정
// 또는 styles/ 폴더의 CSS 파일 참고

.summary-card {
  background: var(--navy);  /* 배경색 변경 */
  padding: 20px;            /* 패딩 조정 */
}
```

### 보고서 레이아웃 변경

```javascript
// components/preview-widget.js
renderReport(data) {
  // reportPreview.innerHTML 수정
  // 섹션 순서 변경, 테이블 구조 수정 등
}
```

## 🐛 디버깅 팁

### 콘솔 로깅
```javascript
console.log('분석 데이터:', analysisData);
console.log('상태:', this.state);
```

### 브라우저 개발자 도구
1. F12 열기
2. Console 탭에서 에러 확인
3. Sources 탭에서 중단점 설정
4. Elements 탭에서 DOM 검사

### 파일 구조 확인
```javascript
// 콘솔에서 실행
console.table(Object.keys(AnalysisService));
// → analyze, analyzeKeywords, generateInsights, generatePlan
```

## 📚 더 알아보기

- `ARCHITECTURE.md` - 상세 아키텍처
- `MIGRATION.md` - 이전 버전과의 비교
- `REFACTORING_SUMMARY.md` - 개선 사항 요약

## ❓ FAQ

**Q: ES Module이 뭔가요?**
A: 최신 JavaScript의 모듈 시스템입니다. `import/export` 키워드로 파일 간 코드 공유가 가능합니다.

**Q: 왜 웹 서버가 필요한가요?**
A: 브라우저 보안 정책 때문에 `file://` 프로토콜에서는 ES Module을 로드할 수 없습니다.

**Q: 기존 bm-report.html은 삭제해도 되나요?**
A: 아니요. 참고용으로 유지하는 것이 좋습니다.

**Q: 모바일에서도 작동하나요?**
A: 네! 모든 현대 브라우저에서 작동합니다.

## 🎓 학습 순서

1. **index.html** 이해하기
2. **app.js** 흐름 파악
3. **components/** 위젯 분석
4. **services/** 비즈니스 로직 학습
5. **utils/** 헬퍼 함수 활용

## 💬 도움말

문제 발생 시:
1. 콘솔 에러 메시지 확인
2. 파일 경로 확인
3. import/export 구문 확인
4. 라이브러리 로드 확인 (XLSX, JSZip)

---

**Happy Coding! 🚀**
