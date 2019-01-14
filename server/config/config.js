

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