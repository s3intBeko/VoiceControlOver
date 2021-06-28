const con = require("../Helpers/constants")
const signeture = require("../Helpers/Singature")
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
                        login:"user/login",
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

}exports.NonAuthenticated = NonAuthenticated;
