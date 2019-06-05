// ===================================
// PUERTO 
// ===================================
//const puerto = process.env.PORT || 3000;
process.env.PORT = process.env.PORT || 3000;

// ===================================
// ENTORNO
// ===================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; 

// ===================================
// BD
// ===================================
let urlDB;
if(process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = 'mongodb+srv://ParedesFabio:wHGcqS2KOatBearY@restservernode-g2em6.mongodb.net/cafe';
}
//urlDB = 'mongodb+srv://ParedesFabio:wHGcqS2KOatBearY@restservernode-g2em6.mongodb.net/cafe';

process.env.URL_DB = urlDB;



