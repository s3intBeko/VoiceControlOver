const con = require("../Helpers/constants")
const signeture = require("../Helpers/Singature")
class ControllerTemplate {

    async PreAuth(req,res) {
        if(signeture.verifySigneture(req.query)){
            
            
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

}exports.ControllerTemplate = ControllerTemplate;
