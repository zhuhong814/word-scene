import {validState} from './core.mjs?v=20261110-5';

export const cloudMetaKey='wordscene-cloud-v1';
export function hasLearning(state){
  return state.saved.length>0||Object.keys(state.spelling||{}).length>0||Object.values(state.sessions).some(s=>s.learned.length||Object.keys(s.answers).length||s.read||s.complete);
}
export function signature(state){
  const copy=structuredClone(state);delete copy.lastSavedAt;
  // Opening a new day creates an empty session; that is not a learning edit.
  for(const [day,s] of Object.entries(copy.sessions))if(!s.learned.length&&!Object.keys(s.answers).length&&!s.read&&!s.complete)delete copy.sessions[day];
  function sorted(v){return Array.isArray(v)?v.map(sorted):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,sorted(v[k])])):v;}
  return JSON.stringify(sorted(copy));
}
export function reconcile(local,remote,meta,userId){
  if(!remote)return meta?.userId&&meta.userId!==userId&&hasLearning(local)?'conflict':'upload';
  if(!validState(remote.progress))throw Error('云端记录格式异常，已暂停同步，请先导出本机备份。');
  if(signature(local)===signature(remote.progress))return 'download';
  if(meta?.userId===userId&&signature(local)===meta.signature)return 'download';
  if(meta?.userId===userId&&meta.revision===remote.revision)return 'upload';
  if(!hasLearning(local))return 'download';
  return 'conflict';
}

// A revision filter makes writes atomic: a stale device cannot overwrite a newer row.
export class CloudProgress {
  constructor({client,storage,getState,applyState,onStatus}){
    Object.assign(this,{client,storage,getState,applyState,onStatus});
    this.user=null;this.remote=null;this.ready=false;this.busy=false;this.conflict=false;this.pending=false;this.epoch=0;
    try{this.baseline=JSON.parse(storage.getItem(cloudMetaKey)||'null');}catch{this.baseline=null;}
  }
  status(kind,message){this.onStatus({kind,message,user:this.user,remote:this.remote});}
  meta(){return this.baseline;}
  remember(row){const next={userId:this.user.id,revision:row.revision,signature:signature(row.progress)};this.storage.setItem(cloudMetaKey,JSON.stringify(next));this.baseline=next;}
  async read(){
    const {data,error}=await this.client.from('wordscene_progress').select('progress,revision,updated_at').eq('user_id',this.user.id).maybeSingle();
    if(error)throw error;return data;
  }
  async connect(user){
    if(this.busy)return;
    const epoch=++this.epoch;this.user=user;this.ready=false;this.conflict=false;this.remote=null;
    if(!user){this.status('signed-out','未登录，当前仅保存在此浏览器。');return;}
    this.status('loading','正在读取云端记录…');
    try{
      const remote=await this.read();if(epoch!==this.epoch)return;
      this.remote=remote;
      const action=reconcile(this.getState(),remote,this.meta(),user.id);
      if(action==='conflict'){this.showConflict();return;}
      this.ready=true;
      if(action==='download')this.acceptRemote(remote);else await this.flush();
    }catch{if(epoch===this.epoch){this.ready=false;this.status('error','云端读取失败，本机记录保留。请检查网络后重试。');}}
  }
  acceptRemote(row){
    if(!row||!validState(row.progress))throw Error('Invalid cloud progress');
    this.applyState(structuredClone(row.progress));this.remember(row);this.remote=row;this.ready=true;this.conflict=false;
    this.status('saved',`云端已保存 · ${new Date(row.updated_at).toLocaleString('zh-CN',{hour12:false})}`);
  }
  showConflict(){this.conflict=true;this.ready=false;this.status('conflict','发现本机与云端两份不同记录，自动覆盖已暂停。请先导出备份，再选择保留哪份。');}
  changed(){
    if(!this.user||this.conflict)return;
    this.pending=true;this.status('pending','本机已保存，等待云端确认…');
    clearTimeout(this.timer);this.timer=setTimeout(()=>this.flush(),400);
  }
  async flush(){
    if(this.busy||!this.ready||!this.user||this.conflict)return;
    this.busy=true;const epoch=this.epoch;
    try{
      do{
        this.pending=false;
        const progress=structuredClone(this.getState());
        if(!validState(progress))throw Error('Invalid progress');
        if(this.remote&&signature(progress)===signature(this.remote.progress)){
          this.status('saved',`云端已保存 · ${new Date(this.remote.updated_at).toLocaleString('zh-CN',{hour12:false})}`);break;
        }
        this.status('saving','正在保存到云端…');
        const table=this.client.from('wordscene_progress');
        const query=this.remote?table.update({progress}).eq('user_id',this.user.id).eq('revision',this.remote.revision):table.insert({user_id:this.user.id,progress});
        const {data,error}=await query.select('progress,revision,updated_at').maybeSingle();
        if(epoch!==this.epoch)return;
        if(error?.code==='23505'||(!error&&!data)){this.remote=await this.read();if(epoch===this.epoch)this.showConflict();return;}
        if(error)throw error;
        this.remote=data;this.remember(data);
        this.pending=signature(this.getState())!==signature(progress);
        this.status(this.pending?'pending':'saved',this.pending?'有新进度，继续同步…':`云端已保存 · ${new Date(data.updated_at).toLocaleString('zh-CN',{hour12:false})}`);
      }while(this.pending&&epoch===this.epoch);
    }catch{if(epoch===this.epoch){this.pending=true;this.status('error','云端保存未确认，本机记录保留。请检查网络后重试。');}}
    finally{this.busy=false;}
  }
  async resolve(choice){
    if(!this.user||!this.conflict)return;
    if(choice==='remote'){if(this.remote)this.acceptRemote(this.remote);return;}
    // The displayed revision is retained; another device writing meanwhile causes another conflict.
    this.conflict=false;this.ready=true;await this.flush();
  }
}
