import test from 'node:test';
import assert from 'node:assert/strict';
import {RANKS,GOALS,CATALOG,defaultState,makePlan,rankInfo,totalXP,sessionXP,finishSession,weekCount,streak,validateImport} from '../src/core.js';
test('cada combinación crea sesiones con el material y tiempo elegidos',()=>{
 for(const equipment of Object.keys(CATALOG))for(const goal of Object.keys(GOALS))for(const days of [2,3,4,5])for(const minutes of [25,40,60])for(const level of ['beginner','intermediate']){
  const plan=makePlan({equipment,goal,days,minutes,level});
  assert.equal(plan.length,days);
  for(const session of plan){assert.equal(session.exercises.length,minutes===25?3:minutes===60?5:4);for(const e of session.exercises){assert.ok(CATALOG[equipment].some(c=>c[0]===e.name));assert.equal(e.sets,level==='beginner'?2:3);assert.equal(e.rest,goal==='strength'?120:75);}}
 }
});
test('umbrales de los ocho rangos y progreso',()=>{
 RANKS.forEach((r,i)=>{assert.equal(rankInfo(r.xp).index,i);if(i)assert.equal(rankInfo(r.xp-1).index,i-1);});
 assert.equal(rankInfo(250).progress,50);assert.equal(rankInfo(99999).progress,100);
});
test('una sesión vacía no suma XP y no se duplica una sesión finalizada',()=>{
 const state=defaultState();const draft={id:'one',name:'Test',startedAt:'2026-11-26T10:00:00Z',entries:[]};
 assert.equal(finishSession(state,draft),state);
 draft.entries=[{done:true,kg:10,reps:12},{done:false,kg:100,reps:10}];
 const next=finishSession(state,draft,new Date('2026-11-26T11:00:00Z'));
 assert.equal(next.history[0].sets,1);assert.equal(next.history[0].volume,120);assert.equal(totalXP(next.history),85);assert.equal(next.draft,null);
 assert.equal(finishSession(next,draft),next);assert.equal(sessionXP(1000),180);assert.equal(sessionXP(0),0);
});
test('se cuentan sesiones de la semana actual sin incluir futuras semanas',()=>{
 const history=['2026-11-22','2026-11-23','2026-11-26','2026-11-30'].map(date=>({endedAt:date+'T12:00:00'}));
 assert.equal(weekCount(history,new Date('2026-11-26T12:00:00')),2);
});
test('racha no se duplica por dos sesiones y admite descanso hasta ayer',()=>{
 const history=['2026-11-24','2026-11-25','2026-11-25'].map(date=>({endedAt:date+'T12:00:00'}));
 assert.equal(streak(history,new Date('2026-11-26T12:00:00')),2);
 assert.equal(streak(history,new Date('2026-11-28T12:00:00')),0);
});
test('copia se importa conservando progreso y descartando sesión activa',()=>{
 const state=defaultState();state.weights=[{date:'2026-11-26T12:00:00',kg:75}];state.draft={id:'unfinished'};
 const imported=validateImport(JSON.parse(JSON.stringify(state)));
 assert.equal(imported.weights[0].kg,75);assert.equal(imported.draft,null);
});
test('copias corruptas o manipuladas se rechazan',()=>{
 assert.throws(()=>validateImport({}));
 const state=defaultState();state.profile.equipment='invalid';assert.throws(()=>validateImport(state));
 const b=defaultState();b.weights=[{kg:-5,date:'bad'}];assert.throws(()=>validateImport(b));
 const c=defaultState();c.history=[{id:'x',name:'X',sets:1,volume:0,xp:100000,endedAt:'2026-11-26'}];assert.throws(()=>validateImport(c));
});
