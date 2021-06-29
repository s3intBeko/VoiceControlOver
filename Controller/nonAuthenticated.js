const con = require("../Helpers/constants")
const signeture = require("../Helpers/Singature")
const Database = require("../Database/modelDb")
class NonAuthenticated {

    async PreAuth(req,res) {
        if(signeture.verifySigneture(req.query)){
            return res.status(con.ResponseCodes.OK).send({
                error :{
                    code:0,
                    text: 'success'
                },
                payload :{
                    action:"PreAuth",
                    facebookPermissions: ["email","user_friends"],
                    register:{
                        reCaptcha:false,
                        enable:true,
                        facebook:false,
                        email:true,
                        guest:false
                    },
                    login:{
                        remember:true,
                        reCaptcha:false,
                        maxTry:3,
                        facebook:false,
                        email:true,
                        guest:false
                    },
                    config:{
                        allowLanguageChange:true,
                        allowProxy:true,
                        traceIp:true
                    },
                    mapping:{
                        register:"user/register",
                        login:"NonAuthenticated/Login",
                        auth:"user/auth",
                        profile:"user/info",
                        tableList:"Game/TableList",
                        smartLobby:"Game/SmartLobby"
    
                    }
                    
                }
            })
        }else{
            return res.status(con.ResponseCodes.OK).send({
                error :{
                    code:1,
                    text: 'Invalid Request'
                },
                payload : null
            })
        }
        
    }
    async Login(req,res) {
        let database = new Database.ModelDb()
        if(signeture.verifySigneture(req.query)){
            console.log(`User Email : ${req.body['email']} Password ${req.body["pwd"]}`)
            if(req.body.hasOwnProperty("email") && req.body.hasOwnProperty("pwd")){
                    let email = encodeURIComponent(req.body['email']).replace('%40','@')
                    let pwd = encodeURIComponent(req.body['pwd'])
                    let result = await database.userLogin(email,pwd,req.connection.remoteAddress)
                    console.log(result)
                    return res.status(con.ResponseCodes.OK).send(result)
                    /*if(result.success){
                        return res.status(con.ResponseCodes.OK).send({
                            error :{
                                code:0,
                                success:true
                            },
                            payload :result.payload
                        })
                    }else{
                        return res.status(con.ResponseCodes.OK).send(result)
                    }*/   
            }else{
                return res.status(con.ResponseCodes.OK).send({
                    error :{
                        code:5,
                        text: 'Need Requirement'
                    },
                    payload : null
                })
            }
            
        }else{
            return res.status(con.ResponseCodes.OK).send({
                error :{
                    code:1,
                    text: 'Invalid Request'
                },
                payload : null
            })
        }
    }

}exports.NonAuthenticated = NonAuthenticated;
