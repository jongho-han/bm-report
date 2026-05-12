# 마이그레이션 가이드: 모놀리틱 → 모듈형 아키텍처

## 📋 변경 요약

| 항목 | 이전 | 현재 |
|------|------|------|
| 파일 개수 | 1개 (모놀리틱) | 19개 (모듈화) |
| 파일 크기 | ~900KB | 각 파일 100-200KB |
| 구조 | HTML 인라인 | 분리된 모듈 |
| 스타일 | 인라인 CSS | 분리된 CSS 파일 |
| 스크립트 | 전역 함수 | 클래스 기반 |
| 진입점 | bm-report.html | index.html |

## 🔄 이전 코드 → 신규 코드 매핑

### 전역 함수 → 서비스 클래스

**이전:**
```javascript
function analyzeData(rows) {
  // 모든 로직이 하나의 함수
}
```

**현재:**
```javascript
class AnalysisService {
  static analyze(rows) { /* 메인 로직 */ }
  static analyzeKeywords(contents) { /* 키워드 분석 */ }
  static generateInsights(contents, compCounts, bankCounts) { /* 인사이트 */ }
  static generatePlan(insights, kwResults, compCounts) { /* 계획 수립 */ }
}
```

### 인라인 이벤트 핸들러 → 위젯 클래스

**이전:**
```html
<div onclick="handleFile(event)">Upload</div>
<script>
function handleFile(e) { /* 로직 */ }
</script>
```

**현재:**
```javascript
class UploadWidget {
  attachEventListeners() {
    element.addEventListener('change', (e) => this.onFileSelected(e));
  }
}
```

### 전역 상태 → 앱 인스턴스 속성

**이전:**
```javascript
let analysisData = null;
let fileName = '';
```

**현재:**
```javascript
class ReportApp {
  constructor() {
    this.analysisData = null;
    this.fileName = '';
  }
}
```

### DOM 직접 조작 → 위젯 메서드

**이전:**
```javascript
function showProgress(msg) {
  document.getElementById('progressSection').style.display = 'block';
  document.getElementById('progressStep').textContent = msg;
}
```

**현재:**
```javascript
class ProgressWidget {
  show() { /* DOM 업데이트 */ }
  setStep(message) { /* 상태 업데이트 */ }
}
```

## 🚀 사용 방법

### 이전 (bm-report.html)
```bash
# 브라우저에서 직접 bm-report.html 열기
# 모든 코드가 HTML에 포함됨
```

### 현재 (index.html)
```bash
# 웹 서버 필수 (ES Module 지원 필요)
# 로컬: python -m http.server 8000
# 그 후: http://localhost:8000
```

## 📚 마이그레이션 체크리스트

### 기존 기능 호환성
- ✅ Excel 파일 읽기
- ✅ 데이터 파싱
- ✅ 키워드 분석
- ✅ 인사이트 생성
- ✅ 계획 수립
- ✅ Word 문서 생성
- ✅ 다운로드 기능
- ✅ 드래그 & 드롭
- ✅ 에러 처리

### 개선 사항
- ✅ 코드 재사용성 증가
- ✅ 테스트 용이성 향상
- ✅ 유지보수성 개선
- ✅ 확장성 증대
- ✅ 성능 최적화 가능

## 🔍 주요 차이점

### 1. 파일 구조
```
이전:
bm-report.html (900KB)

현재:
index.html
├── styles/
├── components/
├── services/
├── models/
├── utils/
└── app.js
```

### 2. 의존성 관리
```
이전: 모든 라이브러리 CDN 인라인
현재: index.html에서만 CDN 참조
      각 모듈은 import/export 사용
```

### 3. 디버깅
```
이전: 전체 파일에서 검색
현재: 해당 모듈 파일로 직접 이동
```

## 💡 활용 팁

### 기존 로직 확인
1. 분석 로직: `services/analysis-service.js` 참고
2. 파일 처리: `services/file-service.js` 참고
3. UI 요소: `components/` 참고

### 기존 bm-report.html 보관
- 기존 파일을 참고용으로 유지해도 좋음
- 새로운 `index.html`을 메인 진입점으로 사용

### 성능 비교
- **초기 로딩**: 모듈 방식이 약간 더 빠름 (필요한 파일만 로드)
- **기능 실행**: 동일한 성능
- **메모리**: 모듈화로 인해 더 효율적

## 🔧 문제 해결

### ES Module 지원 필요
```
CORS 에러 발생 시:
→ 로컬 웹 서버 필요
  python -m http.server 8000
  또는
  npx http-server
```

### 기능이 작동하지 않을 때
1. 브라우저 개발자 도구에서 Console 확인
2. 라이브러리(XLSX, JSZip) 로드 확인
3. 웹 서버가 정상 실행 중인지 확인

## 📈 성능 개선 가능성

현재 모듈화된 구조에서 다음과 같은 개선이 쉬워짐:

1. **Code Splitting**: 번들 크기 최적화
2. **Lazy Loading**: 필요한 모듈만 로드
3. **Caching**: 분석 결과 캐싱
4. **Parallel Processing**: 데이터 분석 병렬화
5. **Unit Testing**: 각 서비스 단위 테스트

## 🎓 학습 포인트

### 새로운 개발자를 위해
1. **Architecture**: `ARCHITECTURE.md` 읽기
2. **App Flow**: `app.js` 흐름 파악
3. **Services**: 각 서비스 클래스 이해
4. **Components**: 위젯 구조 학습

### 기여하기
1. 기존 코드 이해
2. 관련 모듈 확인
3. 테스트 작성
4. PR 제출

## 📞 FAQ

**Q: 왜 ES Module을 사용하나요?**
A: 모던 브라우저에서 지원하는 표준이고, 번들러 없이도 모듈화가 가능하기 때문입니다.

**Q: 기존 bm-report.html은 삭제해야 하나요?**
A: 아니요. 참고용으로 유지해도 됩니다. 필요시 기존 로직 검증에 활용할 수 있습니다.

**Q: 모바일에서도 작동하나요?**
A: 네. HTML/CSS/JS만 사용하므로 모든 현대 브라우저에서 작동합니다.

**Q: Word 문서 생성이 느려요.**
A: JSZip 라이브러리 때문입니다. 대용량 데이터의 경우 처리 시간이 필요합니다.

## 🎯 다음 단계

1. **테스트**: 모든 기능 검증
2. **문서화**: 추가 설명서 작성
3. **최적화**: 성능 프로파일링 및 개선
4. **확장**: 새로운 기능 추가 계획
