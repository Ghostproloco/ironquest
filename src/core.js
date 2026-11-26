export const RANKS = [
 {name:'Recluta',xp:0,color:'#b3c2cb'}, {name:'Bronce',xp:500,color:'#da9864'},
 {name:'Plata',xp:1500,color:'#d3e4ee'}, {name:'Oro',xp:3500,color:'#f4c75e'},
 {name:'Platino',xp:6500,color:'#72ebca'}, {name:'Diamante',xp:10000,color:'#82bfff'},
 {name:'Élite',xp:16000,color:'#b7a0ff'}, {name:'Leyenda',xp:25000,color:'#ff794e'}
];
export const GOALS = {muscle:'Ganar músculo',strength:'Ganar fuerza',fitness:'Ponerme en forma',fatloss:'Perder grasa'};
export const CATALOG = {
 gym:[
 ['Sentadilla goblet','Piernas','Mantén el tronco firme y baja hasta donde controles.', '8–12'],
 ['Press de pecho en máquina','Pecho','Ajusta el asiento y empuja sin bloquear los codos.', '8–12'],
 ['Remo en polea','Espalda','Acerca el agarre al abdomen sin balancearte.', '10–12'],
 ['Peso muerto rumano con mancuernas','Piernas','Lleva la cadera atrás y mantén la espalda estable.', '8–12'],
 ['Jalón al pecho','Espalda','Baja el agarre hacia el pecho con control.', '10–12'],
 ['Press de hombros con mancuernas','Hombros','Empuja sin arquear la zona lumbar.', '8–12'],
 ['Zancadas','Piernas','Da un paso estable y baja con control.', '8–10 por lado'],
 ['Curl de bíceps','Brazos','Mantén los codos cerca del cuerpo.', '10–15'],
 ['Extensión de tríceps en polea','Brazos','Extiende los codos sin mover los hombros.', '10–15']
 ],
 dumbbell:[
 ['Sentadilla goblet','Piernas','Sujeta la mancuerna cerca del pecho.', '8–12'],
 ['Press de suelo con mancuernas','Pecho','Baja hasta tocar suavemente el suelo con los brazos.', '8–12'],
 ['Remo con mancuerna','Espalda','Apoya una mano y tira del codo hacia atrás.', '10–12 por lado'],
 ['Peso muerto rumano con mancuernas','Piernas','Flexiona ligeramente las rodillas y lleva la cadera atrás.', '8–12'],
 ['Press de hombros sentado','Hombros','Evita arquear la espalda al empujar.', '8–12'],
 ['Curl de bíceps','Brazos','Sube con control y evita el balanceo.', '10–15'],
 ['Zancadas con mancuernas','Piernas','Acorta el recorrido si pierdes estabilidad.', '8–10 por lado'],
 ['Elevaciones laterales','Hombros','Eleva sin encoger los hombros.', '10–15'],
 ['Puente de glúteos','Piernas','Eleva la cadera sin arquear la espalda.', '12–15']
 ],
 bodyweight:[
 ['Sentadilla a una silla','Piernas','Toca la silla con control y vuelve a subir.', '10–15'],
 ['Flexiones inclinadas','Pecho','Apoya las manos en una superficie firme.', '6–12'],
 ['Bird dog','Core','Extiende brazo y pierna contrarios sin girar el tronco.', '8 por lado'],
 ['Puente de glúteos','Piernas','Empuja con los talones y aprieta los glúteos.', '12–15'],
 ['Flexiones de pared','Pecho','Mantén el cuerpo alineado.', '10–15'],
 ['Dead bug','Core','Mueve brazo y pierna contrarios sin despegar la espalda.', '8 por lado'],
 ['Zancada hacia atrás','Piernas','Usa un apoyo estable si lo necesitas.', '8 por lado'],
 ['Elevación de talones','Piernas','Sube y baja lentamente con apoyo estable.', '12–15'],
 ['Plancha elevada','Core','Usa una superficie firme y respira con normalidad.', '20–30 s']
 ]
};
export function defaultState(){return {version:1,profile:{alias:'Atleta',goal:'muscle',equipment:'gym',days:3,level:'beginner',minutes:40},history:[],weights:[],water:{date:dayKey(),glasses:0},draft:null};}
export function dayKey(date=new Date()){const d=new Date(date);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
export function makePlan(profile){
 const equipment=Object.hasOwn(CATALOG,profile.equipment)?profile.equipment:'gym';
 const catalog=CATALOG[equipment];
 const count=profile.minutes<=25?3:profile.minutes>=55?5:4;
 const sets=profile.level==='beginner'?2:3;
 return Array.from({length:Math.max(2,Math.min(5,Number(profile.days)||3))},(_,i)=>({
  id:`${equipment}-${i}`,name:['Base & potencia','Control & fuerza','Impulso total','Construye tu ritmo','Cierra la semana'][i],
  subtitle:['Cuerpo completo · A','Cuerpo completo · B','Cuerpo completo · C','Cuerpo completo · D','Cuerpo completo · E'][i],
  exercises:Array.from({length:count},(_,j)=>{
   const [name,group,cue,reps]=catalog[(i*3+j)%catalog.length];
   return {id:`${equipment}-${i}-${j}`,name,group,cue,reps,sets,rest:profile.goal==='strength'?120:75};
  })
 }));
}
export function totalXP(history){return history.reduce((sum,s)=>sum+(Number(s.xp)||0),0);}
export function rankInfo(xp){let index=0;for(let i=0;i<RANKS.length;i++)if(xp>=RANKS[i].xp)index=i;const current=RANKS[index],next=RANKS[index+1];return {index,current,next,progress:next?Math.min(100,Math.max(0,(xp-current.xp)/(next.xp-current.xp)*100)):100};}
export function sessionXP(sets){return sets>0?Math.min(180,80+sets*5):0;}
export function weekCount(history,now=new Date()) {const start=new Date(now);start.setHours(0,0,0,0);start.setDate(start.getDate()-((start.getDay()+6)%7));const end=new Date(start);end.setDate(end.getDate()+7);return history.filter(s=>new Date(s.endedAt)>=start&&new Date(s.endedAt)<end).length;}
export function streak(history,now=new Date()){
 const days=new Set(history.map(s=>dayKey(s.endedAt)));let d=new Date(now),n=0;
 if(!days.has(dayKey(d)))d.setDate(d.getDate()-1);
 while(days.has(dayKey(d))){n++;d.setDate(d.getDate()-1);}return n;
}
export function finishSession(state,draft,now=new Date()){
 if(state.history.some(s=>s.id===draft.id))return state;
 const completed=draft.entries.filter(s=>s.done);
 if(!completed.length)return state;
 const session={id:draft.id,name:draft.name,startedAt:draft.startedAt,endedAt:now.toISOString(),sets:completed.length,xp:sessionXP(completed.length),volume:completed.reduce((n,s)=>n+(Number(s.kg)||0)*(Number(s.reps)||0),0),entries:completed};
 return {...state,draft:null,history:[...state.history,session]};
}
export function validateImport(value){
 if(value?.version!==1||!value.profile||!Array.isArray(value.history)||!Array.isArray(value.weights))throw Error('El archivo no tiene un formato compatible.');
 const p=value.profile;
 if(!Object.hasOwn(GOALS,p.goal)||!Object.hasOwn(CATALOG,p.equipment)||!['beginner','intermediate'].includes(p.level)||!Number.isInteger(p.days)||p.days<2||p.days>5||![25,40,60].includes(p.minutes)||typeof p.alias!=='string'||p.alias.length>24)throw Error('El perfil del archivo no es válido.');
 if(value.history.length>10000||value.weights.length>10000)throw Error('El archivo contiene demasiados registros.');
 const ids=new Set();
 for(const s of value.history){if(typeof s.id!=='string'||ids.has(s.id)||!Number.isFinite(Date.parse(s.endedAt))||typeof s.name!=='string'||!Number.isInteger(s.sets)||s.sets<1||!Number.isFinite(s.volume)||s.volume<0||s.xp!==sessionXP(s.sets))throw Error('Hay sesiones no válidas.');ids.add(s.id);}
 for(const w of value.weights)if(!Number.isFinite(w.kg)||w.kg<20||w.kg>400||!Number.isFinite(Date.parse(w.date)))throw Error('Hay registros de peso no válidos.');
 return {...defaultState(),profile:{...p},history:value.history,weights:value.weights,draft:null};
}
