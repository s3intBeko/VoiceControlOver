const jsonwebtoken = require('jsonwebtoken')
const Constants = require("./constants")
require("../Config/config")

exports.signJWT = (payload)=> {
    
    const secret = process.env.SECRET;
    const token = jsonwebtoken.sign(payload, secret, { expiresIn: Constants.ConvertMS.ONEHOUR });
    return token
};

exports.signTokenGuess = (payload)=> {
    return jsonwebtoken.sign(payload, process.env.SECRET, {expiresIn: Constants.ConvertMS.TWOHOUR})
}

exports.verifyJWT = (token) => {
    const secret = process.env.SECRET;
    try {
        const decoded = jsonwebtoken.verify(token, secret);
        return decoded;
    }
    catch (err) {
        //Log.writer.error(`[ JWT VERIFY ] ${err}`);
        console.log(`Error : ${ err }`)
        return undefined;
    }
}