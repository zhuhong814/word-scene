import {cloudConfig} from './cloud-config.js?v=20261110-7';
import {CloudProgress} from './cloud.mjs?v=20261110-7';

const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let store,client,context,loginEmail='';
let status={kind:'loading',message:'正在检查云端连接…',user:null};
const configured=!!cloudConfig.url&&!!cloudConfig.publishableKey;
if(!configured)status={kind:'unconfigured',message:'云端尚未配置，当前仅保存在此浏览器。',user:null};
export function cloudPanel(){
  const user=status.user,busy=['loading','saving','sending'].includes(status.kind);
  const login=`<form id="cloud-password-login"><label for="cloud-email">邮箱</label><input id="cloud-email" type="email" autocomplete="email" placeholder="你的邮箱地址" required maxlength="254" value="${esc(loginEmail)}"><label for="cloud-password">词间登录密码</label><input id="cloud-password" type="password" autocomplete="current-password" required placeholder="输入你设置的登录密码"><button class="primary" type="submit" ${busy?'disabled':''}>登录并同步这台设备</button></form><details class="cloud-help"><summary>还没设置密码？</summary><p class="hint">如果电脑已登录：在电脑的“云端足迹”设置登录密码，再回到手机登录。也可以发送邮件链接，并在需要登录的设备上打开。</p><button class="secondary" data-cloud="send-link" ${busy?'disabled':''}>发送邮件登录链接</button></details>`;
  const password=`<details class="cloud-help"><summary>设置登录密码（方便手机登录）</summary><form id="cloud-password-set"><label for="cloud-new-password">新登录密码（至少 12 位）</label><input id="cloud-new-password" type="password" autocomplete="new-password" minlength="12" required><label for="cloud-confirm-password">再输入一次密码</label><input id="cloud-confirm-password" type="password" autocomplete="new-password" minlength="12" required><button class="secondary" type="submit">设置登录密码</button><p id="password-feedback" role="status" class="hint">只用于词间学习账号，不会修改 GitHub 或 Supabase 控制台的登录方式。</p></form></details>`;
  return `<section class="panel cloud-panel" id="cloud-panel"><div class="eyebrow">YOUR LEARNING, BACKED UP</div><h2>我的云端足迹</h2><p role="status" class="${['error','conflict'].includes(status.kind)?'save-warning':''}">${esc(status.message)}</p>${user?`<p class="hint">当前账号：${esc(user.email||user.id)}</p><div class="modal-actions"><button class="secondary" data-cloud="retry" ${busy?'disabled':''}>检查同步</button><button class="text-btn" data-cloud="logout" ${busy?'disabled':''}>退出登录</button></div>${password}`:configured?login:''}${status.kind==='conflict'?`<div class="cloud-conflict"><p>本机：${summary(context.getState())}<br>云端：${store.remote?summary(store.remote.progress):'这个账号还没有存档'}</p><div class="modal-actions"><button class="secondary" data-action="export">备份本机记录</button>${store.remote?'<button class="secondary" data-cloud="backup-remote">备份云端记录</button>':''}</div><div class="modal-actions">${store.remote?'<button class="secondary" data-cloud="use-remote">恢复云端这一份</button>':''}<button class="secondary" data-cloud="use-local">将本机这一份存到云端</button></div></div>`:''}<p class="hint">只有显示“云端已保存”才代表服务端已确认。清除网站数据后，重新登录同一邮箱即可恢复已同步的记录；离线时新增的记录请先同步或导出。</p></section>`;
}
function summary(state){return `${Object.values(state.sessions).filter(s=>s.complete).length} 次打卡 · ${Object.values(state.spelling||{}).reduce((n,s)=>n+s.attempts,0)} 次拼写 · ${Object.values(state.sessions).reduce((n,s)=>n+s.learned.length,0)} 次学词`;}
function update(next){status=next;const panel=document.querySelector('#cloud-panel');if(panel)panel.outerHTML=cloudPanel();const badge=document.querySelector('#cloud-badge');if(badge){badge.textContent=status.kind==='saved'?'云端已保存':status.user?'云端待同步':'登录云端';badge.title=status.message;}}
export function notifyCloudChange(){store?.changed();}
export async function initCloud(options){
  context=options;
  document.addEventListener('submit',async event=>{
    if(!['cloud-password-login','cloud-password-set'].includes(event.target.id))return;event.preventDefault();
    if(!client)return;
    if(event.target.id==='cloud-password-set'){
      const form=event.target,feedback=document.querySelector('#password-feedback'),button=form.querySelector('button');
      const password=document.querySelector('#cloud-new-password').value;
      if(password!==document.querySelector('#cloud-confirm-password').value){feedback.textContent='两次密码不一致，请重新确认。';return;}
      button.disabled=true;feedback.textContent='正在设置登录密码…';
      try{
        const {error}=await client.auth.updateUser({password});if(error)throw error;
        form.reset();feedback.textContent='登录密码已设置。现在可在手机使用同一邮箱和这个密码登录。';
      }catch{feedback.textContent='密码未设置成功，请稍后重试；学习记录不受影响。';}
      finally{button.disabled=false;}
      return;
    }
    loginEmail=document.querySelector('#cloud-email').value.trim();
    const password=document.querySelector('#cloud-password').value;
    update({...status,kind:'sending',message:'正在登录这台设备…'});
    try{
      const {data,error}=await client.auth.signInWithPassword({email:loginEmail,password});
      if(error||!data.user)throw error||Error('Missing user');
      await store.connect(data.user);
    }catch{update({...status,kind:'error',message:'登录未成功。请核对邮箱和词间登录密码，或检查网络。本机学习记录保留。'});}
  });
  document.addEventListener('click',async event=>{
    const action=event.target.closest('[data-cloud]')?.dataset.cloud;if(!action||!store)return;
    try{
      if(action==='send-link'){
        const field=document.querySelector('#cloud-email');if(!field.reportValidity())return;
        loginEmail=field.value.trim();update({...status,kind:'sending',message:'正在发送登录邮件…'});
        const {error}=await client.auth.signInWithOtp({email:loginEmail,options:{emailRedirectTo:location.origin+location.pathname}});
        if(error){
          const limited=['over_email_send_rate_limit','over_request_rate_limit'].includes(error.code);
          update({...status,kind:'error',message:limited?'邮件发送次数达到服务限制，请稍后重试。':'邮件未发送成功，请使用注册 Supabase 的邮箱或稍后重试。'});
        }else update({...status,kind:'signed-out',message:'邮件已发送。请在需要保存学习记录的设备上打开最新登录链接。'});
        return;
      }
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
