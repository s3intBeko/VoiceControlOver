const con = require("../Helpers/constants")
const signeture = require("../Helpers/Singature")
const Database = require("../Database/modelDb")
const signJwt  = require("../Helpers/signJWT")
class Authenticated {
    async Auth(req,res) {
        if(signeture.verifySigneture(req.query)){
            console.log("[Authenticated] Auth Fired " + req.body['userId'])
            let userId = encodeURIComponent(req.body['userId'])
            let signedRequest = encodeURIComponent(req.body['signedRequest'])
            let verifyToken = signJwt.verifyJWT(signedRequest)
            let db = new Database.ModelDb()
            if(verifyToken['userId'] == userId){
                let sign = {
                    userId:userId,
                    email:verifyToken['email'],
                    ipAddress:req.connection.remoteAddress
                }
                let gameToken = signJwt.signJWT(sign)
                let serverPoint = await db.getServerList(1,1)
                if(serverPoint.rowCount>0){
                    let server = serverPoint.rows[0].ip + ":" + serverPoint.rows[0].port
                    let userPrefs = {
                        serverPoint:server,
                        tokenIp:req.connection.remoteAddress
                    }
                    let updateValues = {
                        game_token: gameToken,
                        ip_address:req.connection.remoteAddress,
                        userprefs:JSON.stringify(userPrefs)                        
                    }
                    db.updateUserWithId(userId, updateValues)                    
                    return res.status(con.ResponseCodes.OK).send({
                        error:{
                            code:0,
                            text:"success"
                        },
                        payload:{
                            token:gameToken,
                            server:server
                        }
                    })
                }else{
                    return res.status(con.ResponseCodes.OK).send({
                        error:{
                            code:3,
                            text:"Cant Find Online Server"
                        },
                        payload:null
                    })
                }
            }else{
                return res.status(con.ResponseCodes.OK).send({
                    error:{
                        code:1,
                        text:"Invalid Token"
                    },
                    payload:null
                })
            }
        }
        else{
            return res.status(con.ResponseCodes.OK).send({
                error:{
                    code:2,
                    text:"Invalid Signature"
                },
                payload:null
            })
        }
    }

}exports.Authenticated = Authenticated;
