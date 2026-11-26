/* ============================================================
   운영 설정 — 이 파일만 고치면 됩니다.
   ============================================================ */
window.CONFIG = {
  // 화면에 표시되는 학원 이름
  brand: 'SBS아카데미게임학원 광주',

  // Apps Script 웹앱 URL (SETUP.md 3단계에서 복사). 비워 두면 '테스트 모드'로 동작하고 아무것도 저장되지 않습니다.
  apiUrl: 'https://script.google.com/macros/s/AKfycby84Q5hVtNtWIy240mTeFPBn7WCARz2wYdwrTU6qRAmJ2Sk139KuoZOwE2DJsimRqiCzA/exec',

  // 학원 대표 전화번호 (예: '062-000-0000'). 비워 두면 전화 버튼이 숨겨집니다.
  phone: '',

  // 개인정보 보유기간 문구 (Apps Script의 RETENTION_DAYS와 맞출 것)
  retention: '신청일로부터 1년 보관 후 파기',

  // 결과 화면에서 분야별로 연결할 체험 자료 링크 (없으면 비워 두기)
  // 예: model: 'https://...3D 제작과정 상담체험 공유 링크'
  links: {
    plan: '', dev: '', art: '', model: '', toon: '', novel: ''
  },

  // 공용 태블릿(?kiosk=1)에서 결과 화면 방치 시 처음으로 돌아가는 시간(초)
  kioskResetSec: 90,

  // 현장 상담 모드(?mode=consult)에서 아무도 안 만질 때 처음으로 돌아가는 시간(초). 상담 중 결과를 같이 보니 길게.
  consultResetSec: 900
};
