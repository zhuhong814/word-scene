import {initialState,validState} from './core.mjs?v=20261110-5';
export const storageKey='wordscene-v1';
export function loadProgress(storage){
  try{
    const raw=storage.getItem(storageKey);
    if(raw===null)return {state:initialState(),found:false,issue:false};
    const state=JSON.parse(raw);
    if(!validState(state))throw Error('Invalid progress');
    return {state,found:true,issue:false};
  }catch{return {state:initialState(),found:false,issue:true};}
}
export function persistProgress(storage,state,now=Date.now()){
  const next={...state,lastSavedAt:now};
  if(!validState(next))throw Error('Invalid progress');
  const text=JSON.stringify(next);
  storage.setItem(storageKey,text);
  if(storage.getItem(storageKey)!==text)throw Error('Save verification failed');
  state.lastSavedAt=now;
}
export function checkSpelling(answer,word){
  const normalized=answer.normalize('NFKC').trim().toLowerCase();
  if(!normalized)return {kind:'empty'};
  if(!/^[a-z]+$/.test(normalized))return {kind:'invalid'};
  if(normalized===word)return {kind:'correct',normalized};
  let index=0;while(index<normalized.length&&index<word.length&&normalized[index]===word[index])index++;
  return {kind:'wrong',normalized,index};
}
export function recordSpelling(state,word,correct,assisted,now=Date.now()){
  state.spelling??={};
  const old=state.spelling[word]||{attempts:0,correct:0,assisted:0,lastAt:now};
  state.spelling[word]={attempts:old.attempts+1,correct:old.correct+(correct&&!assisted?1:0),assisted:old.assisted+(correct&&assisted?1:0),lastAt:now};
}
