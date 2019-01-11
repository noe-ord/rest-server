

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
// Base de datos
//=======================
let urlDB;

// // if(process.env.NODE_ENV === 'dev'){
//     urlDB = 'mongodb://localhost:27017/cafe';
// } else {
    urlDB = 'mongodb://cafe-user:C0n3c74nd0@ds041671.mlab.com:41671/cafe';
// }

process.env.URLDB = urlDB;