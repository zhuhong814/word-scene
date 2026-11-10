import {cloudConfig} from './cloud-config.js?v=20261110-6';
import {CloudProgress} from './cloud.mjs?v=20261110-6';

const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let store,client,context,loginEmail='';
let status={kind:'loading',message:'正在检查云端连接…',user:null};
const configured=!!cloudConfig.url&&!!cloudConfig.publishableKey;
if(!configured)status={kind:'unconfigured',message:'云端尚未配置，当前仅保存在此浏览器。',user:null};
export function cloudPanel(){
  const user=status.user,busy=['loading','saving','sending'].includes(status.kind);
  return `<section class="panel cloud-panel" id="cloud-panel"><div class="eyebrow">YOUR LEARNING, BACKED UP</div><h2>我的云端足迹</h2><p role="status" class="${['error','conflict'].includes(status.kind)?'save-warning':''}">${esc(status.message)}</p>${user?`<p class="hint">当前账号：${esc(user.email||user.id)}</p><div class="modal-actions"><button class="secondary" data-cloud="retry" ${busy?'disabled':''}>检查同步</button><button class="text-btn" data-cloud="logout" ${busy?'disabled':''}>退出登录</button></div>`:configured?`<form id="cloud-login"><label for="cloud-email">邮箱</label><input id="cloud-email" type="email" autocomplete="email" placeholder="你的邮箱地址" required maxlength="254" value="${esc(loginEmail)}"><button class="secondary" type="submit" ${busy?'disabled':''}>发送验证码</button></form><form id="cloud-verify"><label for="cloud-code">邮箱验证码</label><input id="cloud-code" type="text" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6,8}" minlength="6" maxlength="8" placeholder="输入邮件中的 6–8 位数字" required><button class="primary" type="submit" ${busy?'disabled':''}>在此设备登录并同步</button></form><p class="hint">可以在电脑上查看邮件，把数字验证码输入这台手机。首次使用会创建学习账号；无需点击邮件链接。</p>`:''}${status.kind==='conflict'?`<div class="cloud-conflict"><p>本机：${summary(context.getState())}<br>云端：${store.remote?summary(store.remote.progress):'这个账号还没有存档'}</p><div class="modal-actions"><button class="secondary" data-action="export">备份本机记录</button>${store.remote?'<button class="secondary" data-cloud="backup-remote">备份云端记录</button>':''}</div><div class="modal-actions">${store.remote?'<button class="secondary" data-cloud="use-remote">恢复云端这一份</button>':''}<button class="secondary" data-cloud="use-local">将本机这一份存到云端</button></div></div>`:''}<p class="hint">只有显示“云端已保存”才代表服务端已确认。清除网站数据后，重新登录同一邮箱即可恢复已同步的记录；离线时新增的记录请先同步或导出。</p></section>`;
}
function summary(state){return `${Object.values(state.sessions).filter(s=>s.complete).length} 次打卡 · ${Object.values(state.spelling||{}).reduce((n,s)=>n+s.attempts,0)} 次拼写 · ${Object.values(state.sessions).reduce((n,s)=>n+s.learned.length,0)} 次学词`;}
function update(next){status=next;const panel=document.querySelector('#cloud-panel');if(panel)panel.outerHTML=cloudPanel();const badge=document.querySelector('#cloud-badge');if(badge){badge.textContent=status.kind==='saved'?'云端已保存':status.user?'云端待同步':'登录云端';badge.title=status.message;}}
export function notifyCloudChange(){store?.changed();}
export async function initCloud(options){
  context=options;
  document.addEventListener('submit',async event=>{
    if(!['cloud-login','cloud-verify'].includes(event.target.id))return;event.preventDefault();
    const emailField=document.querySelector('#cloud-email');
    if(!emailField.reportValidity()||!client)return;
    loginEmail=emailField.value.trim();
    const verifying=event.target.id==='cloud-verify';
    const token=verifying?document.querySelector('#cloud-code').value.trim():'';
    update({...status,kind:'sending',message:verifying?'正在验证并登录这台设备…':'正在发送验证码…'});
    try{
      if(verifying){
        const {data,error}=await client.auth.verifyOtp({email:loginEmail,token,type:'email'});
        if(error||!data.user)throw error||Error('Missing user');
        await store.connect(data.user);
      }else{
        const {error}=await client.auth.signInWithOtp({email:loginEmail,options:{emailRedirectTo:location.origin+location.pathname}});
        if(error)throw error;
        update({...status,kind:'signed-out',message:'验证码已发送。查看邮箱（包括垃圾邮件），把最新邮件中的数字输入下方。'});
      }
    }catch(error){
      let message=verifying?'验证码无效或已过期，请使用最新邮件中的数字。':'验证码未能发送，请检查邮箱、网络，或稍后重试。';
      if(['over_email_send_rate_limit','over_request_rate_limit'].includes(error?.code))message='邮件发送次数达到服务限制，请稍后重试。已有的最新验证码仍可尝试登录。';
      if(error?.code==='email_address_not_authorized')message='当前邮件服务仅允许项目成员邮箱，请使用注册 Supabase 时的邮箱。';
      update({...status,kind:'error',message:message+' 本机学习记录保留。'});
    }
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
      setTimeout(()=>{if((session?.user?.id||null)!==(store.user?.id||null))store.connect(session?.user||null);},0);
    });
    window.addEventListener('online',()=>{if(store.user&&!store.busy&&!store.conflict)store.connect(store.user);});
    const retry=()=>{if(!document.hidden&&navigator.onLine&&store.user&&!store.busy&&!store.conflict&&['error','pending'].includes(status.kind))store.connect(store.user);};
    document.addEventListener('visibilitychange',retry);
    setInterval(retry,30000);
  }catch{update({kind:'error',message:'暂时无法连接云端，请刷新后重试。当前学习仍保存在此浏览器。',user:null});}
}
