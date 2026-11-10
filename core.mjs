export const dateKey=(date=new Date())=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
export const initialState=()=>({version:1,count:4,accent:'en-GB',rate:0.85,sessions:{},saved:[]});
export function lessonForDay(state,date,total){
  const existing=state.sessions[date];
  if(existing) return existing.lesson;
  const done=new Set(Object.values(state.sessions).filter(s=>s.complete).map(s=>s.lesson));
  for(let i=0;i<total;i++) if(!done.has(i)) return i;
  return null;
}
export function sessionFor(state,date,total){
  const index=lessonForDay(state,date,total);
  if(index===null) return null;
  if(!state.sessions[date]) {
    const previous=Object.entries(state.sessions).sort(([a],[b])=>b.localeCompare(a)).find(([d,s])=>d<date&&s.lesson===index&&!s.complete)?.[1];
    state.sessions[date]=previous?structuredClone(previous):{lesson:index,count:state.count,learned:[],answers:{},read:false,complete:false};
  }
  return state.sessions[date];
}
export function passage(lesson,count){return [...lesson.paragraphs,...lesson.extras.slice(0,count-3)];}
export function canComplete(session){return !!session&&session.learned.length>=session.count&&session.read&&Object.keys(session.answers).length===2;}
export function streak(state,today=new Date()){
  const day=new Date(today.getFullYear(),today.getMonth(),today.getDate(),12);let count=0;
  if(!state.sessions[dateKey(day)]?.complete) day.setDate(day.getDate()-1);
  while(state.sessions[dateKey(day)]?.complete){count++;day.setDate(day.getDate()-1);}return count;
}
export function validState(s,total=7){
  if(!s||s.version!==1||![3,4,5].includes(s.count)||!['en-GB','en-US'].includes(s.accent)||![0.7,0.85,1].includes(s.rate)||!Array.isArray(s.saved)||!s.sessions||typeof s.sessions!=='object'||Array.isArray(s.sessions)) return false;
  if(!s.saved.every(w=>typeof w==='string')) return false;
  if(s.lastSavedAt!==undefined&&(!Number.isFinite(s.lastSavedAt)||s.lastSavedAt<=0))return false;
  if(s.spelling!==undefined){
    if(!s.spelling||typeof s.spelling!=='object'||Array.isArray(s.spelling))return false;
    if(!Object.entries(s.spelling).every(([word,r])=>/^[a-z]+$/.test(word)&&r&&['attempts','correct','assisted'].every(k=>Number.isSafeInteger(r[k])&&r[k]>=0)&&r.correct+r.assisted<=r.attempts&&Number.isFinite(r.lastAt)&&r.lastAt>0))return false;
  }
  return Object.entries(s.sessions).every(([d,x])=>/^\d{4}-\d{2}-\d{2}$/.test(d)&&x&&Number.isInteger(x.lesson)&&x.lesson>=0&&x.lesson<total&&[3,4,5].includes(x.count)&&Array.isArray(x.learned)&&new Set(x.learned).size===x.learned.length&&x.learned.every(n=>Number.isInteger(n)&&n>=0&&n<x.count)&&x.answers&&typeof x.answers==='object'&&!Array.isArray(x.answers)&&Object.entries(x.answers).every(([q,a])=>['0','1'].includes(q)&&[0,1,2].includes(a))&&typeof x.read==='boolean'&&typeof x.complete==='boolean'&&(!x.complete||canComplete(x)));
}
