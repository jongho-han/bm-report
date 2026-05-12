# BM 영업일지 보고서 생성기 - 리팩토링된 아키텍처

## 📁 프로젝트 구조

```
bm_report/
├── index.html              # 메인 진입점
├── app.js                  # 애플리케이션 메인 로직
├── bm-report.html          # (기존) 모놀리틱 버전 (참고용)
│
├── styles/
│   ├── global.css.js       # 전역 스타일 및 디자인 토큰
│   └── components.css.js   # 컴포넌트 스타일
│
├── components/             # 재사용 가능한 UI 위젯
│   ├── upload-widget.js    # 파일 업로드 컴포넌트
│   ├── progress-widget.js  # 진행 상황 표시 컴포넌트
│   ├── preview-widget.js   # 보고서 미리보기 컴포넌트
│   └── error-widget.js     # 에러 메시지 컴포넌트
│
├── services/               # 비즈니스 로직 (서비스 계층)
│   ├── file-service.js     # 파일 읽기 및 파싱
│   ├── analysis-service.js # 데이터 분석 및 인사이트 생성
│   └── word-export-service.js  # Word 문서 생성
│
├── models/                 # 데이터 모델 및 엔티티
│   └── analysis-data.js    # 분석 데이터 구조
│
└── utils/                  # 유틸리티 함수
    ├── formatters.js       # 날짜/텍스트 포맷팅
    ├── validators.js       # 입력 유효성 검증
    └── xml-utils.js        # Word XML 생성 헬퍼
```

## 🏗️ 아키텍처 개요

### Clean Architecture 원칙 적용

```
┌─────────────────────────────────────┐
│       Presentation Layer (UI)        │
│  - Widgets (Components)              │
│  - index.html                        │
└────────┬────────────────────────────┘
         │
┌────────▼─────────────────────────────┐
│    Application Layer (app.js)        │
│  - App orchestration                 │
│  - Widget management                 │
└────────┬────────────────────────────┘
         │
┌────────▼─────────────────────────────┐
│    Business Logic Layer (Services)   │
│  - FileService                       │
│  - AnalysisService                   │
│  - WordExportService                 │
└────────┬────────────────────────────┘
         │
┌────────▼─────────────────────────────┐
│    Data Layer                        │
│  - Models (AnalysisData)             │
│  - Utils (Formatters, Validators)    │
└─────────────────────────────────────┘
```

## 🎯 주요 개선 사항

### 1. **모듈화 (Modularity)**
- 단일 파일에서 기능별로 분리
- 각 모듈이 단일 책임 원칙(SRP) 준수
- 재사용 가능하고 테스트 가능한 컴포넌트

### 2. **관심의 분리 (Separation of Concerns)**
- **UI Layer**: 사용자 인터페이스 전담
- **Service Layer**: 비즈니스 로직 전담
- **Model Layer**: 데이터 구조 정의
- **Utility Layer**: 공통 기능 제공

### 3. **위젯화 (Componentization)**
각 UI 요소가 독립적인 위젯으로 구성:
- `UploadWidget`: 파일 업로드 관리
- `ProgressWidget`: 진행 상황 표시
- `PreviewWidget`: 보고서 렌더링
- `ErrorWidget`: 에러 처리

### 4. **서비스 계층**
비즈니스 로직을 서비스로 캡슐화:
- `FileService`: Excel 파일 처리
- `AnalysisService`: 데이터 분석 알고리즘
- `WordExportService`: DOCX 생성

## 📦 각 파일 설명

### `app.js` - Application Orchestrator
- 모든 위젯과 서비스를 조합
- 사용자 인터랙션 흐름 관리
- 상태 관리 중앙화

```javascript
class ReportApp {
  - initializeWidgets()  // 위젯 초기화
  - handleFileSelected() // 파일 선택 처리
  - handleDownload()     // Word 다운로드
  - handleReset()        // 상태 초기화
}
```

### `components/*.js` - Widget Components
각 위젯은 독립적인 클래스:

```javascript
class UploadWidget {
  - render()             // DOM 구성
  - attachEventListeners() // 이벤트 바인딩
  - show()/hide()        // 가시성 제어
}
```

### `services/*.js` - Service Layer
정적 메서드 기반의 유틸리티 클래스:

```javascript
class FileService {
  - readFile()           // Excel 읽기
  - parseRecords()       // 데이터 파싱
}

class AnalysisService {
  - analyze()            // 전체 분석 실행
  - analyzeKeywords()    // 키워드 분석
  - generateInsights()   // 인사이트 생성
}

class WordExportService {
  - buildDocumentXml()   // Word XML 생성
  - generateDocx()       // DOCX 압축 파일 생성
  - download()           // 파일 다운로드
}
```

### `utils/*.js` - Utility Functions
공통 기능 제공:

```javascript
// formatters.js - 포맷팅
Formatters.formatDate(date)      // "2026년 5월 12일"
Formatters.formatRange(start, end) // "2026년 5월 1일 ~ 5월 31일"
Formatters.escapeXml(text)       // XML 특수문자 이스케이프

// validators.js - 유효성 검증
Validators.validateFile(file)    // 파일 검증
Validators.validateData(rows)    // 데이터 검증

// xml-utils.js - Word XML 생성
XmlUtils.makeRun(text, opts)     // 텍스트 요소
XmlUtils.makePara(runs, opts)    // 단락
XmlUtils.makeTable(colWidths, rows) // 표
```

### `models/*.js` - Data Models
데이터 구조 정의:

```javascript
class AnalysisData {
  - total: number        // 총 활동 건수
  - records: array       // 파싱된 레코드
  - kwResults: array     // 키워드 분석 결과
  - insights: object     // 인사이트 (danger, info, success, warn)
  - plan: object         // 향후 계획 (short, mid)
}
```

## 🔄 데이터 흐름

```
파일 선택
   ↓
FileService.readFile() → Excel 파싱
   ↓
AnalysisService.analyze() → 데이터 분석
   ↓
AnalysisData 모델 생성
   ↓
PreviewWidget.renderReport() → HTML 렌더링
   ↓
WordExportService.generateDocx() → DOCX 생성
   ↓
다운로드
```

## 🚀 확장성

### 새 기능 추가 예시

**1. 새로운 분석 알고리즘 추가:**
```javascript
// services/analysis-service.js에 메서드 추가
static analyzeNewMetric(contents) {
  // 새로운 분석 로직
}
```

**2. 새로운 UI 위젯 추가:**
```javascript
// components/custom-widget.js 생성
export class CustomWidget {
  constructor(containerId) { ... }
  render() { ... }
  show() { ... }
  hide() { ... }
}
```

**3. 새로운 내보내기 형식 추가:**
```javascript
// services/csv-export-service.js (새로 생성)
export class CsvExportService {
  static generateCsv(data) { ... }
  static download(blob, fileName) { ... }
}
```

## 🧪 테스트 용이성

각 서비스는 외부 의존성 없이 테스트 가능:

```javascript
// 테스트 예시
const rows = [/* mock data */];
const result = AnalysisService.analyze(rows);
console.assert(result.total === 10);
```

## 📝 개선된 유지보수성

- **명확한 책임 분리**: 각 파일의 목적이 명확
- **낮은 결합도**: 모듈 간 의존성 최소화
- **높은 응집도**: 관련된 기능이 같은 파일에 위치
- **코드 재사용**: 공통 기능이 유틸리티로 중앙화
- **확장 가능**: 새 기능 추가 시 기존 코드 수정 최소화

## 🔍 성능

- **번들 크기**: 모듈 분리로 필요한 부분만 로드 가능
- **메모리**: 각 서비스가 필요한 순간에만 활성화
- **초기 로딩**: index.html 가벼움

## 📚 개발 가이드

### 새 위젯 추가
1. `components/` 디렉토리에 파일 생성
2. 클래스 기본 구조 구현 (render, show, hide)
3. `app.js`에서 인스턴스 생성 및 초기화
4. 필요한 스타일을 `styles/components.css.js`에 추가

### 새 서비스 추가
1. `services/` 디렉토리에 파일 생성
2. 정적 메서드로 기능 구현
3. `app.js`에서 import 및 사용

### 코드 스타일
- ESM (ES Modules) 사용
- 클래스 기반 구조
- JSDoc 주석 작성
- 명시적 타입 표기 (파라미터, 반환값)
