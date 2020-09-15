const MongoClient = require('mongodb').MongoClient;
const Long = require('mongodb').Long;
let url = 'mongodb://localhost:27017';
let dbName = 'main';
let DB = {};
async function connect(arg = {}){
    let client = MongoClient.connect((arg.url || url), {useNewUrlParser: true, useUnifiedTopology: true})
    .catch(err => {console.log(err)});
    return client || false;

}


DB.listCollectionsNameArray = async function listCollectionsNameArray(arg){
    LOG_FUNC(arguments, __filename);
    let client = await connect(arg);

    if (!client) return;

    try {
        let db = client.db(dbName);
        let arr = await db.listCollections().toArray();
        return arr.map(el => el.name);
    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }
}



DB.findOne = async function findOne(arg){
    LOG_FUNC(arguments, __filename);
    let client = await connect(arg);

    if (!client) return;

    try {
        let db = client.db(dbName);
        let collection = db.collection(arg.collection);
        return await collection.findOne(arg.find, arg.opt);
    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }
}
DB.find = async function find(arg){
    LOG_FUNC(arguments, __filename);
    let client = await connect(arg);

    if (!client) return;

    try {
        let db = client.db(dbName);
        let collection = db.collection(arg.collection);

        let resp = collection.find(arg.find || {}, arg.opt);
        return await resp.toArray();
    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }
}
DB.updateOne = async function updateOne(arg){
    LOG_FUNC(arguments, __filename);
    let client = await connect(arg);

    if (!client) return;

    try {
        let db = client.db(dbName);
        let collection = db.collection(arg.collection);
        return await collection.updateOne({_id: arg._id}, arg.update, arg.opt);
    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }
}
DB.deleteOne = async function deleteOne(arg){
    LOG_FUNC(arguments, __filename);
    let client = await connect(arg);

    if (!client) return;

    try {
        let db = client.db(dbName);
        let collection = db.collection(arg.collection);
        return await collection.deleteOne({_id: arg._id}, arg.opt);
    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }
}

module.exports = DB;

//async remove(name, ...args){
    //         let [query, projection] = args;
    //         let collection = await this.collection(name);
    //         return await collection.remove(query, projection);
    //     }
//async insertOne(name, ...args){
    //         let [query, projection] = args;
    //         let collection = await this.collection(name);
    //         let {result: ok} = await collection.insertOne(query, projection);
    //         return ok.ok && ok.n
    //     }


































//const MongoClient = require('mongodb').MongoClient;

// class Db extends MongoClient {
//     constructor(){
//         super();
//         this.domain = 'mongodb://localhost:27017/main';
//     }
//     async collection(name){
//         if(!name){
//         return console.log(
//             ('\n' + this.name + ' getCollection() arg name = ').red  + String(name).cyan,
//             '\npath: '.red + __filename.dim + '\n'
//             )
//         }
//         if(!this.DB){
//             this.DB = await this.connect(this.domain)
//         }
//         return this.DB.collection(name);
//     }
//     async listCollections() {
//         let db = await this.connect(this.domain);
//         console.log(await db.listCollections().toArray() );
//     }
//     async dropDatabase() {
//         let db = await this.connect(this.domain);
//         db.dropDatabase()
//         console.log('Db ' + this.domain + ' is dropped');
//     }
//     async remove(name, ...args){
//         let [query, projection] = args;
//         let collection = await this.collection(name);
//         return await collection.remove(query, projection);
//     }
//     async find(name, ...args){
//         let [query, projection] = args;
//         let collection = await this.collection(name);
//         return collection.find(query, projection);
//     }
//     async sortAndLimit(cursor, sort, limit){

//         return cursor.sort(sort).limit(limit).toArray();
//     }
//     async findToArray(name, ...args){
//         let [query, projection] = args;
//         let collection = await this.collection(name);
//         return collection.find(query, projection).toArray();
//     }
//     async findOne(name, ...args){
//         let [query, projection] = args;
//         let collection = await this.collection(name);
//         return collection.findOne(query, projection);
//     }
//     async insert(name, ...args){
//         let [query, projection] = args;
//         let collection = await this.collection(name);
//         let {result: ok} = await collection.insert(query, projection);
//         return ok.ok && ok.n
//     }
//     async insertOne(name, ...args){
//         let [query, projection] = args;
//         let collection = await this.collection(name);
//         let {result: ok} = await collection.insertOne(query, projection);
//         return ok.ok && ok.n
//     }
//     async update(name, ...args){
//         let [query, projection] = args;
//         let collection = await this.collection(name);
//         let {result: ok} = await collection.update(query, projection);
//         return ok.ok && ok.nModified
//     }
//     async updateOne(name, ...args){
//         let [query, projection] = args;
//         let collection = await this.collection(name);
//         let {result: ok} = await collection.updateOne(query, projection);

//         return ok.ok && ok.nModified
//     }
//     async save(name, ...args){
//         let [query, projection] = args;
//         let collection = await this.collection(name);
//         let {result: ok} = await collection.save(query, projection);
//         return ok.ok
//     }

//     async distinct(name, ...args){
//         let [query, projection] = args;
//         let collection = await this.collection(name);
//         return collection.distinct(query, projection).toArray();
//     }


// }
// DB = new Db();

