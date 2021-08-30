const {MongoClient} = require('mongodb')
const dbName = 'inventory';

const uri = process.env.uri || "mongodb://localhost:27017/inventory";
const client = new MongoClient(uri,{
  useUnifiedTopology: true,
  useNewUrlParser: true,
  keepAlive: 1,
});

(async function dbConnect(){
  try{
    await client.connect();
    console.log(`Connected MongoDB: ${uri}`);
    console.log(`Database: ${dbName}`);
  }catch(err){
    console.log('mongo connection failed');
  }
})();

function getCollectionInstance(collectionName, logger){
  try{
    const db = client.db(dbName);
    // console.log(db)
    return db.collection(collectionName);
  }
  catch(err){
    console.log('sorry');
  }
};


module.exports.getCollectionInstance = getCollectionInstance;