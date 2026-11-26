/* ============================================================
   진로탐색 & 준비도 테스트 — 구글시트 저장/조회
   1) 새 구글시트 > 확장 프로그램 > Apps Script 에 이 파일 붙여넣기
   2) setup 함수 1회 실행 (권한 허용) → 실행 로그에 관리자 키 출력
   3) 배포 > 새 배포 > 웹 앱 (실행: 나, 액세스: 모든 사용자)
   ============================================================ */

const RETENTION_DAYS = 365;              // 상담신청 보관 기간 (config.js 의 retention 문구와 맞출 것)
const LOG_RETENTION_DAYS = 730;          // 익명 응답로그 보관 기간

const SH_LOG = '응답로그';
const SH_APPLY = '상담신청';
const SH_SUM = '유입요약';

const LOG_HEAD = ['일시', '세션ID', '이벤트', '유입경로', '대상', '나이구분', '1위', '2위', '준비도', '패턴', '소요초', '응답요약'];
const APPLY_HEAD = ['신청일시', '신청ID', '세션ID', '이름', '연락처', '연락희망시간', '나이구분', '대상', '유입경로',
  '알고싶은것', '상담질문', '와닿은결과', '1위', '2위', '점수', '준비도', '패턴', '응답상세(JSON)', '마케팅동의',
  '진행상태', '담당자', '메모', '모드', '보호자확인', '달랐던점'];
const STATUS = ['신규', '상담중', '연락완료', '상담예약', '상담완료', '체험참여', '등록', '보류', '부재'];

const DOMAIN_NAME = { plan: '게임기획', dev: '프로그래밍', art: '원화', model: '3D', toon: '웹툰', novel: '웹소설' };
const LEVEL_NAME = { explore: '탐색', basic: '기초', pro: '실전' };

/* ---------- 최초 1회 실행 ---------- */
function setup() {
  const ss = SpreadsheetApp.getActive();
  const log = ensureSheet(ss, SH_LOG, LOG_HEAD);
  const ap = ensureSheet(ss, SH_APPLY, APPLY_HEAD);
  log.setFrozenRows(1); ap.setFrozenRows(1);

  // 진행상태 드롭다운
  const stCol = APPLY_HEAD.indexOf('진행상태') + 1;
  ap.getRange(2, stCol, ap.getMaxRows() - 1, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(STATUS, true).setAllowInvalid(false).build());
  ap.getRange(2, APPLY_HEAD.indexOf('연락처') + 1, ap.getMaxRows() - 1, 1).setNumberFormat('@');
  ap.setColumnWidth(APPLY_HEAD.indexOf('응답상세(JSON)') + 1, 80);

  // 유입경로별 요약 (수식 자동 계산)
  let sum = ss.getSheetByName(SH_SUM);
  if (!sum) sum = ss.insertSheet(SH_SUM);
  sum.clear();
  sum.getRange('A1:F1').setValues([['유입경로', '시작', '완료', '상담신청', '완료율', '신청률(완료 대비)']]).setFontWeight('bold');
  sum.getRange('A2').setValue('전체');
  sum.getRange('B2').setFormula(`=COUNTIF('${SH_LOG}'!C:C,"start")`);
  sum.getRange('C2').setFormula(`=COUNTIF('${SH_LOG}'!C:C,"complete")`);
  sum.getRange('D2').setFormula(`=COUNTA('${SH_APPLY}'!B2:B)`);
  sum.getRange('E2').setFormula('=IFERROR(C2/B2,"")');
  sum.getRange('F2').setFormula('=IFERROR(D2/C2,"")');
  sum.getRange('A3').setFormula(`=IFERROR(SORT(UNIQUE(FILTER('${SH_LOG}'!D2:D,'${SH_LOG}'!D2:D<>""))),"")`);
  sum.getRange('B3').setFormula(`=MAP(A3:A,LAMBDA(s,IF(s="",,COUNTIFS('${SH_LOG}'!D:D,s,'${SH_LOG}'!C:C,"start"))))`);
  sum.getRange('C3').setFormula(`=MAP(A3:A,LAMBDA(s,IF(s="",,COUNTIFS('${SH_LOG}'!D:D,s,'${SH_LOG}'!C:C,"complete"))))`);
  sum.getRange('D3').setFormula(`=MAP(A3:A,LAMBDA(s,IF(s="",,COUNTIF('${SH_APPLY}'!I:I,s))))`);
  sum.getRange('E3').setFormula('=MAP(B3:B,C3:C,LAMBDA(b,c,IF(b="",,IFERROR(c/b,""))))');
  sum.getRange('F3').setFormula('=MAP(C3:C,D3:D,LAMBDA(c,d,IF(c="",,IFERROR(d/c,""))))');
  sum.getRange('E2:F200').setNumberFormat('0.0%');
  sum.setFrozenRows(2);
  sum.getRange('H1').setValue('※ 테스트 링크 끝에 ?src=인스타 처럼 붙이면 채널별로 따로 집계됩니다.');

  // 관리자 키 (상담카드 페이지 접속용)
  const props = PropertiesService.getScriptProperties();
  let key = props.getProperty('ADMIN_KEY');
  if (!key) { key = Utilities.getUuid().replace(/-/g, '').slice(0, 16); props.setProperty('ADMIN_KEY', key); }

  // 보관기간 지난 데이터 자동 파기 (매일 새벽 3시)
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'purgeOld').forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('purgeOld').timeBased().everyDays(1).atHour(3).create();

  Logger.log('설정 완료. 상담카드 관리자 키: ' + key);
}

function showAdminKey() { Logger.log(PropertiesService.getScriptProperties().getProperty('ADMIN_KEY')); }
function resetAdminKey() {
  const key = Utilities.getUuid().replace(/-/g, '').slice(0, 16);
  PropertiesService.getScriptProperties().setProperty('ADMIN_KEY', key);
  Logger.log('새 관리자 키: ' + key);
}

function ensureSheet(ss, name, head) {
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (sh.getLastRow() === 0) sh.appendRow(head);
  sh.getRange(1, 1, 1, head.length).setValues([head]).setFontWeight('bold').setBackground('#EEF0FF');
  return sh;
}

/* ---------- 테스트 화면 → 저장 ---------- */
function doPost(e) {
  let result;
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const d = JSON.parse(e.postData.contents);
    if (d.action === 'log') result = appendLog(d);
    else if (d.action === 'apply') result = appendApply(d);
    else result = { ok: false, error: 'unknown action' };
  } catch (err) {
    result = { ok: false, error: String(err) };
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
  return json(result);
}

function appendLog(d) {
  if (['start', 'complete'].indexOf(d.event) < 0) return { ok: false, error: 'bad event' };
  const sh = SpreadsheetApp.getActive().getSheetByName(SH_LOG);
  sh.appendRow([new Date(), clean(d.sid, 20), d.event, clean(d.src, 40), clean(d.track, 10), clean(d.age, 10),
    DOMAIN_NAME[d.top1] || '', DOMAIN_NAME[d.top2] || '', LEVEL_NAME[d.level] || '', clean(d.flags, 80),
    Number(d.sec) || '', clean(d.answers, 200)]);
  return { ok: true };
}

function appendApply(d) {
  if (d.company) return { ok: true };                               // 봇 차단용 숨은 칸이 채워짐 → 조용히 무시
  const consult = d.mode === 'consult';                             // 현장 상담 모드: 연락처 선택, 14세 미만은 상담자가 보호자 동의 확인
  if (d.age === 'u14' && !(consult && d.guardian === true)) return { ok: false, error: '만 14세 미만은 보호자 동의 필요' };
  const name = clean(d.name, 20);
  const phone = String(d.phone || '').replace(/\D/g, '');
  const phoneOk = /^01[016789]\d{7,8}$/.test(phone);
  if (name.length < 2 || (consult ? (phone && !phoneOk) : !phoneOk)) return { ok: false, error: '입력값 확인' };

  const sh = SpreadsheetApp.getActive().getSheetByName(SH_APPLY);
  const id = 'A' + Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyMMdd') + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
  const phoneFmt = phoneOk ? phone.replace(/^(\d{3})(\d{3,4})(\d{4})$/, '$1-$2-$3') : '';
  const feelMap = { top1: DOMAIN_NAME[d.top1], top2: DOMAIN_NAME[d.top2], both: '둘 다 비슷', none: '둘 다 아님' };
  const scoreTxt = Object.keys(DOMAIN_NAME).map(k => DOMAIN_NAME[k] + ' ' + ((d.scores || {})[k] || 0)).join(' / ');
  sh.appendRow([new Date(), id, clean(d.sid, 20), name, phoneFmt, clean(d.when, 20), clean(d.age, 10), clean(d.track, 10),
    clean(d.src, 40), clean(d.curiousLabel || d.curious, 200), clean(d.question, 100), feelMap[d.feel] || '',
    DOMAIN_NAME[d.top1] || '', DOMAIN_NAME[d.top2] || '', scoreTxt, LEVEL_NAME[d.level] || '', clean(d.flags, 80),
    JSON.stringify(d.detail || {}).slice(0, 5000), (phoneOk && d.marketing) ? 'Y' : 'N', consult ? '상담중' : '신규', '', '',
    consult ? '현장상담' : '온라인', d.guardian === true ? '상담자 확인' : '', clean(d.differ, 100)]);
  return { ok: true, id: id };
}

/* ---------- 상담카드 페이지 → 조회 (관리자 키 필요) ---------- */
function doGet(e) {
  const p = e.parameter || {};
  const key = PropertiesService.getScriptProperties().getProperty('ADMIN_KEY');
  if (!key || p.key !== key) return json({ ok: false, error: '관리자 키가 올바르지 않습니다' });
  if (p.action === 'list') return json({ ok: true, rows: listApply(Number(p.limit) || 100) });
  return json({ ok: false, error: 'unknown action' });
}

function listApply(limit) {
  const sh = SpreadsheetApp.getActive().getSheetByName(SH_APPLY);
  const n = sh.getLastRow() - 1;
  if (n <= 0) return [];
  const take = Math.min(n, limit);
  const vals = sh.getRange(sh.getLastRow() - take + 1, 1, take, APPLY_HEAD.length).getValues();
  const col = h => APPLY_HEAD.indexOf(h);
  return vals.reverse().map(r => {
    let detail = {};
    try { detail = JSON.parse(r[col('응답상세(JSON)')] || '{}'); } catch (x) {}
    return {
      at: r[col('신청일시')] instanceof Date ? Utilities.formatDate(r[col('신청일시')], 'Asia/Seoul', 'yyyy-MM-dd HH:mm') : String(r[col('신청일시')]),
      id: r[col('신청ID')], name: r[col('이름')], phone: r[col('연락처')], when: r[col('연락희망시간')],
      age: r[col('나이구분')], track: r[col('대상')], src: r[col('유입경로')], curious: r[col('알고싶은것')],
      question: r[col('상담질문')], feel: r[col('와닿은결과')], marketing: r[col('마케팅동의')],
      status: r[col('진행상태')], owner: r[col('담당자')], memo: r[col('메모')],
      mode: r[col('모드')] || '온라인', guardian: r[col('보호자확인')], differ: r[col('달랐던점')], detail: detail
    };
  });
}

/* ---------- 보관기간 지난 데이터 파기 (트리거로 매일 실행) ---------- */
function purgeOld() {
  purgeSheet(SH_APPLY, RETENTION_DAYS);
  purgeSheet(SH_LOG, LOG_RETENTION_DAYS);
}
function purgeSheet(name, days) {
  const sh = SpreadsheetApp.getActive().getSheetByName(name);
  if (!sh || sh.getLastRow() < 2) return;
  const cutoff = new Date(Date.now() - days * 86400000);
  const dates = sh.getRange(2, 1, sh.getLastRow() - 1, 1).getValues();
  for (let i = dates.length - 1; i >= 0; i--) {
    if (dates[i][0] instanceof Date && dates[i][0] < cutoff) sh.deleteRow(i + 2);
  }
}

/* ---------- 공통 ---------- */
function clean(v, max) {
  let s = String(v == null ? '' : v).replace(/[\r\n\t]+/g, ' ').trim().slice(0, max || 100);
  if (/^[=+\-@]/.test(s)) s = "'" + s;                         // 시트 수식 주입 방지
  return s;
}
function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
