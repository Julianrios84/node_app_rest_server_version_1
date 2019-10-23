// ===========================
// Port
// ===========================
process.env.PORT = process.env.PORT || 3000;

// ===========================
//Entorno
// ===========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===========================
// Vencimiento del token
// 60sg * 60min * 24hrs * 30d  vence en 1 mes
// ===========================
// process.env.TOKEN_EXPIRATION = 60 * 60 * 24 * 30;
process.env.TOKEN_EXPIRATION = '48h';

// ===========================
// Seed de autentificaciónn
// ===========================
process.env.TOKEN_SEED = process.env.TOKEN_SEED || 'seedtoken-dev';

// ===========================
// Base de datos
// ===========================
let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB =urlDB;

// ===========================
// Google Client ID
// ===========================
process.env.CLIENT_ID = process.env.CLIENT_ID || '1030424138777-3htrsch1e7dfsas5v9o5vdit7rqopc1h.apps.googleusercontent.com'; 


// ===========================
// 
// ===========================

// ===========================
// 
// ===========================

// ===========================
// 
// ===========================