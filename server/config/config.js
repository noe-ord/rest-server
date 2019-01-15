

//=============================
// Puerto
//=============================
process.env.PORT = process.env.PORT || 3020;

//==========================
// Entorno
//==========================
//NODE_ENV es una variable de entorno de heroku
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=======================
// Vencimiento del Token
//=======================
// seg
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//=======================
// SEED de autenticacion (key)
//=======================

 process.env.SEED = process.env.SEMILLA || 'este-es-el-desarrollo';

// 'este-es-el-produccion'

//=======================
// Base de datos
//=======================
let urlDB;
if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
 }

process.env.URLDB = urlDB;

// =====================
// Google Client ID
// =====================

process.env.CLIENT_ID = process.env.CLIENT_ID || '831218751933-kcg68n4mo4j2ip2i9ar7lp47g15taf0s.apps.googleusercontent.com';
