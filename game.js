(() => {
  // ============================================================
  // CLUB DATA
  // ============================================================
  const LEAGUES = {
    'Premier League': [
      { name:'Arsenal', color:'#EF0107' },
      { name:'Chelsea', color:'#034694' },
      { name:'Manchester United', color:'#DA291C' },
      { name:'Manchester City', color:'#6CABDD' },
      { name:'Liverpool', color:'#C8102E' },
      { name:'Tottenham Hotspur', color:'#132257' },
      { name:'Newcastle United', color:'#3C3C3B' },
      { name:'Aston Villa', color:'#95144C' },
    ],
    'La Liga': [
      { name:'Real Madrid', color:'#8A8D8F' },
      { name:'Barcelona', color:'#A50044' },
      { name:'Atletico Madrid', color:'#CB3524' },
      { name:'Sevilla', color:'#D80027' },
      { name:'Valencia', color:'#EE8707' },
      { name:'Real Sociedad', color:'#0067B1' },
      { name:'Villarreal', color:'#FFE667' },
      { name:'Athletic Bilbao', color:'#EE2523' },
    ],
    'Bundesliga': [
      { name:'Bayern Munich', color:'#DC052D' },
      { name:'Borussia Dortmund', color:'#FDE100' },
      { name:'RB Leipzig', color:'#DD0741' },
      { name:'Bayer Leverkusen', color:'#E32221' },
      { name:'Eintracht Frankfurt', color:'#E1000F' },
      { name:'VfL Wolfsburg', color:'#65B32E' },
      { name:'Borussia Monchengladbach', color:'#000000' },
      { name:'Union Berlin', color:'#EB1923' },
    ],
    'Custom': [],
  };
  const LEAGUE_NAMES = Object.keys(LEAGUES);

  function initials(name){
    return name.split(' ').map(w=>w[0]).join('').slice(0,3).toUpperCase();
  }

  // ============================================================
  // MENU STATE
  // ============================================================
  const menuState = {
    homeLeague: 'Premier League',
    homeClub: LEAGUES['Premier League'][0],
    awayMode: 'choose',
    awayLeague: 'Premier League',
    awayClub: LEAGUES['Premier League'][1],
    venue: 'home',
    matchSeconds: 360,
    difficulty: 1,
    controlledIndex: 9,
  };

  const ROLE_ORDER = [
    { role:'GK', num:1 },
    { role:'DF', num:2 }, { role:'DF', num:3 }, { role:'DF', num:4 }, { role:'DF', num:5 },
    { role:'MF', num:6 }, { role:'MF', num:7 }, { role:'MF', num:8 }, { role:'MF', num:10 },
    { role:'FW', num:9 }, { role:'FW', num:11 },
  ];

  // ---------- build league tabs + club grids ----------
  function buildLeagueTabs(container, side){
    container.innerHTML = '';
    LEAGUE_NAMES.forEach(lg => {
      const tab = document.createElement('div');
      tab.className = 'pill' + ((side==='home'?menuState.homeLeague:menuState.awayLeague)===lg ? ' active' : '');
      tab.textContent = lg;
      tab.addEventListener('click', () => {
        if (side==='home') menuState.homeLeague = lg; else menuState.awayLeague = lg;
        buildLeagueTabs(container, side);
        renderClubGrid(side);
      });
      container.appendChild(tab);
    });
  }

  function renderClubGrid(side){
    const league = side==='home' ? menuState.homeLeague : menuState.awayLeague;
    const grid = document.getElementById(side==='home'?'homeClubGrid':'awayClubGrid');
    const customBox = document.getElementById(side==='home'?'homeCustomBox':'awayCustomBox');

    if (league === 'Custom'){
      grid.innerHTML = '';
      customBox.classList.remove('hidden');
      applyCustom(side);
      return;
    }
    customBox.classList.add('hidden');
    grid.innerHTML = '';
    LEAGUES[league].forEach(club => {
      const item = document.createElement('div');
      const currentPick = side==='home' ? menuState.homeClub : menuState.awayClub;
      const isActive = currentPick && currentPick.name === club.name;
      item.className = 'clubItem' + (isActive ? ' active' : '');
      item.innerHTML = `<span class="crestDot" style="background:${club.color}">${initials(club.name)}</span><span>${club.name}</span>`;
      item.addEventListener('click', () => {
        if (side==='home'){ menuState.homeClub = club; }
        else { menuState.awayClub = club; }
        renderClubGrid(side);
        updatePickedRow(side);
      });
      grid.appendChild(item);
    });
    updatePickedRow(side);
  }

  function applyCustom(side){
    const nameInput = document.getElementById(side==='home'?'homeCustomName':'awayCustomName');
    const colorInput = document.getElementById(side==='home'?'homeCustomColor':'awayCustomColor');
    const club = { name: nameInput.value.trim() || (side==='home'?'Home FC':'Away FC'), color: colorInput.value };
    if (side==='home') menuState.homeClub = club; else menuState.awayClub = club;
    updatePickedRow(side);
  }

  function updatePickedRow(side){
    const club = side==='home' ? menuState.homeClub : menuState.awayClub;
    const league = side==='home' ? menuState.homeLeague : menuState.awayLeague;
    const row = document.getElementById(side==='home'?'homePickedRow':'awayPickedRow');
    if (!club) { row.innerHTML=''; return; }
    row.innerHTML = `<span class="crestDot" style="background:${club.color}">${initials(club.name)}</span>
      <div><div class="pickedName">${club.name}</div><div class="pickedLeague">${league}</div></div>`;
  }

  buildLeagueTabs(document.getElementById('homeLeagueTabs'), 'home');
  renderClubGrid('home');
  buildLeagueTabs(document.getElementById('awayLeagueTabs'), 'away');
  renderClubGrid('away');

  ['homeCustomName','homeCustomColor'].forEach(id => document.getElementById(id).addEventListener('input', ()=>applyCustom('home')));
  ['awayCustomName','awayCustomColor'].forEach(id => document.getElementById(id).addEventListener('input', ()=>applyCustom('away')));

  // ---------- opponent mode ----------
  document.querySelectorAll('#opponentModePills .pill').forEach(p => {
    p.addEventListener('click', () => {
      document.querySelectorAll('#opponentModePills .pill').forEach(x=>x.classList.remove('active'));
      p.classList.add('active');
      menuState.awayMode = p.dataset.m;
      document.getElementById('awayChooseWrap').classList.toggle('hidden', menuState.awayMode!=='choose');
      document.getElementById('awayRandomWrap').classList.toggle('hidden', menuState.awayMode!=='random');
    });
  });

  // ---------- venue / length / difficulty ----------
  document.querySelectorAll('#venuePills .pill').forEach(p => {
    p.addEventListener('click', () => {
      document.querySelectorAll('#venuePills .pill').forEach(x=>x.classList.remove('active'));
      p.classList.add('active');
      menuState.venue = p.dataset.v;
    });
  });
  document.querySelectorAll('#lengthPills .pill').forEach(p => {
    p.addEventListener('click', () => {
      document.querySelectorAll('#lengthPills .pill').forEach(x=>x.classList.remove('active'));
      p.classList.add('active');
      menuState.matchSeconds = parseInt(p.dataset.len);
    });
  });
  document.querySelectorAll('#diffPills .pill').forEach(p => {
    p.addEventListener('click', () => {
      document.querySelectorAll('#diffPills .pill').forEach(x=>x.classList.remove('active'));
      p.classList.add('active');
      menuState.difficulty = parseFloat(p.dataset.d);
    });
  });

  // ---------- player roster pick ----------
  const rosterGrid = document.getElementById('rosterGrid');
  ROLE_ORDER.forEach((r, i) => {
    const div = document.createElement('div');
    div.className = 'rosterItem' + (i === menuState.controlledIndex ? ' active' : '');
    div.innerHTML = `<span><span class="num">${r.num}</span>${r.role}</span>`;
    div.addEventListener('click', () => {
      document.querySelectorAll('.rosterItem').forEach(x=>x.classList.remove('active'));
      div.classList.add('active');
      menuState.controlledIndex = i;
    });
    rosterGrid.appendChild(div);
  });

  function pickRandomClub(excludeName){
    const all = [];
    LEAGUE_NAMES.forEach(lg => { if (lg!=='Custom') LEAGUES[lg].forEach(c => all.push(c)); });
    let pool = all.filter(c => c.name !== excludeName);
    if (pool.length === 0) pool = all;
    return pool[Math.floor(Math.random()*pool.length)];
  }

  function colorsTooClose(c1, c2){
    const h = hex => [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];
    const [r1,g1,b1] = h(c1), [r2,g2,b2] = h(c2);
    return Math.abs(r1-r2)+Math.abs(g1-g2)+Math.abs(b1-b2) < 90;
  }

  function beginMatch(){
    if (menuState.homeLeague==='Custom') applyCustom('home');
    if (menuState.awayMode==='choose' && menuState.awayLeague==='Custom') applyCustom('away');

    if (menuState.awayMode === 'random'){
      menuState.awayClub = pickRandomClub(menuState.homeClub.name);
    }
    // avoid kit clash
    if (colorsTooClose(menuState.homeClub.color, menuState.awayClub.color)){
      menuState.awayClub = { ...menuState.awayClub, color: '#ffffff' };
      if (colorsTooClose(menuState.homeClub.color, '#ffffff')) menuState.awayClub.color = '#111111';
    }
    launchKickoff();
  }

  // ---------- step wizard navigation ----------
  const stepEls = Array.from(document.querySelectorAll('.step'));
  const stepDotsContainer = document.getElementById('stepDots');
  const backBtn = document.getElementById('backBtn');
  const nextBtn = document.getElementById('nextBtn');
  let currentStep = 0;

  stepEls.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i===0 ? ' active' : '');
    stepDotsContainer.appendChild(dot);
  });

  function renderStep(){
    stepEls.forEach((el, i) => el.classList.toggle('step-active', i===currentStep));
    Array.from(stepDotsContainer.children).forEach((dot, i) => dot.classList.toggle('active', i===currentStep));
    backBtn.disabled = currentStep === 0;
    const isLast = currentStep === stepEls.length - 1;
    nextBtn.textContent = isLast ? 'Kick Off ▶' : 'Next ▶';
    stepEls[currentStep].scrollTop = 0;
  }

  backBtn.addEventListener('click', () => {
    if (currentStep > 0){ currentStep--; renderStep(); }
  });
  nextBtn.addEventListener('click', () => {
    if (currentStep < stepEls.length - 1){ currentStep++; renderStep(); }
    else { beginMatch(); }
  });

  renderStep();

  // ============================================================
  // KICKOFF INTRO
  // ============================================================
  function launchKickoff(){
    // Best-effort landscape lock on devices/browsers that support it
    // (typically requires fullscreen first; silently ignored where unsupported).
    try {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(() => {});
      }
    } catch (e) { /* no-op: not supported */ }

    document.getElementById('screenMenu').classList.add('hidden');
    const kickoff = document.getElementById('screenKickoff');
    kickoff.style.display = 'flex';

    const crestHome = document.getElementById('crestHome');
    const crestAway = document.getElementById('crestAway');
    crestHome.style.background = menuState.homeClub.color;
    crestAway.style.background = menuState.awayClub.color;
    crestHome.textContent = initials(menuState.homeClub.name);
    crestAway.textContent = initials(menuState.awayClub.name);
    document.getElementById('vsHomeName').textContent = menuState.homeClub.name;
    document.getElementById('vsAwayName').textContent = menuState.awayClub.name;
    document.getElementById('kickoffSub').textContent =
      (menuState.venue==='home' ? menuState.homeClub.name : menuState.awayClub.name) + ' Stadium — Kick-off in a moment...';

    setTimeout(() => {
      kickoff.style.display = 'none';
      document.getElementById('gameWrap').style.display = 'flex';
      startGame();
    }, 2200);
  }

  // ============================================================
  // GAME
  // ============================================================
  function startGame(){
    const canvas = document.getElementById('field');
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const STAND_H = 46;
    const PITCH_TOP = STAND_H, PITCH_BOTTOM = canvas.height - STAND_H;
    const PITCH_H = PITCH_BOTTOM - PITCH_TOP;
    const GOAL_W = 120, GOAL_DEPTH = 16;
    const PLAYER_R = 11, BALL_R = 6;

    const homeScoreEl = document.getElementById('homeScore');
    const awayScoreEl = document.getElementById('awayScore');
    const clockEl = document.getElementById('clock');
    const statusEl = document.getElementById('status');
    const eventBanner = document.getElementById('eventBanner');

    const HOME_COL = menuState.homeClub.color;
    const AWAY_COL = menuState.awayClub.color;
    const HOME_NAME = menuState.homeClub.name;
    const AWAY_NAME = menuState.awayClub.name;
    const DIFF = menuState.difficulty;

    let score = { home: 0, away: 0 };
    let stats = {
      home: { shots:0, onTarget:0, fouls:0, yellow:0, possessionTicks:0 },
      away: { shots:0, onTarget:0, fouls:0, yellow:0, possessionTicks:0 },
      totalTicks: 0,
      goals: [],
    };

    const TOTAL_REAL_SECONDS = menuState.matchSeconds;
    const RATE = 90 / TOTAL_REAL_SECONDS;
    let elapsedReal = 0;
    let gameMinute = 0;
    let half = 1;
    let halftimeShown = false;
    let fulltimeShown = false;
    let paused = false;
    let refereeStoppage = false;

    const FORMATION = [
      { role:'GK', num:1, x:0.03, y:0.5 },
      { role:'DF', num:2, x:0.16, y:0.15 },
      { role:'DF', num:3, x:0.16, y:0.38 },
      { role:'DF', num:4, x:0.16, y:0.62 },
      { role:'DF', num:5, x:0.16, y:0.85 },
      { role:'MF', num:6, x:0.38, y:0.15 },
      { role:'MF', num:7, x:0.38, y:0.38 },
      { role:'MF', num:8, x:0.38, y:0.62 },
      { role:'MF', num:10, x:0.38, y:0.85 },
      { role:'FW', num:9, x:0.50, y:0.35 },
      { role:'FW', num:11, x:0.50, y:0.65 },
    ];

    function makeTeam(side, colorHex, teamName){
      return FORMATION.map((f,i) => {
        const relX = side === 'home' ? f.x : 1 - f.x;
        return {
          id: side+i, side, role:f.role, num:f.num, team:teamName, color:colorHex,
          baseX: relX*W, baseY: PITCH_TOP + f.y*PITCH_H,
          x: relX*W, y: PITCH_TOP + f.y*PITCH_H,
          vx:0, vy:0, faceX:1, faceY:0,
        };
      });
    }

    let homeTeam = makeTeam('home', HOME_COL, HOME_NAME);
    let awayTeam = makeTeam('away', AWAY_COL, AWAY_NAME);
    const allPlayers = () => homeTeam.concat(awayTeam);

    let ball = { x:W/2, y:PITCH_TOP+PITCH_H/2, vx:0, vy:0 };
    let referee = { x:W/2+40, y:PITCH_TOP+PITCH_H/2-40, targetX:W/2, targetY:PITCH_TOP+PITCH_H/2 };

    let controlled = homeTeam[menuState.controlledIndex];

    const crowd = [];
    const crowdColors = ['#d94f4f','#4f8ed9','#e8c94f','#7fd94f','#c74fd9','#eeeeee','#ff9d4f'];
    for (let row=0; row<2; row++){
      for (let x=10; x<W-10; x+=14){
        crowd.push({ x: x+Math.random()*4, yTop: 6+row*16, yBot: canvas.height-6-row*16, phase:Math.random()*Math.PI*2, color: crowdColors[Math.floor(Math.random()*crowdColors.length)] });
      }
    }
    let cheerBoost = 0;

    const keys = {};
    window.addEventListener('keydown', e => {
      keys[e.key.toLowerCase()] = true;
      if (e.key === ' ') { e.preventDefault(); kickAction(); }
    });
    window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

    const dpadState = { up:false,down:false,left:false,right:false };
    document.querySelectorAll('#dpad button').forEach(btn=>{
      const k = btn.dataset.k;
      const set = v => e => { e.preventDefault(); dpadState[k]=v; };
      btn.addEventListener('touchstart', set(true));
      btn.addEventListener('touchend', set(false));
      btn.addEventListener('mousedown', set(true));
      btn.addEventListener('mouseup', set(false));
      btn.addEventListener('mouseleave', set(false));
    });
    document.getElementById('kickBtn').addEventListener('touchstart', e=>{e.preventDefault();kickAction();});
    document.getElementById('kickBtn').addEventListener('click', ()=>kickAction());

    function dist(a,b){ return Math.hypot(a.x-b.x, a.y-b.y); }
    function clamp(v,lo,hi){ return Math.max(lo, Math.min(hi, v)); }

    function flashStatus(t){
      statusEl.textContent = t;
      setTimeout(()=>{ if(!paused) statusEl.textContent = 'Use arrows/WASD + Space'; }, 900);
    }
    function showBanner(text, ms){
      eventBanner.textContent = text;
      eventBanner.style.display = 'block';
      clearTimeout(showBanner._t);
      showBanner._t = setTimeout(()=>{ eventBanner.style.display='none'; }, ms||1600);
    }

    function kickAction(){
      if (paused || refereeStoppage) return;
      const p = controlled;
      if (dist(p, ball) < PLAYER_R+BALL_R+16){
        const targetX = p.side === 'home' ? W-8 : 8;
        const targetY = PITCH_TOP + PITCH_H/2;
        let dx = targetX-ball.x, dy = targetY-ball.y;
        const len = Math.hypot(dx,dy)||1; dx/=len; dy/=len;
        const power = 9.5;
        ball.vx = dx*power; ball.vy = dy*power;
        const side = p.side;
        stats[side].shots++;
        stats[side].onTarget++;
        flashStatus('Kicked!');
      }
    }

    function resetKickoff(swapSides){
      if (swapSides){
        homeTeam.forEach(p => { p.baseX = W - p.baseX; });
        awayTeam.forEach(p => { p.baseX = W - p.baseX; });
      }
      homeTeam.forEach(p => { p.x=p.baseX; p.y=p.baseY; p.vx=0; p.vy=0; });
      awayTeam.forEach(p => { p.x=p.baseX; p.y=p.baseY; p.vx=0; p.vy=0; });
      ball.x = W/2; ball.y = PITCH_TOP+PITCH_H/2; ball.vx=0; ball.vy=0;
      controlled = homeTeam[menuState.controlledIndex];
    }

    function goalScored(side){
      score[side]++;
      (side==='home'?homeScoreEl:awayScoreEl).textContent = score[side];
      stats.goals.push({ min: Math.floor(gameMinute), side, team: side==='home'?HOME_NAME:AWAY_NAME });
      cheerBoost = 60;
      showBanner('⚽ GOAL! ' + (side==='home'?HOME_NAME:AWAY_NAME) + ' scores!', 2000);
      paused = true;
      setTimeout(() => { paused=false; resetKickoff(false); }, 1800);
    }

    let foulCooldown = 0;
    function checkFouls(){
      if (foulCooldown > 0){ foulCooldown--; return; }
      for (const a of homeTeam){
        for (const b of awayTeam){
          const d = dist(a,b);
          if (d < PLAYER_R*1.3 && dist(a,ball) < 40 && dist(b,ball) < 40){
            const chance = 0.0025 * DIFF;
            if (Math.random() < chance){
              const foulingSide = Math.random() < 0.5 ? 'home' : 'away';
              const fouledSide = foulingSide === 'home' ? 'away' : 'home';
              stats[foulingSide].fouls++;
              let cardText = '';
              if (Math.random() < 0.3){
                stats[foulingSide].yellow++;
                cardText = ' 🟨 Yellow card!';
              }
              refereeStoppage = true;
              showBanner('🟨 Referee whistle! Foul — free kick to ' + (fouledSide==='home'?HOME_NAME:AWAY_NAME) + '.' + cardText, 1900);
              referee.targetX = ball.x; referee.targetY = ball.y;
              setTimeout(() => { refereeStoppage = false; ball.vx = 0; ball.vy = 0; }, 1500);
              foulCooldown = 240;
              return;
            }
          }
        }
      }
    }

    function nearestToBall(team){
      let best=team[0], bd=Infinity;
      for (const p of team){ const d = dist(p,ball); if (d<bd){bd=d;best=p;} }
      return best;
    }
    function updateControlSwitch(){ controlled = nearestToBall(homeTeam); }

    function aiMoveTeam(team, isUserTeam){
      const attackDir = team[0].side === 'home' ? 1 : -1;
      for (const p of team){
        if (isUserTeam && p === controlled) continue;
        let targetX, targetY;
        const ballIsNear = dist(p,ball) < 130;
        if (p.role === 'GK'){
          const goalX = team[0].side==='home' ? 24 : W-24;
          targetX = goalX + attackDir*14;
          targetY = clamp(ball.y, PITCH_TOP+PITCH_H/2-GOAL_W/2, PITCH_TOP+PITCH_H/2+GOAL_W/2);
        } else {
          const pullX = (ball.x-p.baseX)*0.28;
          const pullY = (ball.y-p.baseY)*0.28;
          targetX = p.baseX+pullX; targetY = p.baseY+pullY;
          if (ballIsNear){ targetX = ball.x - attackDir*6; targetY = ball.y; }
        }
        const dx = targetX-p.x, dy = targetY-p.y;
        const d = Math.hypot(dx,dy)||1;
        const speed = (ballIsNear?2.6:1.7) * DIFF;
        p.vx = (dx/d)*speed; p.vy = (dy/d)*speed;
        p.x += p.vx; p.y += p.vy;
        if (p.vx !== 0 || p.vy !== 0){ p.faceX=p.vx; p.faceY=p.vy; }
        p.x = clamp(p.x, PLAYER_R, W-PLAYER_R);
        p.y = clamp(p.y, PITCH_TOP+PLAYER_R, PITCH_BOTTOM-PLAYER_R);
      }
    }

    function moveControlledPlayer(){
      const p = controlled;
      let dx=0, dy=0;
      if (keys['arrowup']||keys['w']||dpadState.up) dy -= 1;
      if (keys['arrowdown']||keys['s']||dpadState.down) dy += 1;
      if (keys['arrowleft']||keys['a']||dpadState.left) dx -= 1;
      if (keys['arrowright']||keys['d']||dpadState.right) dx += 1;
      if (dx!==0||dy!==0){
        const len = Math.hypot(dx,dy); dx/=len; dy/=len;
        p.faceX=dx; p.faceY=dy;
        const speed = 3.2;
        p.x += dx*speed; p.y += dy*speed;
        p.x = clamp(p.x, PLAYER_R, W-PLAYER_R);
        p.y = clamp(p.y, PITCH_TOP+PLAYER_R, PITCH_BOTTOM-PLAYER_R);
      }
    }

    function updateBallPhysics(){
      for (const p of awayTeam){
        if (dist(p,ball) < PLAYER_R+BALL_R+6 && Math.hypot(ball.vx,ball.vy) < 3){
          const targetX = 8, targetY = PITCH_TOP+PITCH_H/2;
          let dx = targetX-ball.x, dy = targetY-ball.y;
          const len = Math.hypot(dx,dy)||1; dx/=len; dy/=len;
          ball.vx = dx*5.5*DIFF + (Math.random()-0.5)*2;
          ball.vy = dy*5.5*DIFF + (Math.random()-0.5)*2;
        }
      }
      let nearestAll=null, bestD=Infinity;
      for (const p of allPlayers()){ const d=dist(p,ball); if (d<bestD){bestD=d;nearestAll=p;} }
      if (nearestAll){ stats.totalTicks++; stats[nearestAll.side].possessionTicks++; }
      if (nearestAll && bestD < PLAYER_R+BALL_R+4){
        const speed = Math.hypot(ball.vx,ball.vy);
        if (speed < 4){
          ball.x += (nearestAll.x-ball.x)*0.15;
          ball.y += (nearestAll.y-ball.y)*0.15;
        }
      }
      ball.x += ball.vx; ball.y += ball.vy;
      ball.vx *= 0.985; ball.vy *= 0.985;

      if (ball.y < PITCH_TOP+BALL_R){ ball.y = PITCH_TOP+BALL_R; ball.vy *= -0.6; }
      if (ball.y > PITCH_BOTTOM-BALL_R){ ball.y = PITCH_BOTTOM-BALL_R; ball.vy *= -0.6; }

      const goalTop = PITCH_TOP+PITCH_H/2-GOAL_W/2, goalBottom = PITCH_TOP+PITCH_H/2+GOAL_W/2;
      if (ball.x < BALL_R+2){
        if (ball.y>goalTop && ball.y<goalBottom){ goalScored('away'); return; }
        else { ball.x = BALL_R+2; ball.vx *= -0.6; }
      }
      if (ball.x > W-BALL_R-2){
        if (ball.y>goalTop && ball.y<goalBottom){ goalScored('home'); return; }
        else { ball.x = W-BALL_R-2; ball.vx *= -0.6; }
      }
    }

    function updateReferee(){
      referee.targetX = ball.x + 30;
      referee.targetY = ball.y - 30;
      const dx = referee.targetX-referee.x, dy = referee.targetY-referee.y;
      referee.x += dx*0.03; referee.y += dy*0.03;
      referee.x = clamp(referee.x, 20, W-20);
      referee.y = clamp(referee.y, PITCH_TOP+10, PITCH_BOTTOM-10);
    }

    function drawStands(){
      ctx.fillStyle = '#132a1d';
      ctx.fillRect(0,0,W,STAND_H);
      ctx.fillRect(0,canvas.height-STAND_H,W,STAND_H);
      const bounce = (p) => Math.sin(performance.now()/220 + p.phase) * (1.5 + cheerBoost*0.06);
      for (const c of crowd){
        ctx.beginPath(); ctx.fillStyle = c.color;
        ctx.arc(c.x, c.yTop + bounce(c), 3, 0, Math.PI*2); ctx.fill();
        ctx.beginPath();
        ctx.arc(c.x, c.yBot - bounce(c), 3, 0, Math.PI*2); ctx.fill();
      }
      if (cheerBoost > 0) cheerBoost -= 0.6;
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(0, STAND_H-6, W, 6);
      ctx.fillRect(0, canvas.height-STAND_H, W, 6);
    }

    function drawPitch(){
      ctx.clearRect(0,0,W,canvas.height);
      drawStands();
      const stripeW = 40;
      for (let x=0;x<W;x+=stripeW){
        ctx.fillStyle = (Math.floor(x/stripeW)%2===0) ? '#1e5c3a' : '#236b43';
        ctx.fillRect(x, PITCH_TOP, stripeW, PITCH_H);
      }
      ctx.strokeStyle = 'rgba(232,244,236,0.85)';
      ctx.lineWidth = 2;
      ctx.strokeRect(4, PITCH_TOP+2, W-8, PITCH_H-4);
      ctx.beginPath(); ctx.moveTo(W/2, PITCH_TOP+2); ctx.lineTo(W/2, PITCH_BOTTOM-2); ctx.stroke();
      ctx.beginPath(); ctx.arc(W/2, PITCH_TOP+PITCH_H/2, 50, 0, Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.arc(W/2, PITCH_TOP+PITCH_H/2, 3, 0, Math.PI*2); ctx.fillStyle='rgba(232,244,236,0.85)'; ctx.fill();
      ctx.strokeRect(4, PITCH_TOP+PITCH_H/2-95, 85, 190);
      ctx.strokeRect(W-4-85, PITCH_TOP+PITCH_H/2-95, 85, 190);

      const goalTop = PITCH_TOP+PITCH_H/2-GOAL_W/2;
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.fillRect(0, goalTop, GOAL_DEPTH, GOAL_W);
      ctx.fillRect(W-GOAL_DEPTH, goalTop, GOAL_DEPTH, GOAL_W);
      ctx.strokeRect(0, goalTop, GOAL_DEPTH, GOAL_W);
      ctx.strokeRect(W-GOAL_DEPTH, goalTop, GOAL_DEPTH, GOAL_W);
    }

    function drawPerson(p, bodyColor, shortsColor, isControlled, num, skin){
      const facing = Math.atan2(p.faceY||0, p.faceX||1);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.beginPath();
      ctx.ellipse(0, PLAYER_R*0.8, PLAYER_R*0.8, PLAYER_R*0.3, 0, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(0,0,0,0.28)'; ctx.fill();
      ctx.fillStyle = shortsColor;
      ctx.fillRect(-5, 2, 4, 9);
      ctx.fillRect(1, 2, 4, 9);
      ctx.beginPath();
      ctx.moveTo(-7,-8); ctx.lineTo(7,-8); ctx.lineTo(6,4); ctx.lineTo(-6,4); ctx.closePath();
      ctx.fillStyle = bodyColor; ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth=1; ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 6px sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(num, 0, -2);
      ctx.beginPath();
      ctx.arc(0, -13, 5, 0, Math.PI*2);
      ctx.fillStyle = skin || '#e0ac7a'; ctx.fill();
      ctx.strokeStyle='rgba(0,0,0,0.2)'; ctx.stroke();
      ctx.beginPath();
      ctx.arc(Math.cos(facing)*4, -13+Math.sin(facing)*4, 1.3, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fill();
      ctx.restore();

      if (isControlled){
        ctx.beginPath();
        ctx.arc(p.x, p.y, PLAYER_R+8, 0, Math.PI*2);
        ctx.strokeStyle = '#f2c14e'; ctx.lineWidth=2.5; ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(p.x, p.y-PLAYER_R-16);
        ctx.lineTo(p.x-5, p.y-PLAYER_R-8);
        ctx.lineTo(p.x+5, p.y-PLAYER_R-8);
        ctx.closePath();
        ctx.fillStyle = '#f2c14e'; ctx.fill();
      }
    }

    function drawPlayer(p){
      const shorts = p.role==='GK' ? '#222' : '#ffffff';
      drawPerson(p, p.color, shorts, p===controlled, p.num);
    }
    function drawReferee(){
      drawPerson({x:referee.x, y:referee.y, faceX:1, faceY:0}, '#111111', '#111111', false, '');
    }
    function drawBall(){
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI*2);
      ctx.fillStyle = '#fdfdf5'; ctx.fill();
      ctx.lineWidth=1; ctx.strokeStyle='#333'; ctx.stroke();
    }

    function render(){
      drawPitch();
      for (const p of homeTeam) drawPlayer(p);
      for (const p of awayTeam) drawPlayer(p);
      drawReferee();
      drawBall();
    }

    function updateClock(dtMs){
      if (paused) return;
      elapsedReal += dtMs/1000;
      gameMinute = elapsedReal * RATE;
      const displayMin = Math.min(90, Math.floor(gameMinute));
      clockEl.textContent = (half===1?'1st Half — ':'2nd Half — ') + displayMin + "'";

      if (gameMinute >= 45 && !halftimeShown && half===1){
        halftimeShown = true;
        openModal('halftime');
      }
      if (gameMinute >= 90 && !fulltimeShown){
        fulltimeShown = true;
        openModal('fulltime');
      }
    }

    function possessionPct(side){
      if (stats.totalTicks===0) return 50;
      return Math.round(100*stats[side].possessionTicks/stats.totalTicks);
    }

    function buildStatRows(){
      const h = stats.home, a = stats.away;
      return [
        [possessionPct('home')+'%', 'Possession', possessionPct('away')+'%'],
        [h.shots, 'Shots', a.shots],
        [h.onTarget, 'On Target', a.onTarget],
        [h.fouls, 'Fouls', a.fouls],
        [h.yellow, 'Yellow Cards', a.yellow],
      ];
    }

    function openModal(kind){
      paused = true;
      const overlay = document.getElementById('modalOverlay');
      const title = document.getElementById('modalTitle');
      const scoreEl = document.getElementById('modalScore');
      const table = document.getElementById('statTable');
      const btn = document.getElementById('modalBtn');

      title.textContent = kind==='halftime' ? '⏸ Half Time' : '🏁 Full Time';
      scoreEl.innerHTML = `<span style="color:#9db8ff">${HOME_NAME} ${score.home}</span> — <span style="color:#ffab97">${score.away} ${AWAY_NAME}</span>`;

      table.innerHTML = '';
      buildStatRows().forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td>`;
        table.appendChild(tr);
      });

      btn.textContent = kind==='halftime' ? 'Start Second Half ▶' : 'Play Again';
      overlay.style.display = 'flex';

      btn.onclick = () => {
        overlay.style.display = 'none';
        if (kind==='halftime'){ half = 2; paused = false; resetKickoff(true); }
        else { location.reload(); }
      };
    }

    let lastTick = performance.now();
    function loop(now){
      const dt = now - lastTick;
      lastTick = now;
      if (!paused && !refereeStoppage){
        updateControlSwitch();
        moveControlledPlayer();
        aiMoveTeam(homeTeam, true);
        aiMoveTeam(awayTeam, false);
        updateBallPhysics();
        checkFouls();
      }
      updateReferee();
      updateClock(dt);
      render();
      requestAnimationFrame(loop);
    }

    resetKickoff(false);
    requestAnimationFrame(loop);
  }
})();
