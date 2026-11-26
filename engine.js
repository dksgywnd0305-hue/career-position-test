/* ============================================================
   문항 · 채점 규칙 · 결과 문구 (테스트 화면과 상담카드가 함께 씀)
   문구를 고치려면 이 파일만 수정하면 됩니다.
   ============================================================ */
(function () {
  const ORDER = ['plan', 'dev', 'art', 'model', 'toon', 'novel'];

  // 이웃 분야(헷갈리기 쉬운 짝): 순환 고리 원화-웹툰-웹소설-기획-프로그래밍-3D-원화
  const NEIGHBORS = [['art','toon'],['toon','novel'],['novel','plan'],['plan','dev'],['dev','model'],['model','art']];

  const DOMAINS = {
    plan: {
      name: '게임 기획', type: '룰 메이커형', color: '#7C5CFF',
      desc: '재미가 생기는 ‘규칙’을 설계할 때 신나는 타입. 숫자·구조·흐름을 만지는 걸 좋아해요.',
      job: '게임 기획자는 레벨·전투·보상·퀘스트 같은 규칙을 문서와 표로 설계하고, 개발팀과 맞춰 가며 완성합니다.',
      unknown: '아이디어를 내는 것과, 다른 사람이 만들 수 있게 문서로 정리하는 건 다른 일이에요. 문서 작업이 맞는지는 아직 몰라요.',
      task: {
        explore: '좋아하는 게임 하나의 ‘전투 규칙’을 A4 한 장에 정리해 보기',
        basic: '간단한 보드게임을 직접 만들어 친구 3명과 테스트 플레이하기',
        pro: '기획서 1편과 밸런스 시트를 포트폴리오 형태로 다듬기'
      },
      ask: '아이디어 내기와 문서로 설득하기 중 어느 쪽이 더 재미있었는지'
    },
    dev: {
      name: '게임 프로그래밍', type: '버그 사냥꾼형', color: '#00B89C',
      desc: '‘왜 안 되지?’를 끝까지 파고들어 해결할 때 쾌감을 느끼는 타입. 논리로 움직이는 결과를 좋아해요.',
      job: '게임 프로그래머는 캐릭터 움직임·전투·UI·서버 같은 기능을 코드로 구현하고, 버그를 찾아 고칩니다.',
      unknown: '게임을 좋아하는 것과 코드를 오래 붙잡고 있는 건 달라요. 막히는 순간을 버틸 수 있는지는 직접 해 봐야 알아요.',
      task: {
        explore: '무료 게임 엔진 튜토리얼로 ‘공이 튀는’ 장면 하나 만들어 보기',
        basic: '점프·충돌·점수가 있는 미니게임 한 개를 끝까지 완성하기',
        pro: '직접 만든 게임 데모와 코드 설명 문서를 포트폴리오로 정리하기'
      },
      ask: '막혔을 때 혼자 검색해서 풀어 본 경험이 있는지'
    },
    art: {
      name: '게임 원화', type: '콘셉트 아티스트형', color: '#FF4F7E',
      desc: '캐릭터·배경이 ‘어떻게 생겼는지’를 정하는 순간이 가장 즐거운 타입. 디자인 감각을 쓰는 걸 좋아해요.',
      job: '게임 원화가는 캐릭터·의상·배경·아이템 디자인을 그려, 3D·개발팀이 만들 수 있는 기준을 만듭니다.',
      unknown: '그림을 좋아하는 것과, 정해진 설정에 맞춰 여러 번 수정하는 작업이 맞는지는 아직 몰라요.',
      task: {
        explore: '좋아하는 캐릭터를 정면·측면 두 방향으로 그려 보기',
        basic: '오리지널 캐릭터 1명을 3면도와 표정 6종으로 완성하기',
        pro: '캐릭터·배경 시트 5장 이상으로 포트폴리오 구성하기'
      },
      ask: '혼자 그리는 그림과 ‘주문받은’ 디자인 중 어느 쪽이 편한지'
    },
    model: {
      name: '게임 3D 그래픽', type: '디지털 조각가형', color: '#FF8A00',
      desc: '머릿속 형태를 입체로 깎아 360도로 완성할 때 만족하는 타입. 손으로 만드는 결과물을 좋아해요.',
      job: '게임 3D 아티스트는 캐릭터·배경을 3D로 만들고 텍스처를 입혀, 게임 엔진에서 쓸 수 있게 다듬습니다.',
      unknown: '보는 것과 달리 3D는 툴 조작과 긴 작업 시간이 많아요. 그 과정이 즐거운지는 직접 만져 봐야 알아요.',
      task: {
        explore: '무료 3D 툴로 컵이나 검 같은 소품 하나 만들어 보기',
        basic: '로우폴리 캐릭터 1개를 모델링부터 텍스처까지 완성하기',
        pro: '엔진에 올린 캐릭터·배경 작업물로 포트폴리오 영상 만들기'
      },
      ask: '그림을 먼저 그리는 쪽과 바로 입체로 만드는 쪽 중 어느 쪽이 끌리는지'
    },
    toon: {
      name: '웹툰', type: '컷 연출가형', color: '#2F8FFF',
      desc: '장면을 컷으로 나눠 ‘보는 사람의 감정’을 움직일 때 신나는 타입. 그림으로 이야기하는 걸 좋아해요.',
      job: '웹툰 작가는 콘티로 이야기를 컷에 배치하고, 작화·채색까지 연재 일정에 맞춰 완성합니다.',
      unknown: '한 컷을 잘 그리는 것과 매주 수십 컷을 마감하는 건 다른 문제예요. 연재 속도를 버틸 수 있는지는 아직 몰라요.',
      task: {
        explore: '좋아하는 장면 하나를 4컷 콘티로 나눠 보기',
        basic: '8~10컷짜리 단편 1화를 콘티부터 채색까지 완성하기',
        pro: '3화 분량 원고와 기획서로 공모전·투고 준비하기'
      },
      ask: '그림 실력과 이야기 연출 중 어느 쪽을 더 키우고 싶은지'
    },
    novel: {
      name: '웹소설', type: '문장 설계자형', color: '#5FAF1E',
      desc: '문장과 대사로 세계와 감정을 만들어 낼 때 몰입하는 타입. 상상을 글로 풀어내는 걸 좋아해요.',
      job: '웹소설 작가는 세계관과 인물을 설계하고, 독자 반응을 보며 매일 연재를 이어 갑니다.',
      unknown: '이야기를 상상하는 것과 매일 정해진 분량을 쓰는 건 달라요. 꾸준히 쓰는 습관이 맞는지는 아직 몰라요.',
      task: {
        explore: '좋아하는 작품의 첫 화를 분석하고, 내 이야기 첫 장면을 1천 자 써 보기',
        basic: '5화(약 2만 5천 자) 연재분과 시놉시스 완성하기',
        pro: '25화 이상 비축분으로 플랫폼 연재·공모전 도전하기'
      },
      ask: '상상한 이야기를 끝까지 써 본 적이 있는지'
    }
  };

  // 취향 양자택일 9문항: 각 분야가 정확히 3번씩 등장
  const PAIRS = [
    { id: 1, prompt: '새 게임 주인공의 설정이 나왔어요.',
      a: { d: 'art',   text: '주인공을 정면·측면·뒷면으로 정교하게 그리기', short: '정면·측면·뒷면 캐릭터 설정화' },
      b: { d: 'toon',  text: '주인공과 라이벌이 다투는 장면을 4컷으로 그리기', short: '다투는 장면 4컷' } },
    { id: 2, prompt: '두 캐릭터의 고백 장면을 만들어야 해요.',
      a: { d: 'toon',  text: '컷 나누기와 표정으로 설렘을 연출하기', short: '컷과 표정으로 고백 연출' },
      b: { d: 'novel', text: '대사와 문장만으로 설렘을 살리기', short: '문장으로 고백 장면 쓰기' } },
    { id: 3, prompt: '이세계로 떨어진 주인공 이야기를 만들어요.',
      a: { d: 'novel', text: '주인공이 왜 이 세계에 왔는지, 사연을 쓰기', short: '주인공의 사연 쓰기' },
      b: { d: 'plan',  text: '이 세계에서 레벨업하는 규칙을 짜기', short: '레벨업 규칙 짜기' } },
    { id: 4, prompt: '보스 몬스터 하나를 게임에 넣어요.',
      a: { d: 'plan',  text: '보스의 공격 패턴과 보상을 표로 설계하기', short: '보스 패턴·보상 설계' },
      b: { d: 'dev',   text: '그 보스가 실제로 움직이도록 코드로 구현하기', short: '보스를 코드로 구현' } },
    { id: 5, prompt: '플레이어 캐릭터를 움직이게 해야 해요.',
      a: { d: 'dev',   text: '버튼을 누르면 캐릭터가 점프하게 만들기', short: '버튼으로 점프 구현' },
      b: { d: 'model', text: '캐릭터를 3D로 깎고 뼈대를 심어 움직이기', short: '3D 캐릭터에 뼈대 심기' } },
    { id: 6, prompt: '전설의 검 하나가 필요해요.',
      a: { d: 'model', text: '검을 3D로 만들어 360도 돌려 보기', short: '검을 3D로 만들기' },
      b: { d: 'art',   text: '검의 디자인 시안을 5종 그리기', short: '검 디자인 시안 5종' } },
    { id: 7, prompt: '새 직업 ‘연금술사’를 추가해요.',
      a: { d: 'art',   text: '연금술사의 의상과 소품 디자인하기', short: '연금술사 의상 디자인' },
      b: { d: 'plan',  text: '연금술사 스킬 5개와 수치 밸런스 정하기', short: '스킬 5개와 밸런스' } },
    { id: 8, prompt: '이번 주, 꼭 끝내야 하는 일이 있어요.', grind: true,
      a: { d: 'toon',  text: '연재 마감에 맞춰 60컷을 완성하기', short: '마감 맞춰 60컷 완성' },
      b: { d: 'dev',   text: '게임이 튕기는 버그의 원인을 끝까지 찾아 고치기', short: '버그 원인 끝까지 추적' } },
    { id: 9, prompt: '한 달 동안 매일 이어 가야 하는 일이에요.', grind: true,
      a: { d: 'novel', text: '매일 5천 자씩 연재를 이어 가기', short: '매일 5천 자 연재' },
      b: { d: 'model', text: '골목 3D 배경 하나를 빛·재질까지 완성해 가기', short: '3D 골목 배경 완성' } }
  ];

  const Q10 = {
    id: 10, prompt: '1년 뒤, 내 포트폴리오에 가장 있었으면 하는 것은?',
    options: [
      { d: 'plan',  text: '직접 짠 게임 규칙서와 밸런스 표' },
      { d: 'dev',   text: '내가 코딩해서 실제로 돌아가는 게임 데모' },
      { d: 'art',   text: '캐릭터·배경 콘셉트 아트 모음집' },
      { d: 'model', text: '360도로 돌려 볼 수 있는 3D 캐릭터' },
      { d: 'toon',  text: '1화부터 완결까지 그린 단편 웹툰' },
      { d: 'novel', text: '10만 자 넘게 연재한 웹소설' },
      { d: 'unsure', text: '아직 잘 모르겠다' }
    ]
  };

  const AGE = [
    { v: 'u14',   label: '만 14세 미만', track: 'teen' },
    { v: 'teen',  label: '만 14세 이상 중·고등학생', track: 'teen' },
    { v: 'adult', label: '고교 졸업 이후 (대학·취업준비·직장)', track: 'adult' }
  ];

  const CURIOUS = {
    teen: [
      { v: 'fit', label: '나에게 맞는 분야가 뭔지' },
      { v: 'hobbyjob', label: '좋아하는 것과 직업으로 하는 것의 차이' },
      { v: 'entrance', label: '입시(대학·특성화고) 준비 방법' },
      { v: 'portfolio', label: '포트폴리오를 어떻게 만드는지' },
      { v: 'parents', label: '부모님께 진로를 어떻게 설명할지' }
    ],
    adult: [
      { v: 'fit', label: '나에게 맞는 직무가 뭔지' },
      { v: 'hobbyjob', label: '좋아하는 것과 직업으로 하는 것의 차이' },
      { v: 'job', label: '취업·데뷔까지 무엇을 준비할지' },
      { v: 'portfolio', label: '포트폴리오를 어떻게 만드는지' },
      { v: 'late', label: '지금 시작해도 늦지 않은지' }
    ]
  };

  const STATE_QS = [
    { key: 'exp', prompt: '그림·글·게임 같은 걸 직접 만들어 본 적이 있나요?',
      options: [ { v: 0, label: '아직 없다' }, { v: 1, label: '강의·튜토리얼을 따라 해 본 정도' }, { v: 2, label: '혼자 끝까지 완성한 작품이 있다' } ] },
    { key: 'goal', prompt: '지금 목표에 가장 가까운 것은?',
      options: {
        teen:  [ { v: 'explore', label: '진로를 알아보는 중' }, { v: 'hobby', label: '취미로 해 보고 싶다' }, { v: 'soon', label: '1년 안에 입시가 있다' }, { v: 'later', label: '1~2년 뒤 입시를 준비하고 싶다' } ],
        adult: [ { v: 'explore', label: '진로를 알아보는 중' }, { v: 'hobby', label: '취미로 해 보고 싶다' }, { v: 'soon', label: '1년 안에 취업·데뷔하고 싶다' }, { v: 'later', label: '1~2년 계획으로 준비하고 싶다' } ]
      } },
    { key: 'time', prompt: '일주일에 여기에 쓸 수 있는 시간은?',
      options: [ { v: 0, label: '3시간 미만' }, { v: 1, label: '3~10시간' }, { v: 2, label: '10시간 이상' } ] }
  ];

  const LEVELS = {
    explore: { name: '탐색 단계', desc: '직접 해 보며 분야를 좁혀 가는 단계예요. 결과를 확정하기보다 짧은 체험으로 비교하는 게 먼저입니다.' },
    basic:   { name: '기초 단계', desc: '해 본 경험이 있어서 방향을 잡기 좋은 단계예요. 작은 작품 하나를 끝까지 완성하는 게 다음 목표입니다.' },
    pro:     { name: '실전 단계', desc: '완성 경험과 시간이 갖춰진 단계예요. 이제는 목표에 맞는 포트폴리오 구성이 핵심입니다.' }
  };

  const PAIR_TEXT = {
    'art|toon':   '둘 다 그림이지만, 원화는 ‘한 장의 디자인’을 완성하고 웹툰은 ‘여러 컷으로 이야기’를 전달해요. 어느 쪽 완성감이 더 좋은지가 갈림길입니다.',
    'novel|toon': '둘 다 이야기를 연재하는 일이에요. 장면을 그림으로 보여 주고 싶은지, 문장으로 상상하게 하고 싶은지가 핵심 차이입니다.',
    'novel|plan': '둘 다 세계를 만들지만, 웹소설은 ‘사연과 감정’을, 기획은 ‘규칙과 시스템’을 만들어요. 이야기와 구조 중 어디에 손이 먼저 가는지 확인해 보세요.',
    'dev|plan':   '같은 게임 기능을 기획은 ‘설계’하고 프로그래밍은 ‘구현’해요. 아이디어를 문서로 풀지, 직접 돌아가게 만들지가 갈림길입니다.',
    'dev|model':  '둘 다 게임 안에서 ‘움직이는 것’을 만들어요. 논리로 움직임을 짜는지(코드), 형태와 뼈대로 만드는지(3D)가 달라요.',
    'art|model':  '같은 캐릭터를 원화는 ‘평면 디자인’으로, 3D는 ‘입체 결과물’로 만들어요. 그리는 손맛과 깎는 손맛 중 어느 쪽인지 비교해 보세요.',
    'art|plan':   '원화는 ‘어떻게 생겼는지’, 기획은 ‘어떻게 작동하는지’를 정해요. 시각 감각과 구조 감각이 함께 나온 조합입니다.',
    'dev|toon':   '작업 방식이 거의 정반대인 조합이에요. 마감 안에 컷을 쌓아 가는 일과 문제를 하나씩 풀어 가는 일 중 어느 쪽이 덜 지치는지가 중요합니다.',
    'model|novel':'글과 3D는 도구는 다르지만 ‘오래 쌓아 올리는 작업’이라는 점이 같아요. 무엇을 쌓을 때 시간 가는 줄 모르는지 확인해 보세요.',
    'art|novel':  '캐릭터와 세계를 상상하는 힘이 공통점이에요. 그 상상을 그림으로 꺼낼지 글로 꺼낼지, 둘 다 짧게 해 보면 금방 갈립니다.',
    'art|dev':    '감각적인 표현과 논리적인 해결이 함께 나왔어요. 게임에서 ‘보이는 것’과 ‘돌아가는 것’ 중 어디에 더 끌리는지 이야기해 보면 좋아요.',
    'plan|toon':  '둘 다 보는 사람(플레이어·독자)의 반응을 설계하는 일이에요. 감정 연출과 재미 구조 중 어느 쪽을 더 파고 싶은지가 관건입니다.',
    'model|toon': '그림 기반이라는 공통점이 있지만, 웹툰은 이야기 연출에, 3D는 입체 조형에 무게가 있어요. 두 작업을 짧게 체험해 보고 비교하길 권해요.',
    'dev|novel':  '글과 코드는 모두 ‘구조가 있는 문장’을 쓰는 일이에요. 독자를 위한 문장인지, 컴퓨터를 위한 문장인지가 다를 뿐입니다.',
    'model|plan': '기획은 설계 쪽, 3D는 제작 쪽이에요. 머릿속 구조를 짜는 것과 손으로 형태를 완성하는 것 중 어느 쪽이 더 오래 즐거운지 확인해 보세요.'
  };

  function pairKey(a, b) { return [a, b].sort().join('|'); }
  function isNeighbor(a, b) { return NEIGHBORS.some(([x, y]) => (x === a && y === b) || (x === b && y === a)); }

  /* answers = { age, track, curious, picks:{1..9: domain}, q10: domain|'unsure', exp, goal, time, times:{qid: ms} } */
  function compute(ans) {
    const scores = {}; ORDER.forEach(d => scores[d] = 0);
    PAIRS.forEach(p => { const d = ans.picks[p.id]; if (d) scores[d] += 1; });
    if (ans.q10 && ans.q10 !== 'unsure') scores[ans.q10] += 1;

    const headToHead = (a, b) => {
      const p = PAIRS.find(p => (p.a.d === a && p.b.d === b) || (p.a.d === b && p.b.d === a));
      if (!p) return 0;
      return ans.picks[p.id] === a ? -1 : ans.picks[p.id] === b ? 1 : 0;
    };
    const rank = ORDER.slice().sort((a, b) =>
      (scores[b] - scores[a]) ||
      ((ans.q10 === b ? 1 : 0) - (ans.q10 === a ? 1 : 0)) ||
      headToHead(a, b) ||
      (ORDER.indexOf(a) - ORDER.indexOf(b)));

    const top1 = rank[0], top2 = rank[1];
    const s = rank.map(d => scores[d]);

    // 응답 근거: 상위 2개 분야가 선택된 문항
    const evidence = {};
    [top1, top2].forEach(d => {
      evidence[d] = PAIRS.filter(p => ans.picks[p.id] === d)
        .map(p => ({ q: p.id, text: (p.a.d === d ? p.a : p.b).short }));
      if (ans.q10 === d) evidence[d].push({ q: 10, text: '1년 뒤 포트폴리오로 ' + Q10.options.find(o => o.d === d).text });
    });

    const tasteTimes = [];
    for (let i = 1; i <= 10; i++) if (ans.times && ans.times[i] != null) tasteTimes.push(ans.times[i]);
    const avgMs = tasteTimes.length ? tasteTimes.reduce((x, y) => x + y, 0) / tasteTimes.length : null;

    const flags = [];
    if (s[0] - s[2] <= 1) flags.push('flat');
    if (isNeighbor(top1, top2)) flags.push('adjacent');
    if (ans.goal === 'soon' && ans.exp === 0) flags.push('gap');
    const grindQ = PAIRS.filter(p => p.grind && (p.a.d === top1 || p.b.d === top1) && ans.picks[p.id] && ans.picks[p.id] !== top1);
    if (grindQ.length) flags.push('grindAvoid');
    if (ans.q10 === 'unsure') flags.push('unsure');
    if (avgMs != null && avgMs < 1500) flags.push('fast');

    let level = 'basic';
    if (ans.q10 === 'unsure' || ans.exp === 0) level = 'explore';
    else if (ans.exp === 2 && ans.time === 2) level = 'pro';

    return { scores, rank, top1, top2, evidence, flags, level, avgMs, grindQ: grindQ.map(p => p.id) };
  }

  // 이용자 화면용: 이 결과로 아직 모르는 것
  function unknowns(r, ans) {
    const list = [DOMAINS[r.top1].unknown];
    if (ans.exp === 0) list.push('아직 직접 만들어 본 경험이 없어서, 이 관심이 실제 작업에서도 이어지는지는 해 봐야 알 수 있어요.');
    if (r.flags.includes('flat')) list.push('관심이 여러 분야에 고르게 나와서, 지금 한 분야로 좁히기엔 일러요.');
    if (r.flags.includes('gap')) list.push('목표 시기가 가까운 편이라, 지금 준비 속도로 충분한지 함께 점검해 볼 필요가 있어요.');
    if (r.flags.includes('grindAvoid')) list.push(`${DOMAINS[r.top1].name}에 끌리지만, 반복·마감 장면에서는 다른 쪽을 골랐어요. 오래 하는 작업도 맞는지는 아직 몰라요.`);
    return list;
  }

  // 상담자용: 응답 패턴별 첫 질문
  function counselorQuestions(r, ans) {
    const A = DOMAINS[r.top1], B = DOMAINS[r.top2];
    const q = [];
    if (r.flags.includes('fast')) q.push({ tag: '빠른 응답', text: `문항당 평균 ${(r.avgMs / 1000).toFixed(1)}초로 빠르게 응답했습니다. 결과를 근거로 단정하지 말고 직접 물어서 확인하세요.` });
    if (r.flags.includes('unsure')) q.push({ tag: '모르겠음 선택', text: '마지막 문항에서 ‘아직 모르겠다’를 골랐습니다. 경험이 부족해서인지, 관심 자체가 불분명한지부터 구분하세요.' });
    if (r.flags.includes('flat')) q.push({ tag: '관심 분산', text: '관심이 여러 분야에 고르게 나왔습니다. 판정을 미루고, 상위 2개 분야를 짧게 체험한 뒤 비교하자고 제안하세요.' });
    if (r.flags.includes('adjacent')) q.push({ tag: '이웃 분야', text: `“검사에서 ${A.name}와(과) ${B.name}이(가) 함께 나왔는데, 본인은 어느 쪽이 더 와닿았어요?” — ${PAIR_TEXT[pairKey(r.top1, r.top2)]}` });
    if (r.flags.includes('gap')) q.push({ tag: '목표-경험 차이', text: '1년 안 목표인데 제작 경험이 아직 없습니다. 목표 시기가 현실적인지, 주당 학습 시간과 함께 점검하세요.' });
    if (r.flags.includes('grindAvoid')) q.push({ tag: '반복 작업 회피', text: `${A.name}이(가) 1위인데, 반복·마감 장면(${r.grindQ.join('·')}번 문항)에서는 다른 쪽을 골랐습니다. 마감과 반복을 어떻게 느끼는지 확인하세요.` });
    q.push({ tag: '분야 질문', text: `${A.name}: ${A.ask} 물어보기.` });
    q.push({ tag: '공통', text: '“결과 중 나와 가장 비슷하다고 느낀 부분은? 생각과 달랐던 부분은?” — 상담자가 설명하기 전에 본인 생각을 먼저 듣기.' });
    return q;
  }

  window.ENGINE = { ORDER, DOMAINS, PAIRS, Q10, AGE, CURIOUS, STATE_QS, LEVELS, PAIR_TEXT, pairKey, isNeighbor, compute, unknowns, counselorQuestions };
})();
