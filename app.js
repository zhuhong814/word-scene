import {cloudPanel,initCloud,notifyCloudChange} from './cloud-ui.mjs?v=20261110-5';
import {lessons} from './lessons.mjs';
import {dateKey,sessionFor,passage,canComplete,streak,validState} from './core.mjs?v=20261110-5';
import {parkArt} from './art.mjs';
import {spellingHints,wordPicture} from './word-memory.mjs?v=20261110-5';
import {loadProgress,persistProgress,checkSpelling,recordSpelling} from './progress.mjs?v=20261110-5';

const $=s=>document.querySelector(s);
const browserStorage={getItem:key=>localStorage.getItem(key),setItem:(key,value)=>localStorage.setItem(key,value)};
const icons={home:'M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z',book:'M12 5v16M3 4c4-1 7 0 9 2 2-2 5-3 9-2v15c-4-1-7 0-9 2-2-2-5-3-9-2z',sound:'M4 9h4l5-4v14l-5-4H4zM17 8c3 2 3 6 0 8M20 5c5 4 5 10 0 14',save:'M6 3h12v18l-6-4-6 4z',leaf:'M19 3C7 2 2 9 5 16c6 7 15 1 14-13zM5 20l10-12',arrow:'M5 12h14M13 6l6 6-6 6',close:'M6 6l12 12M18 6L6 18',check:'M5 12l4 4L19 6',mic:'M9 4a3 3 0 0 1 6 0v8a3 3 0 0 1-6 0zM5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8',grid:'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',stop:'M6 6h12v12H6z',clock:'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0'};
const icon=name=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${icons[name]||icons.book}"/></svg>`;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const loaded=loadProgress(browserStorage);
let state=loaded.state,storageIssue=loaded.issue,saveFailed=false;
const hadToday=!!state.sessions[dateKey()];
let today=dateKey(),session=sessionFor(state,today,lessons.length),showTranslation=false,activeWord=0;
let spellWord=null,spellIndex=null,spellAssisted=false,spellSubmitted=false;
let utterance=null,speechRun=0,recorder=null,recordStream=null,recordUrl=null,recordTimer=null,recordPending=false,recordGeneration=0;
const dialog=$('#modal');
function save(){
  try{
    if(storageIssue)throw Error('Unreadable previous progress');
    persistProgress(browserStorage,state);saveFailed=false;updateSaveStatus();notifyCloudChange();return true;
  }catch{saveFailed=true;updateSaveStatus();toast('进度尚未保存，请前往足迹导出备份。');return false;}
}
function saveMessage(){return storageIssue?'旧进度未能读取，已暂停覆盖；请先恢复备份。':saveFailed?'本次进度未能保存，请立即导出备份。':state.lastSavedAt?`已保存在此浏览器 · 最近写入 ${new Date(state.lastSavedAt).toLocaleString('zh-CN',{hour12:false})}`:loaded.found?'已读取此浏览器中的旧进度；旧版未记录保存时间。':'学习操作会自动保存在此浏览器。';}
function updateSaveStatus(){document.querySelectorAll('[data-save-status]').forEach(el=>{el.textContent=saveMessage();el.classList.toggle('save-warning',saveFailed||storageIssue);});$('#save-warning').hidden=!(saveFailed||storageIssue);}
function savePanel(){return `<section class="panel save-panel"><div class="eyebrow">YOUR PROGRESS, ON THIS DEVICE</div><h2>足迹保存在哪里？</h2><p data-save-status role="status">${esc(saveMessage())}</p><p>浏览器：自动保存学词、答题、打卡和拼写记录。<br>服务端：登录后自动同步，以下方云端状态为准。</p><p class="hint">点击“记住了”、提交答案或拼写后即时保存；只打开词卡不算学完。完成三步并打卡后，才增加完成场景数。</p><p class="hint">请使用同一个网址和普通浏览模式。关闭服务不会删除记录；清除网站数据前，请确认云端已保存；未同步记录需先导出。</p><button class="secondary" data-action="export">导出进度备份</button></section>${cloudPanel()}`;}
function toast(text){$('#toast').textContent=text;$('#toast').classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').classList.remove('show'),3600);}
function speechStatus(text){document.querySelectorAll('.speech-status').forEach(el=>el.textContent=text);}
function stopSpeech(){speechRun++;window.speechSynthesis?.cancel();utterance=null;speechStatus('播放已停止');}
function speak(text){
  if(recorder?.state==='recording'){toast('请先结束录音，再播放示范。');return;}
  if(!window.speechSynthesis){toast('此浏览器不支持系统朗读，请使用 Safari 或 Chrome。');return;}
  stopSpeech();const run=speechRun;const synth=window.speechSynthesis;
  // Short utterances avoid the long-text cutoff found in some mobile voices.
  const chunks=text.match(/[^.!?]+[.!?]+[””"']?|[^.!?]+$/g)||[text];let index=0;
  function next(){if(run!==speechRun)return;if(index===chunks.length){speechStatus('示范播放完成');return;}
    utterance=new SpeechSynthesisUtterance(chunks[index++]);utterance.lang=state.accent;utterance.rate=state.rate;
    const voices=synth.getVoices();const preferred=voices.find(v=>v.lang.replace('_','-')===state.accent&&/Daniel|Samantha|Google|Natural/i.test(v.name))||voices.find(v=>v.lang.replace('_','-')===state.accent);
    if(preferred)utterance.voice=preferred;
    utterance.onstart=()=>speechStatus(`正在朗读 · ${state.accent==='en-GB'?'英音':'美音'} · ${state.rate}×`);
    utterance.onend=next;utterance.onerror=e=>{if(!['canceled','interrupted'].includes(e.error)){speechStatus('播放失败，请检查设备的英语语音与媒体音量。');toast('系统朗读不可用，请检查英语语音与媒体音量。');}};
    synth.speak(utterance);
  }synth.resume();next();
}
const current=()=>session?lessons[session.lesson]:null;
const words=()=>current()?.words.slice(0,session.count)||[];
function route(){const hash=location.hash.slice(1);return ['today','story','speak','words','course'].includes(hash)?hash:'today';}
function navigate(page){if(location.hash===`#${page}`)render();else location.hash=page;}
function nav(){const items=[['today','home','今日'],['story','book','语境'],['words','save','词本'],['course','grid','足迹']];const html=items.map(([id,glyph,label])=>`<a href="#${id}" class="nav-item ${route()===id||(id==='story'&&route()==='speak')?'active':''}" ${route()===id?'aria-current="page"':''}>${icon(glyph)}<span>${label}</span></a>`).join('');$('.desktop-nav').innerHTML=html;$('.bottom-nav').innerHTML=html;}
function render(){
  stopSpeech();cleanupRecording();nav();
  const views={today:home,story:story,speak:reading,words:vocabulary,course:course};$('#app').innerHTML=views[route()]();
  updateSaveStatus();
}
function wordCard(w,i){return `<article class="word-card"><span class="word-number ${session?.learned.includes(i)?'done-word':''}">${session?.learned.includes(i)?'✓':String(i+1).padStart(2,'0')}</span><button class="word-open" data-action="word" data-index="${i}" aria-label="学习 ${w.word}"><b>${w.word}</b><small><span class="pos">${w.pos}</span>${w.meaning}</small></button><button class="icon-btn" data-action="say-word" data-word="${w.word}" aria-label="朗读 ${w.word}">${icon('sound')}</button></article>`;}
function noSession(){return `<div class="empty"><div class="empty-mark">Well done.</div><h2>这一周的 7 个场景，走完啦。</h2><p>第一期共 35 个词。去词本巩固表达，或在足迹中回看课程。</p><a href="#words" class="primary">复习我的单词 ${icon('arrow')}</a></div>`;}
function home(){
  if(!session)return noSession();const l=current(),completed=session.learned.length;const percent=Math.round((completed+(Object.keys(session.answers).length===2?1:0)+(session.read?1:0))/(session.count+2)*100);
  return `<section><div class="eyebrow">${new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',weekday:'long'})} · A LITTLE EVERY DAY</div><div class="heading-row"><div><h1>每天几个词，<em>走进生活。</em></h1><p class="sub">用一个小故事，让新单词成为你的表达。</p></div><div class="streak">${icon('leaf')} ${streak(state)} 天坚持</div></div></section>
  <section class="hero">${parkArt}<div class="hero-content"><div class="eyebrow">DAY ${String(session.lesson+1).padStart(2,'0')} / 07 <span style="margin:0 8px">—</span> ${l.category}</div><h2>${l.title}</h2><div class="english-title">${l.english}</div><p>${l.scene}<br>${session.count} 个词 · 1 篇短文 · 约 10 分钟</p><button class="primary" data-action="start">${session.complete?'再温习一次':completed?'继续今日学习':'开始今日学习'} ${icon('arrow')}</button></div></section>
  <section><div class="section-heading"><h2>今日词汇 <small>Words in your world</small></h2><div class="count-picker" aria-label="每日词数"><span>每天</span>${[3,4,5].map(n=>`<button data-action="count" data-count="${n}" class="${session.count===n?'selected':''}" aria-pressed="${session.count===n}" aria-label="每天 ${n} 个词">${n}</button>`).join('')}</div></div><div class="word-grid">${words().map(wordCard).join('')}</div><div class="progress-track"><span style="width:${percent}%"></span></div><div class="progress-meta"><span>${completed} / ${session.count} 个词已学习</span><span>${session.complete?'今日已完成 ✓':`今日旅程 ${percent}%`}</span></div></section>
  <section><div class="section-heading"><h2>让单词，真正用起来 <small>Your little journey</small></h2></div><div class="journey"><button class="journey-card" data-action="start"><div class="journey-head">${icon('book')}<span>01</span></div><h3>认识新朋友 ↗</h3><p>听发音 · 找到记忆线索</p></button><a class="journey-card" href="#story"><div class="journey-head">${icon('leaf')}<span>02</span></div><h3>走进一个故事 ↗</h3><p>情景短文 · 阅读小测</p></a><a class="journey-card" href="#speak"><div class="journey-head">${icon('mic')}<span>03</span></div><h3>把英语说出来 ↗</h3><p>逐句跟读 · 自己表达</p></a></div></section><div class="quote"><p>“Small steps, taken every day, lead to new places.”</p><small>不必一口气走很远，每天向前一点就好。</small></div>`;
}
function highlight(text){const active=words().map(w=>w.word);return esc(text).replace(new RegExp(`\\b(${active.join('|')})\\b`,'gi'),match=>`<button class="inline-word" data-action="lookup" data-word="${match.toLowerCase()}" aria-label="查看 ${match} 的释义">${match}</button>`);}
function header(eyebrow,title,sub){return `<div class="page-intro"><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p class="sub">${sub}</p></div>`;}
function story(){
  if(!session)return noSession();const l=current(),paragraphs=passage(l,session.count),length=paragraphs.map(p=>p[0]).join(' ').split(/\s+/).length;
  return `${header('02 / WORDS IN CONTEXT','走进一个故事','点一下绿色单词，就能想起它的含义。')}<section class="reading-card"><div class="eyebrow">${l.category} · ${length} WORDS</div><h2 class="story-title">${l.english}</h2><p class="sub">${l.title}</p><div class="reading-toolbar"><div class="reading-tools"><button class="secondary" data-action="say-story">${icon('sound')} 听全文</button><button class="icon-btn" data-action="stop" aria-label="停止朗读">${icon('stop')}</button></div><button class="toggle" data-action="translate" aria-pressed="${showTranslation}">${showTranslation?'隐藏':'显示'}中文</button></div><p class="speech-status" role="status">系统英语示范 · 可在设置中调整语速与口音</p><div class="prose">${paragraphs.map(([en,zh])=>`<p>${highlight(en)}</p>${showTranslation?`<p class="translation">${zh}</p>`:''}`).join('')}</div><p class="hint">原创学习短文 · 雅思主题练习，非官方试题</p></section>
  <section class="panel"><div class="eyebrow">A QUICK CHECK</div><h2 style="margin-top:8px">你读懂了吗？</h2><p>两道小题，把意思读进去。</p>${l.questions.map((q,i)=>question(q,i)).join('')}</section><a class="primary full" href="#speak">接下来，读给自己听 ${icon('arrow')}</a>`;
}
function question(q,i){const selected=session.answers[i],answered=selected!==undefined;return `<div class="question"><h3>${String(i+1).padStart(2,'0')} / ${q.q}</h3>${q.options.map((o,j)=>`<button class="option ${answered&&j===q.answer?'correct':''} ${answered&&selected===j&&j!==q.answer?'wrong':''}" data-action="answer" data-question="${i}" data-answer="${j}" ${answered?'disabled':''}><span>${answered&&j===q.answer?'✓':String.fromCharCode(65+j)}</span>${o}</button>`).join('')}${answered?`<p class="feedback">${selected===q.answer?'答对了。':'再看一次原文：'}${q.why}</p>`:''}</div>`;}
function voiceControls(){return `<div class="speech-controls"><label>口音 <select data-setting="accent" aria-label="发音口音"><option value="en-GB" ${state.accent==='en-GB'?'selected':''}>英式</option><option value="en-US" ${state.accent==='en-US'?'selected':''}>美式</option></select></label><label>语速 <select data-setting="rate" aria-label="朗读语速">${[0.7,0.85,1].map(n=>`<option value="${n}" ${state.rate===n?'selected':''}>${n}×</option>`).join('')}</select></label><button class="secondary" data-action="stop">停止播放</button></div>`;}
function reading(){
  if(!session)return noSession();const l=current();const sentences=passage(l,session.count).flatMap(p=>p[0].match(/[^.!?]+[.!?]+[””"']?/g)||[p[0]]);
  return `${header('03 / MAKE IT YOURS','把英语说出来','先听，再跟读。最后，用自己的话说一次。')}<section class="panel"><h2>跟着声音，找到节奏</h2>${voiceControls()}<p class="speech-status" role="status">点击每句话右侧的按钮，听一句、跟读一句。</p>${sentences.map((s,i)=>`<div class="practice-sentence"><p>${highlight(s.trim())}</p><button class="icon-btn" data-action="say-sentence" data-index="${i}" aria-label="朗读第 ${i+1} 句">${icon('sound')}</button></div>`).join('')}</section>
  <section class="panel"><div class="eyebrow">YOUR TURN</div><h2 style="margin-top:9px">换成你的故事</h2><p style="font-family:var(--serif);font-size:18px;color:var(--ink)">${l.prompt}</p><div class="memory-box"><h3>试着这样开始</h3><p style="font-family:var(--serif);color:var(--ink);font-size:16px">${l.starter}</p></div><p>用今天至少 2 个词说 30–60 秒。不必背诵，表达自己的想法就好。</p><div class="speech-controls"><button class="secondary" data-action="record">${icon('mic')} 录下我的朗读</button><button class="secondary" data-action="end-record" hidden>结束录音</button></div><p id="record-status" class="hint">${isSecureContext?'录音仅用于本次回听；离开页面即清除，不上传、不评分。':'当前为局域网 HTTP，可直接开口跟读。录音需通过 HTTPS 地址访问。'}</p><audio id="record-playback" controls hidden style="width:100%;margin:12px 0"></audio><button class="secondary full" data-action="read-done">${session.read?icon('check'):icon('mic')} ${session.read?'已完成一次开口练习':'我已跟读，并试着自己表达'}</button></section>
  <section class="panel"><h2>收好今天的一点进步</h2><div class="checklist">${session.learned.length===session.count?'✓':'○'} 单词学习 ${session.learned.length} / ${session.count}<br>${Object.keys(session.answers).length===2?'✓':'○'} 阅读理解 ${Object.keys(session.answers).length} / 2<br>${session.read?'✓':'○'} 完成开口练习</div><button class="primary full" data-action="finish" ${!canComplete(session)||session.complete?'disabled':''}>${session.complete?'今日已完成 ✓':'完成今日学习'} ${icon('arrow')}</button>${session.complete?`<div class="completion"><h3>今天的你，又向前了一小步。</h3><p>${session.lesson===6?'7 个场景已学完，接下来去词本巩固吧。':'明天继续下一个生活场景。今天也可以回到词本复习。'}</p></div>`:'<p class="hint">完成上面三步即可打卡；理解题答错也能通过解析继续学习。</p>'}</section>`;
}
function vocabulary(){
  const learnedSet=new Set();for(const s of Object.values(state.sessions))s.learned.forEach(i=>learnedSet.add(lessons[s.lesson].words[i].word));
  const list=lessons.flatMap(l=>l.words).filter(w=>learnedSet.has(w.word)||state.saved.includes(w.word)||state.spelling?.[w.word]);
  return `${header('YOUR WORD GARDEN','一点点，变成你的词','这里收着你学过的词，以及想再看一遍的表达。')}<div class="section-heading"><h2>${list.length} 个词 <small>Keep them close</small></h2><span class="hint">点击翻卡，主动回忆</span></div>${list.length?list.map(w=>`<section class="panel review-card"><div class="modal-top"><h2 class="word-title">${w.word}</h2><button class="icon-btn" data-action="say-word" data-word="${w.word}" aria-label="朗读 ${w.word}">${icon('sound')}</button></div><div class="hint">${w.ipa} · ${state.saved.includes(w.word)?'已收藏':'已学习'}</div><button class="secondary" data-action="spell" data-word="${w.word}">听音／看义练拼写</button><p class="hint">${spellingSummary(w.word)}</p><button class="text-btn" data-action="reveal">想好意思了，翻开看看 →</button><div class="review-answer"><p class="meaning">${w.pos} ${w.meaning}</p><p style="font-family:var(--serif);font-size:16px">${w.example}</p><p class="hint">${w.translation}</p><button class="text-btn" data-action="lookup" data-word="${w.word}">查看图解与记忆方法 →</button></div></section>`).join(''):`<div class="empty"><div class="empty-mark">Aa</div><h2>你的词汇花园，等你种下第一颗种子。</h2><p>学完一个词，或点击词卡上的收藏，它就会出现在这里。</p><a class="primary" href="#today">去认识今天的词 ${icon('arrow')}</a></div>`}`;
}
function course(){
  const done=new Set(Object.values(state.sessions).filter(s=>s.complete).map(s=>s.lesson));const allWords=new Set();Object.values(state.sessions).forEach(s=>s.learned.forEach(i=>allWords.add(lessons[s.lesson].words[i].word)));
  return `${header('A WEEK OF LITTLE DISCOVERIES','每一步，都算数','第一期 · 7 个真实生活场景，35 个主题词。')}<section class="status-summary"><div><b>${done.size}<small> / 7</small></b><small>完成场景</small></div><div><b>${allWords.size}</b><small>学过的词</small></div><div><b>${streak(state)}</b><small>连续学习天数</small></div></section>${savePanel()}${spellingProgress()}<div class="course-list">${lessons.map((l,i)=>`<button class="course-row" data-action="preview" data-index="${i}"><span class="course-day">${String(i+1).padStart(2,'0')}</span><div><h3>${l.title}</h3><p>${l.english}</p></div><span class="badge">${done.has(i)?'已完成 ✓':session?.lesson===i?'今日学习':'预览 →'}</span></button>`).join('')}</div><p class="settings-copy">课程按完成顺序推进，每天一个场景。未完成可次日接着学；完成全部场景后可继续在词本复习。这里记录的是学习进度，不代表雅思分数或词汇掌握度。</p><button class="text-btn" data-action="settings">学习设置与进度备份 →</button>`;
}
function showModal(html){$('#modal-content').innerHTML=html;dialog.classList.toggle('word-dialog',!!$('#modal-content .compact-word'));if(!dialog.open)dialog.showModal();dialog.scrollTop=0;}
const modalTop=label=>`<div class="modal-top"><div class="eyebrow">${label}</div><button class="icon-btn" data-action="close" aria-label="关闭">${icon('close')}</button></div>`;
function openWord(word,index=null){
  activeWord=index??-1;const l=lessons.find(l=>l.words.some(w=>w.word===word)),w=l.words.find(w=>w.word===word),learned=index!==null&&session.learned.includes(index);
  showModal(`<div class="modal-inner compact-word">${modalTop(index!==null?`TODAY'S WORD · ${index+1} / ${session.count}`:l.category)}
    <div class="compact-heading"><div><h2 class="word-title">${w.word}</h2><div class="phonetic"><span>${w.ipa}</span><span>${state.accent==='en-GB'?'英音':'美音'}</span></div></div><button class="icon-btn" data-action="say-word" data-word="${w.word}" aria-label="朗读 ${w.word}">${icon('sound')}</button></div>
    <div class="compact-meaning"><div><div class="word-meaning"><small>${w.pos}</small> ${w.meaning}</div><p class="word-definition">${w.definition}</p></div>${wordPicture(w.word)}</div>
    <section class="compact-memory"><h3>词义记忆</h3><p>${w.memory}</p></section>
    <section class="compact-spelling"><div class="compact-label"><h3>拼写记忆</h3><small>字母分块 · 非音节划分</small></div><div class="letter-chunks">${spellingHints[w.word][0].map(part=>`<span>${part}</span>`).join('')}</div><p>${spellingHints[w.word][1]}</p></section>
    <div class="compact-example"><div><p>${w.example}</p><small>${w.translation}</small></div><button class="icon-btn" data-action="say-example" data-word="${w.word}" aria-label="朗读例句">${icon('sound')}</button></div>
    <p class="speech-status" role="status"></p>
    <div class="compact-actions"><button class="icon-btn" data-action="save-word" data-word="${w.word}" aria-label="${state.saved.includes(w.word)?'取消收藏':'收藏单词'}" aria-pressed="${state.saved.includes(w.word)}">${icon('save')}</button><button class="secondary" data-action="spell" data-word="${w.word}" data-index="${index??''}">练拼写</button>${index!==null?`<button class="primary" data-action="learn" data-index="${index}">${learned?'继续':'记住了，继续'} ${icon('arrow')}</button>`:`<button class="primary" data-action="close">回到练习 ${icon('arrow')}</button>`}</div>
  </div>`);
}
function settings(){showModal(`<div class="modal-inner">${modalTop('MAKE IT YOUR DAILY RITUAL')}<h2 style="margin-top:22px;font-weight:500">找到自己的节奏</h2><div class="settings-row"><label>每天学几个词？<select data-setting="count">${[3,4,5].map(n=>`<option value="${n}" ${state.count===n?'selected':''}>${n} 个词</option>`).join('')}</select></label><p>开始学习后，当天词数固定。修改将应用于下一节新课。</p></div>${voiceControls()}<div class="settings-copy"><strong>为什么先从雅思主题开始？</strong><br>日常生活、教育、城市和环境话题容易与你的经历连接，适合练习“把词用出来”。这些词也能为托福打基础；本版不模拟整套考试，目标院校的考试要求应优先考虑。</div><div class="settings-copy"><strong>在手机上使用</strong><br>同一 Wi-Fi 下可用电脑的局域网地址。HTTPS 部署后，iPhone 可在 Safari 的分享菜单中添加到主屏幕；Android 可使用浏览器的安装或添加到主屏幕功能。<br><br>进度自动保存在当前浏览器。到“足迹”登录邮箱后可同步云端；清除网站数据后需重新登录。更换网址前请先导出本机记录，在新网址恢复备份并确认云端已保存。</div><div class="modal-actions"><button class="secondary" data-action="export">导出进度</button><button class="secondary" data-action="import">恢复备份</button></div><input id="import-file" type="file" accept="application/json,.json" hidden><p id="offline-status" class="hint">${isSecureContext?'首次打开后会缓存课程，离线时系统声音取决于设备。':'局域网 HTTP 不支持离线安装；请保持电脑服务开启。'}</p></div>`);}
function spellingSummary(word){const r=state.spelling?.[word];return r?`提交 ${r.attempts} 次 · 独立拼对 ${r.correct} 次 · 提示后拼对 ${r.assisted} 次`:'还没有拼写练习记录';}
function spellingProgress(){
  const entries=Object.entries(state.spelling||{}).filter(([word])=>spellingHints[word]);
  return `<section class="panel"><div class="eyebrow">SPELL IT, SAY IT, REMEMBER IT</div><h2>拼写足迹</h2><p>练过 ${entries.length} 个词 · ${entries.filter(([,r])=>r.correct>0).length} 个词有独立拼对记录</p><p class="hint">“独立”指本轮未看提示、未答错后得到答案；不等同于长期掌握。</p>${entries.length?entries.map(([word])=>`<button class="spelling-record" data-action="spell" data-word="${word}"><b>${word}</b><small>${spellingSummary(word)}</small><span>再练一次 →</span></button>`).join(''):'<p>打开词卡，点击“练拼写”开始。</p>'}</section>`;
}
function openSpelling(word,index=null){
  stopSpeech();spellWord=word;spellIndex=index;spellAssisted=false;spellSubmitted=false;
  const w=lessons.flatMap(l=>l.words).find(w=>w.word===word);
  showModal(`<div class="modal-inner spelling-practice">${modalTop('RECALL · SPELL · SAY')}<h2>把这个词写出来</h2><p class="spell-meaning">${w.meaning}</p><p class="hint">答案已遮住。先听一遍，再试着输入完整单词。</p>${wordPicture(word)}<button class="secondary" data-action="spell-audio">${icon('sound')} 听单词发音</button><p class="speech-status" role="status"></p><form id="spelling-form" autocomplete="off"><label for="spelling-answer">英文拼写</label><input id="spelling-answer" type="text" lang="en" inputmode="text" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" maxlength="40" enterkeyhint="done" aria-describedby="spelling-feedback" placeholder="在这里输入单词"><button class="primary full" type="submit">检查拼写 ${icon('check')}</button></form><div id="spelling-feedback" role="status" aria-live="polite"></div><button class="text-btn" data-action="spell-hint">给我一点拼写提示</button><div id="spelling-hint" hidden><div class="letter-chunks">${spellingHints[word][0].map(part=>`<span>${part}</span>`).join('')}</div><p>${spellingHints[word][1]}</p></div><div class="modal-actions"><button class="secondary" data-action="spell-again" hidden>遮住，再练一次</button><button class="secondary" data-action="spell-back">回到词卡</button></div><p class="hint">拼写练习自动保存；不会改变已有的课程完成状态。</p><p class="hint" data-save-status>${esc(saveMessage())}</p></div>`);
}
document.addEventListener('submit',event=>{
  if(event.target.id!=='spelling-form')return;event.preventDefault();
  if(spellSubmitted)return;
  const input=$('#spelling-answer'),result=checkSpelling(input.value,spellWord),feedback=$('#spelling-feedback');
  if(result.kind==='empty'||result.kind==='invalid'){feedback.textContent=result.kind==='empty'?'先写下你记得的拼写，再检查。':'请只输入一个英文单词，不要加入空格或标点。';input.focus();return;}
  const correct=result.kind==='correct';recordSpelling(state,spellWord,correct,spellAssisted);const saved=save();
  input.setAttribute('aria-invalid',String(!correct));feedback.className=correct?'spell-feedback correct':'spell-feedback wrong';
  if(correct){
    feedback.innerHTML=`<strong>${spellAssisted?'提示后拼对了。':'独立拼对了！'}</strong><p>${esc(spellWord)} · 再点“听单词发音”，跟着读一次。</p><small>${saved?'本次练习已保存到此浏览器。':'本次记录未保存，请导出进度备份。'}</small>`;
    spellSubmitted=true;input.readOnly=true;event.target.querySelector('button[type="submit"]').disabled=true;
  }else{
    const expected=spellWord[result.index];
    feedback.innerHTML=`<strong>还差一点，调整后再试。</strong><p>${expected?`从第 ${result.index+1} 个字母开始不同，这里应为「${expected}」。`:`末尾多了字母；正确拼写共 ${spellWord.length} 个字母。`}</p><div class="spell-comparison"><span>你写的：${esc(result.normalized)}</span><span>正确的：${spellWord.slice(0,result.index)}<mark>${spellWord.slice(result.index)}</mark></span></div><small>已显示答案，本轮之后拼对会记为“提示后拼对”。</small>`;
    spellAssisted=true;
  }
  $('[data-action="spell-again"]').hidden=false;
});
function changeCount(count){
  state.count=count;
  if(session&&!session.complete&&!session.learned.length&&!Object.keys(session.answers).length&&!session.read){session.count=count;save();render();toast(`今天学习 ${count} 个词，短文已同步调整。`);}
  else{save();toast(`已设为 ${count} 个词，将从下一节新课生效。`);}
}
function cleanupRecording(){recordGeneration++;recordPending=false;clearTimeout(recordTimer);if(recorder?.state==='recording')recorder.stop();recordStream?.getTracks().forEach(t=>t.stop());recordStream=null;recorder=null;if(recordUrl)URL.revokeObjectURL(recordUrl);recordUrl=null;}
async function startRecording(){
  if(recordPending||recorder?.state==='recording')return;
  if(!isSecureContext||!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){toast('录音需要 HTTPS 与兼容浏览器；你仍可以直接开口跟读。');return;}
  stopSpeech();cleanupRecording();const generation=recordGeneration;recordPending=true;
  try{
    const stream=await navigator.mediaDevices.getUserMedia({audio:true});
    if(generation!==recordGeneration){stream.getTracks().forEach(t=>t.stop());return;}
    recordStream=stream;const chunks=[];recorder=new MediaRecorder(stream);
    recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
    const mime=recorder.mimeType;
    recorder.onstop=()=>{stream.getTracks().forEach(t=>t.stop());if(generation!==recordGeneration)return;recordUrl=URL.createObjectURL(new Blob(chunks,{type:mime}));const player=$('#record-playback');if(player){player.src=recordUrl;player.hidden=false;$('#record-status').textContent='录音完成，听听自己的表达。离开页面后录音会清除。';$('[data-action="record"]').hidden=false;$('[data-action="end-record"]').hidden=true;}};
    recorder.start();$('[data-action="record"]').hidden=true;$('[data-action="end-record"]').hidden=false;$('#record-playback').hidden=true;$('#record-status').textContent='正在录音… 点击结束后回听，最多 2 分钟。';recordTimer=setTimeout(endRecording,120000);
  }catch{recordStream?.getTracks().forEach(t=>t.stop());toast('未能打开麦克风，请在浏览器设置中允许录音，或直接开口练习。');}finally{recordPending=false;}
}
function endRecording(){clearTimeout(recordTimer);if(recorder?.state==='recording')recorder.stop();}
document.addEventListener('click',event=>{
  const button=event.target.closest('[data-action]');if(!button)return;const {action}=button.dataset,word=button.dataset.word;
  const w=word?lessons.flatMap(l=>l.words).find(w=>w.word===word):null;
  switch(action){
    case 'cloud':dialog.close();navigate('course');break;
    case 'settings':settings();break;
    case 'spell':openSpelling(word,button.dataset.index!==undefined&&button.dataset.index!==''?Number(button.dataset.index):null);break;
    case 'spell-audio':speak(spellWord);break;
    case 'spell-hint':spellAssisted=true;$('#spelling-hint').hidden=false;button.hidden=true;break;
    case 'spell-again':openSpelling(spellWord,spellIndex);break;
    case 'spell-back':openWord(spellWord,spellIndex);break;
    case 'close':dialog.close();stopSpeech();break;
    case 'count':changeCount(Number(button.dataset.count));break;
    case 'start':{const i=words().findIndex((_,i)=>!session.learned.includes(i));if(i<0)navigate('story');else openWord(words()[i].word,i);break;}
    case 'word':openWord(words()[Number(button.dataset.index)].word,Number(button.dataset.index));break;
    case 'lookup':if(w)openWord(word);break;
    case 'say-word':if(w)speak(w.word);break;
    case 'say-example':if(w)speak(w.example);break;
    case 'say-story':speak(passage(current(),session.count).map(p=>p[0]).join(' '));break;
    case 'say-sentence':{const lines=passage(current(),session.count).flatMap(p=>p[0].match(/[^.!?]+[.!?]+[””"']?/g)||[p[0]]);speak(lines[Number(button.dataset.index)]);break;}
    case 'stop':stopSpeech();break;
    case 'save-word':{state.saved=state.saved.includes(word)?state.saved.filter(x=>x!==word):[...state.saved,word];save();const index=activeWord>=0?activeWord:null;openWord(word,index);toast(state.saved.includes(word)?'已收藏到词本':'已取消收藏；学过的词仍会保留');break;}
    case 'learn':{const i=Number(button.dataset.index);if(!session.learned.includes(i))session.learned.push(i);save();const next=words().findIndex((_,j)=>!session.learned.includes(j));stopSpeech();if(next>=0){openWord(words()[next].word,next);}else{dialog.close();navigate('story');toast('今天的词都见过了，一起到故事里找找它们。');}break;}
    case 'translate':showTranslation=!showTranslation;render();break;
    case 'answer':{const q=Number(button.dataset.question);if(session.answers[q]===undefined){session.answers[q]=Number(button.dataset.answer);save();const scroll=scrollY;render();scrollTo(0,scroll);}break;}
    case 'read-done':{session.read=true;save();button.innerHTML=`${icon('check')} 已完成一次开口练习`;const finish=$('[data-action="finish"]');if(finish&&!session.complete)finish.disabled=!canComplete(session);const list=$('.checklist');if(list)list.innerHTML=`${session.learned.length===session.count?'✓':'○'} 单词学习 ${session.learned.length} / ${session.count}<br>${Object.keys(session.answers).length===2?'✓':'○'} 阅读理解 ${Object.keys(session.answers).length} / 2<br>✓ 完成开口练习`;toast('已记下这次开口练习');break;}
    case 'finish':if(canComplete(session)){session.complete=true;save();render();toast('今日打卡完成，明天再见！');}break;
    case 'reveal':button.closest('.review-card').classList.add('revealed');button.hidden=true;break;
    case 'record':startRecording();break;
    case 'end-record':endRecording();break;
    case 'preview':{const i=Number(button.dataset.index),l=lessons[i];showModal(`<div class="modal-inner">${modalTop(`DAY ${String(i+1).padStart(2,'0')} · ${l.category}`)}<h2 style="margin-top:22px">${l.title}</h2><p class="sub">${l.english}</p><p class="settings-copy">${l.scene}</p><div class="chip-list">${l.words.map(w=>`<button class="chip" data-action="lookup" data-word="${w.word}">${w.word}</button>`).join('')}</div><div class="prose" style="font-size:16px"><p>${l.paragraphs[0][0]}</p></div><p class="hint">课程预览不会改变今天的学习进度。</p>${session?.lesson===i?'<button class="primary full" data-action="open-today">进入今日课程 →</button>':''}</div>`);break;}
    case 'open-today':dialog.close();navigate('today');break;
    case 'export':{const url=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=`wordscene-${today}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);break;}
    case 'import':$('#import-file').click();break;
  }
});
document.addEventListener('change',async event=>{
  const el=event.target;if(el.dataset.setting){const key=el.dataset.setting;if(key==='count'){changeCount(Number(el.value));return;}state[key]=key==='rate'?Number(el.value):el.value;save();stopSpeech();toast('朗读设置已保存');}
  if(el.id==='import-file'&&el.files[0]){try{if(el.files[0].size>1000000)throw Error();const data=JSON.parse(await el.files[0].text());if(!validState(data)||!data.saved.every(w=>lessons.some(l=>l.words.some(x=>x.word===w))))throw Error();if(!confirm('恢复备份将替换当前浏览器的学习进度，确定继续？'))return;state=data;storageIssue=false;today=dateKey();session=sessionFor(state,today,lessons.length);save();dialog.close();render();toast('进度已恢复');}catch{toast('备份格式不正确，未修改当前进度。');}el.value='';}
});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{stopSpeech();if(['words','today','course'].includes(route()))render();});
window.addEventListener('hashchange',()=>{if(dialog.open)dialog.close();render();window.scrollTo(0,0);$('#app').focus({preventScroll:true});});
function refreshDay(){if(dateKey()!==today){today=dateKey();session=sessionFor(state,today,lessons.length);if(dialog.open)dialog.close();save();render();}}
document.addEventListener('visibilitychange',()=>{if(document.hidden){stopSpeech();endRecording();}else refreshDay();});
setInterval(refreshDay,30000);
window.addEventListener('pagehide',()=>{stopSpeech();cleanupRecording();});
render();if(!storageIssue&&(!loaded.found||(!hadToday&&session)))save();else if(storageIssue)toast('无法读取旧进度，已暂停覆盖。请恢复已有备份。');
if('serviceWorker' in navigator&&isSecureContext)navigator.serviceWorker.register('./sw.js').catch(()=>toast('离线缓存未启用，联网时仍可使用。'));

document.querySelector('.page-footer').textContent='词间 · 20261110-5 · 云端足迹版';

initCloud({storage:browserStorage,getState:()=>{if(storageIssue)throw Error('Unreadable local progress');return state;},applyState:next=>{persistProgress(browserStorage,next);state=next;storageIssue=false;saveFailed=false;today=dateKey();session=sessionFor(state,today,lessons.length);if(dialog.open)dialog.close();render();},download:(data,name)=>{const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=`${name}-${dateKey()}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}});
