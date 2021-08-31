const bcrypt = require("bcrypt")

module.exports.createCrypt = async function createCrypt(word){
    const salt = await bcrypt.genSalt(10);
    // console.log(salt)
    return await bcrypt.hash(word,salt)
}


module.exports.compareCrypt = async function createCrypt(crypt, word){
    return await bcrypt.compare(word,crypt)
}