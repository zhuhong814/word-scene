import {cloudConfig} from './cloud-config.js?v=20261110-4';
import {CloudProgress} from './cloud.mjs?v=20261110-4';

const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let store,client,context;
let status={kind:'loading',message:'正在检查云端连接…',user:null};
const configured=!!cloudConfig.url&&!!cloudConfig.publishableKey;
if(!configured)status={kind:'unconfigured',message:'云端尚未配置，当前仅保存在此浏览器。',user:null};
export function cloudPanel(){
  const user=status.user,busy=['loading','saving','sending'].includes(status.kind);
  return `<section class="panel cloud-panel" id="cloud-panel"><div class="eyebrow">YOUR LEARNING, BACKED UP</div><h2>我的云端足迹</h2><p role="status" class="${['error','conflict'].includes(status.kind)?'save-warning':''}">${esc(status.message)}</p>${user?`<p class="hint">当前账号：${esc(user.email||user.id)}</p><div class="modal-actions"><button class="secondary" data-cloud="retry" ${busy?'disabled':''}>检查同步</button><button class="text-btn" data-cloud="logout" ${busy?'disabled':''}>退出登录</button></div>`:configured?`<form id="cloud-login"><label for="cloud-email">邮箱</label><input id="cloud-email" type="email" autocomplete="email" placeholder="你的邮箱地址" required maxlength="254"><button class="primary" type="submit" ${busy?'disabled':''}>发送登录链接</button></form><p class="hint">登录链接发到你的邮箱；请在当前设备的同一浏览器打开。首次使用会创建学习账号。</p>`:''}${status.kind==='conflict'?`<div class="cloud-conflict"><p>本机：${summary(context.getState())}<br>云端：${store.remote?summary(store.remote.progress):'这个账号还没有存档'}</p><div class="modal-actions"><button class="secondary" data-action="export">备份本机记录</button>${store.remote?'<button class="secondary" data-cloud="backup-remote">备份云端记录</button>':''}</div><div class="modal-actions">${store.remote?'<button class="secondary" data-cloud="use-remote">恢复云端这一份</button>':''}<button class="secondary" data-cloud="use-local">将本机这一份存到云端</button></div></div>`:''}<p class="hint">只有显示“云端已保存”才代表服务端已确认。清除网站数据后，重新登录同一邮箱即可恢复已同步的记录；离线时新增的记录请先同步或导出。</p></section>`;
}
function summary(state){return `${Object.values(state.sessions).filter(s=>s.complete).length} 次打卡 · ${Object.values(state.spelling||{}).reduce((n,s)=>n+s.attempts,0)} 次拼写 · ${Object.values(state.sessions).reduce((n,s)=>n+s.learned.length,0)} 次学词`;}
function update(next){status=next;const panel=document.querySelector('#cloud-panel');if(panel)panel.outerHTML=cloudPanel();const badge=document.querySelector('#cloud-badge');if(badge){badge.textContent=status.kind==='saved'?'云端已保存':status.user?'云端待同步':'登录云端';badge.title=status.message;}}
export function notifyCloudChange(){store?.changed();}
export async function initCloud(options){
  context=options;
  document.addEventListener('submit',async event=>{
    if(event.target.id!=='cloud-login')return;event.preventDefault();
    const email=document.querySelector('#cloud-email').value.trim();
    if(!client)return;
    update({...status,kind:'sending',message:'正在发送登录邮件…'});
    try{
      const {error}=await client.auth.signInWithOtp({email,options:{emailRedirectTo:location.origin+location.pathname}});
      if(error)throw error;
      update({...status,kind:'signed-out',message:'登录链接已发送，请检查邮箱（包括垃圾邮件）。请勿反复发送，链接以最新一封为准。'});
    }catch{update({...status,kind:'error',message:'登录邮件未能发送。请检查邮箱、网络，或稍后重试；本机记录不受影响。'});}
  });
  document.addEventListener('click',async event=>{
    const action=event.target.closest('[data-cloud]')?.dataset.cloud;if(!action||!store)return;
    try{
      if(action==='retry'){await store.connect(store.user);return;}
      if(action==='logout'){
        if(!confirm('退出后本机记录仍会保留，但新进度不再上传。确认退出？'))return;
        const {error}=await client.auth.signOut({scope:'local'});if(error)throw error;await store.connect(null);
      }
      if(action==='backup-remote')options.download(store.remote.progress,'wordscene-cloud-backup');
      if(action==='use-remote'){
        if(!confirm('恢复云端记录会替换本机进度。请先导出本机备份。确认恢复？'))return;
        await store.resolve('remote');
      }
      if(action==='use-local'){
        if(!confirm('将以本机记录替换当前账号的云端存档。请先备份需要保留的记录。确认使用本机这一份？'))return;
        await store.resolve('local');
      }
    }catch{update({...status,kind:'error',message:'操作未完成，本机记录保留。请检查网络后重试。'});}
  });
  if(!configured){update(status);return;}
  try{
    client=window.supabase.createClient(cloudConfig.url,cloudConfig.publishableKey,{
      auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true},
      global:{fetch:async(url,init)=>{
        const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
        try{return await fetch(url,{...init,signal:controller.signal});}finally{clearTimeout(timer);}
      }}
    });
    store=new CloudProgress({client,storage:options.storage,getState:options.getState,applyState:options.applyState,onStatus:update});
    const {data,error}=await client.auth.getSession();if(error)throw error;
    await store.connect(data.session?.user||null);
    client.auth.onAuthStateChange((event,session)=>{
      if((session?.user?.id||null)!==(store.user?.id||null))setTimeout(()=>store.connect(session?.user||null),0);
    });
    window.addEventListener('online',()=>{if(store.user&&!store.busy&&!store.conflict)store.connect(store.user);});
    const retry=()=>{if(!document.hidden&&navigator.onLine&&store.user&&!store.busy&&!store.conflict&&['error','pending'].includes(status.kind))store.connect(store.user);};
    document.addEventListener('visibilitychange',retry);
    setInterval(retry,30000);
  }catch{update({kind:'error',message:'暂时无法连接云端，请刷新后重试。当前学习仍保存在此浏览器。',user:null});}
}
