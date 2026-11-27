import test from 'node:test';
import assert from 'node:assert/strict';
import {createAuthClient,isConfigured,authMessage,userStorageKey} from '../src/auth-client.js';
const config={apiKey:'test-public-config',authDomain:'test.firebaseapp.com',projectId:'test',appId:'test-app'};
test('el acceso sin configuración nunca simula una cuenta ni carga el SDK',async()=>{
 let loaded=false;const client=createAuthClient(null,async()=>{loaded=true;});
 assert.equal(client.configured,false);await assert.rejects(client.google(),{code:'auth/not-configured'});assert.equal(loaded,false);
 assert.equal(isConfigured({...config,projectId:''}),false);
});
test('las cuentas y el invitado usan espacios locales separados',()=>{
 assert.equal(userStorageKey(null),'ironquest.state.v1');
 assert.notEqual(userStorageKey('user-a'),userStorageKey('user-b'));
 assert.notEqual(userStorageKey('user-a'),userStorageKey(null));
 assert.throws(()=>userStorageKey(''));
});
test('errores de acceso se traducen sin exponer mensajes internos',()=>{
 assert.match(authMessage({code:'auth/invalid-credential'}),/correo o la contraseña/);
 assert.doesNotMatch(authMessage({message:'private internal server data'}),/private/);
 assert.match(authMessage({code:'auth/popup-blocked'}),/ventana/);
});
function mockSDK(){
 const calls=[];const user={uid:'user-a',emailVerified:false};const auth={currentUser:user};
 return {calls,auth,
 initializeApp(c){calls.push(['init',c.projectId]);return {};},getAuth(){return auth;},browserLocalPersistence:'local',
 async setPersistence(a,p){calls.push(['persistence',p]);},
 onAuthStateChanged(a,cb){cb(user);return ()=>calls.push(['unsubscribe']);},
 GoogleAuthProvider:class{setCustomParameters(p){calls.push(['provider',p]);}},
 async signInWithPopup(a,p){calls.push(['google']);return {user};},
 async signInWithEmailAndPassword(a,e,p){calls.push(['login',e]);return {user};},
 async createUserWithEmailAndPassword(a,e,p){calls.push(['register',e]);return {user};},
 async sendEmailVerification(u){calls.push(['verify',u.uid]);},
 async sendPasswordResetEmail(a,e){calls.push(['reset',e]);},
 async signOut(){calls.push(['logout']);},async reload(){calls.push(['reload']);}
 };
}
test('el cliente delega Google, correo, verificación y cierre al proveedor',async()=>{
 const sdk=mockSDK();let loads=0;const client=createAuthClient(config,async()=>{loads++;return sdk;});
 let observed;const unsubscribe=await client.observe(u=>observed=u.uid);assert.equal(observed,'user-a');
 await client.google();await client.login('test@example.com','fixture');await client.register('test@example.com','fixture');
 await client.reset('test@example.com');await client.verify();await client.refresh();await client.logout();unsubscribe();
 assert.equal(loads,1);assert.equal(sdk.auth.languageCode,'es');
 assert.deepEqual(sdk.calls.filter(c=>c[0]==='provider')[0],['provider',{prompt:'select_account'}]);
 for(const action of ['google','login','register','verify','reset','logout','reload','unsubscribe'])assert.ok(sdk.calls.some(c=>c[0]===action));
});
test('si falla el correo de verificación, no se simula un fallo de registro',async()=>{
 const sdk=mockSDK();sdk.sendEmailVerification=async()=>{throw Error('mail unavailable');};
 const client=createAuthClient(config,async()=>sdk);const result=await client.register('test@example.com','fixture');assert.equal(result.verificationPending,true);assert.equal(result.user.uid,'user-a');
});
test('un fallo al cargar el proveedor permite reintentar sin falsear la sesión',async()=>{
 const sdk=mockSDK();let count=0;const client=createAuthClient(config,async()=>{if(count++===0)throw Error('network');return sdk;});
 await assert.rejects(client.google());assert.equal((await client.google()).user.uid,'user-a');assert.equal(count,2);
});
