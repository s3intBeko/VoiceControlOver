const con = require("../Helpers/constants")
const signeture = require("../Helpers/Singature")
class LoginController {

    async PreAuth(req,res) {
        if(signeture.verifySigneture(req.query)){
            console.log(`User Name : ${req.body['email']} Password ${req.body["pwd"]}`)
            if(req.body.hasOwnProperty("email") && req.body.hasOwnProperty("pwd")){
                
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

}exports.LoginController = LoginController;
