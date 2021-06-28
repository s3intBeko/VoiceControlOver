const crypto = require('crypto')
require("../Config/config")

exports.signApiKey = (payload)=> {
    const secret = process.env.APIKEY;
    return crypto.createHash('md5').update(JSON.stringify(payload)+secret).digest("hex")    
};
exports.verifySigneture = (payload)=> {
    const secret = process.env.APIKEY;
    
    let signQuery = payload
    if(signQuery.hasOwnProperty("sign") && signQuery.hasOwnProperty("ct")){
        let inSig = signQuery["sign"]
        delete signQuery["sign"]
        let sig = crypto.createHash('md5').update(JSON.stringify(signQuery)+secret).digest("hex")  
        if(Math.abs(Math.floor(Date.now() / 1000) - signQuery["ct"]) > 25) return false
        if(inSig != sig) return false
        return true

    }else
        return false    
    
};