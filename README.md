# BM 영업일지 보고서 생성기

> Excel 기반 BM 영업일지를 자동으로 분석하여 Word 보고서를 생성하는 웹 애플리케이션

## ✨ 특징

- 📊 **자동 데이터 분석**: Excel 파일의 영업일지를 자동으로 분석
- 📈 **지능형 인사이트**: AI 기반으로 주요 이슈 및 기회 식별
- 📄 **Word 문서 생성**: 전문적인 형식의 보고서 자동 생성
- 🎯 **계획 수립**: 향후 과제 자동 도출
- 💾 **원클릭 다운로드**: 분석 완료 후 즉시 다운로드
- 🔄 **드래그 & 드롭**: 편리한 파일 업로드

## 🚀 시작하기

### 최소 요구사항
- 모던 웹 브라우저 (Chrome, Firefox, Safari, Edge)
- 로컬 웹 서버

### 빠른 시작 (1분)

```bash
# 1. 디렉토리로 이동
cd /Users/jongho/Desktop/Project/bm_report

# 2. 웹 서버 실행
python -m http.server 8000

# 3. 브라우저에서 열기
open http://localhost:8000
```

상세 가이드는 [QUICKSTART.md](QUICKSTART.md)를 참고하세요.

## 📁 프로젝트 구조

```
bm_report/
├── index.html                    # 메인 페이지
├── app.js                        # 애플리케이션 메인 로직
│
├── components/                   # UI 위젯 (재사용 가능)
│   ├── upload-widget.js
│   ├── progress-widget.js
│   ├── preview-widget.js
│   └── error-widget.js
│
├── services/                     # 비즈니스 로직
│   ├── file-service.js
│   ├── analysis-service.js
│   └── word-export-service.js
│
├── models/                       # 데이터 구조
│   └── analysis-data.js
│
├── utils/                        # 유틸리티 함수
│   ├── formatters.js
│   ├── validators.js
│   └── xml-utils.js
│
├── styles/                       # 스타일 정의
│   ├── global.css.js
│   └── components.css.js
│
├── docs/                         # 문서
│   ├── ARCHITECTURE.md           # 아키텍처 상세 설명
│   ├── MIGRATION.md              # 마이그레이션 가이드
│   ├── QUICKSTART.md             # 빠른 시작 가이드
│   └── REFACTORING_SUMMARY.md    # 개선 사항 요약
│
└── bm-report.html               # 원본 모놀리틱 버전 (참고용)
```

상세 내용은 [ARCHITECTURE.md](ARCHITECTURE.md)를 참고하세요.

## 🎯 주요 기능

### 1. 데이터 분석
- Excel 파일 자동 파싱
- 영업활동 수집 및 분류
- 키워드 추출 및 빈도 분석
- 경쟁사 모니터링
- 채널별 활동 집계

### 2. 인사이트 생성
- **경쟁 환경**: 경쟁사 위협 요인 식별
- **시장 분위기**: 업계 동향 분석
- **당사 강점**: 경쟁 우위 요소 파악
- **개선 과제**: 해결해야 할 이슈 도출

### 3. 계획 수립
- **단기 과제** (1개월 내): 즉시 대응 항목
- **중기 과제** (분기 내): 구조적 개선 항목

### 4. 보고서 생성
- 전문적인 Word 형식
- 멀티페이지 구성
- 표, 차트, 요약 포함
- 원클릭 다운로드

## 🛠️ 기술 스택

### 프론트엔드
- **HTML5/CSS3**: 모던 웹 표준
- **JavaScript (ES6+)**: 모듈 기반 개발
- **ES Modules**: 파일 간 코드 공유

### 라이브러리
- **XLSX.js**: Excel 파일 읽기
- **JSZip**: Word 문서 (DOCX) 생성
- **정렬 및 포맷팅**: 커스텀 유틸리티

## 💡 아키텍처

### Clean Architecture 기반
```
┌─────────────────────────────┐
│    Presentation Layer       │
│  (UI Widgets & Components)  │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│   Application Layer         │
│     (Orchestration)         │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│  Business Logic Layer       │
│      (Services)             │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│     Data Layer              │
│ (Models & Utilities)        │
└─────────────────────────────┘
```

### 설계 원칙
- 🎯 **단일 책임 원칙 (SRP)**: 각 모듈이 하나의 책임만 담당
- 🔀 **의존성 역전 원칙 (DIP)**: 추상화에 의존
- 🔧 **개방/폐쇄 원칙 (OCP)**: 확장에는 열려있고 수정에는 닫혀있음
- 📦 **관심사의 분리 (SoC)**: 기능별로 명확하게 분리

## 📊 데이터 분석 프로세스

```
1. 파일 업로드
   └─ FileService.readFile()

2. Excel 파싱
   └─ FileService.parseRecords()

3. 데이터 분석
   ├─ 활동 집계
   ├─ 키워드 분석
   ├─ 경쟁사 모니터링
   └─ AnalysisService.analyze()

4. 인사이트 생성
   └─ AnalysisService.generateInsights()

5. 계획 수립
   └─ AnalysisService.generatePlan()

6. 보고서 렌더링
   ├─ PreviewWidget.renderReport()
   └─ 브라우저 미리보기

7. Word 생성
   ├─ WordExportService.buildDocumentXml()
   ├─ WordExportService.generateDocx()
   └─ WordExportService.download()
```

## 🔍 코드 예시

### 새 서비스 추가
```javascript
// services/my-service.js
export class MyService {
  static doSomething(data) {
    // 비즈니스 로직
    return result;
  }
}

// app.js에서 사용
import MyService from './services/my-service.js';
const result = MyService.doSomething(data);
```

### 새 위젯 추가
```javascript
// components/my-widget.js
export class MyWidget {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.init();
  }

  render() {
    this.container.innerHTML = `<div>...</div>`;
  }

  show() {
    this.container.style.display = 'block';
  }

  hide() {
    this.container.style.display = 'none';
  }
}
```

## 📈 성능

- **파일 크기**: 각 모듈 50-200KB
- **초기 로딩**: ~500ms (웹 서버 기준)
- **분석 속도**: 100-1000 레코드 기준 1-2초
- **메모리 사용**: ~50MB (분석 중)

## 🧪 테스트

각 서비스는 독립적으로 테스트 가능:

```javascript
// 콘솔에서 테스트
const rows = [/* 테스트 데이터 */];
const result = AnalysisService.analyze(rows);
console.log('총 활동:', result.total);
console.log('분석 완료:', !!result.insights);
```

## 🐛 알려진 이슈

- 매우 큰 Excel 파일 (100MB+)의 경우 처리 시간 증가
- Internet Explorer 미지원 (모던 브라우저만 지원)

## 📝 문서

- [ARCHITECTURE.md](ARCHITECTURE.md) - 상세 아키텍처 설명
- [MIGRATION.md](MIGRATION.md) - 이전 버전에서의 변경 사항
- [QUICKSTART.md](QUICKSTART.md) - 개발자용 빠른 시작 가이드
- [REFACTORING_SUMMARY.md](REFACTORING_SUMMARY.md) - 리팩토링 개선 사항

## 🎓 학습 자료

### 초급 (구조 이해)
1. [QUICKSTART.md](QUICKSTART.md) 읽기
2. `index.html` 파악
3. `app.js` 흐름 분석

### 중급 (구현 이해)
1. `components/` 위젯 분석
2. `services/` 비즈니스 로직 학습
3. `utils/` 헬퍼 함수 활용

### 고급 (확장 및 최적화)
1. [ARCHITECTURE.md](ARCHITECTURE.md) 정독
2. 새로운 기능 구현
3. 성능 최적화

## 🤝 기여

새로운 기능이나 버그 수정을 원하시나요?

1. 해당 모듈 파악
2. 변경 사항 구현
3. 테스트 검증
4. PR 제출

## 📞 지원

문제 발생 시:
1. 브라우저 콘솔에서 에러 확인
2. 웹 서버 정상 실행 확인
3. 라이브러리 로드 확인 (XLSX, JSZip)
4. [QUICKSTART.md](QUICKSTART.md) FAQ 참고

## 📜 라이선스

프로젝트 내부 용도

## 🎯 향후 계획

### 단기 (1-2주)
- [ ] 유닛 테스트 추가
- [ ] E2E 테스트 구성
- [ ] 성능 최적화

### 중기 (1-2개월)
- [ ] 번들러 통합 (Webpack/Vite)
- [ ] TypeScript 마이그레이션
- [ ] 고급 분석 기능 추가

### 장기 (3-6개월)
- [ ] 프레임워크 마이그레이션 (React/Vue)
- [ ] 서버 백엔드 연동
- [ ] 클라우드 배포

## 🚀 시작하기

지금 바로 시작하세요!

```bash
python -m http.server 8000
# http://localhost:8000 접속
```

---

**Made with ❤️ for Better Business Management**

이전 모놀리틱 버전은 `bm-report.html`에 보관되어 있습니다.
