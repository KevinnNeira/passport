const { MongoClient } = require('mongodb');

exports.connectMongodb = async()=>{
    const url = ` mongodb+srv://valentina-26:anavale26@cluster0.3vcyrur.mongodb.net/`;
    const usuario = new MongoClient(url)
    await usuario.connect();
    const db = usuario.db('passport');
    return db;
}