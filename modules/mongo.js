const {
    MongoClient
} = require("mongodb")
const mongoAtlasUrl = 'mongodb://localhost:27017';
// console.log(mongoAtlasUrl)
const client = new MongoClient(mongoAtlasUrl);
// console.log(client)

async function mongo() {
    try {
        await client.connect();
        const db = await client.db("usersystem")
        const users = await db.collection("users")
        return {
            users,
        }
    } catch (error) {
        console.log(error)
    }
}
mongo()



module.exports = mongo;





