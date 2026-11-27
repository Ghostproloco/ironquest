// Firebase web configuration is public. Never put service-account credentials here.
export function isConfigured(config){return Boolean(config&&['apiKey','authDomain','projectId','appId'].every(key=>typeof config[key]==='string'&&config[key].trim()));}
export function authMessage(error){
 const messages={
  'auth/invalid-credential':'El correo o la contraseña no son correctos.',
  'auth/invalid-email':'Revisa el formato del correo.',
  'auth/email-already-in-use':'Este correo ya tiene una cuenta. Inicia sesión o recupera tu contraseña.',
  'auth/weak-password':'Elige una contraseña más segura.',
  'auth/password-does-not-meet-requirements':'La contraseña no cumple los requisitos de seguridad de la cuenta.',
  'auth/too-many-requests':'Demasiados intentos. Espera un poco antes de volver a probar.',
  'auth/network-request-failed':'No se ha podido conectar. Comprueba tu conexión.',
  'auth/popup-blocked':'El navegador ha bloqueado la ventana de Google. Permite las ventanas emergentes y vuelve a intentarlo.',
  'auth/popup-closed-by-user':'Se ha cerrado la ventana de Google. Puedes volver a intentarlo.',
  'auth/cancelled-popup-request':'Ya hay una ventana de acceso abierta.',
  'auth/unauthorized-domain':'El acceso aún no está habilitado para este dominio.',
  'auth/operation-not-allowed':'Este método de acceso todavía no está activado.',
  'auth/account-exists-with-different-credential':'Este correo utiliza otro método de acceso. Entra con el método que usaste al crear la cuenta.',
  'auth/requires-recent-login':'Vuelve a iniciar sesión para realizar esta acción.',
  'auth/not-configured':'El acceso con cuenta aún no está activado. Puedes continuar como invitado.',
  'auth/offline':'Necesitas conexión para acceder a tu cuenta.'
 };
 return messages[error?.code]||'No se ha podido completar el acceso. Vuelve a intentarlo.';
}
export function userStorageKey(uid){if(uid!==null&&(typeof uid!=='string'||!uid))throw Error('Identificador de cuenta no válido.');return uid?`ironquest.account.v1.${uid}`:'ironquest.state.v1';}
export function createAuthClient(config,loadSDK=defaultSDK){
 let sdk,auth,initializing;
 async function init(){
  if(!isConfigured(config))throw Object.assign(Error(),{code:'auth/not-configured'});
  if(!initializing)initializing=(async()=>{sdk=await loadSDK();const app=sdk.initializeApp(config);auth=sdk.getAuth(app);auth.languageCode='es';await sdk.setPersistence(auth,sdk.browserLocalPersistence);return auth;})().catch(error=>{initializing=null;throw error;});
  return initializing;
 }
 async function ready(){if(globalThis.navigator?.onLine===false)throw Object.assign(Error(),{code:'auth/offline'});return init();}
 return {
  configured:isConfigured(config),
  async observe(callback){await init();return sdk.onAuthStateChanged(auth,callback);},
  async google(){await ready();const provider=new sdk.GoogleAuthProvider();provider.setCustomParameters({prompt:'select_account'});return sdk.signInWithPopup(auth,provider);},
  async login(email,password){await ready();return sdk.signInWithEmailAndPassword(auth,email,password);},
  async register(email,password){await ready();const result=await sdk.createUserWithEmailAndPassword(auth,email,password);try{await sdk.sendEmailVerification(result.user);}catch{return {...result,verificationPending:true};}return result;},
  async reset(email){await ready();return sdk.sendPasswordResetEmail(auth,email);},
  async verify(){await ready();if(auth.currentUser)await sdk.sendEmailVerification(auth.currentUser);},
  async refresh(){await ready();if(auth.currentUser)await sdk.reload(auth.currentUser);return auth.currentUser;},
  async logout(){await init();return sdk.signOut(auth);}
 };
}
async function defaultSDK(){
 const [app,auth]=await Promise.all([
  import('https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js'),
  import('https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js')
 ]);return {...app,...auth};
}
