const signJwt = require("../Helpers/signJWT")
const con = require("../Helpers/constants")

class UserController {
    async authenticate(_req, res){
        /*
            console.log(data['user_id']) 
            { 
                user_id: '123',
                token: 'a1123',
                type: 'guest',
                device_info:
                { 
                    osType: 'Android',
                    osVerison: '25.32',
                    systemMemory: '256',
                    locale: 'TR',
                    timezone: 'GMT+3',
                    device_id: '1e3w-2wqDcedceE',
                    carrier: 'Vodofone',
                    deviceModel: 'Samsung',
                    mac: 'A2:D3:E4:A1:B3',
                    imeiAddress: '2ie2-deccs-2dedf-acec' 
                } 
            }

        */
       //TODO DB Stuff Check Realty
        const data = _req.body
        //console.log(data['device_info']['osType']) 
        console.log("[Usercontroller ] Auth Fired " + data['user_id'])
        if(data['type']){
            if(data['type'] == '1' || data['type']=='guest'){
                let verify_token = signJwt.verifyJWT(data['token'])
                if(verify_token['user_id'] == data['user_id']){
                    //TODO VERIFY TOKEN DATE ? BELONGS FOR IP ? AND ADD DEVICE INFO..
                    let sign = {
                        user_id:data['user_id'],
                        email:verify_token['email'],
                        ip_address: _req.connection.remoteAddress
                    }
                    let database = require('../Database/modelDb')
                    let db = new database.ModelDb()
                    let token = signJwt.signJWT(sign)
                    let server_req = await db.getServerList(1,1)    
                    if(server_req.rowCount > 0){
                        let server = server_req.rows[0].ip + ":" + server_req.rows[0].port
                        let user_prefs = {
                            directed_server: server,
                            token_ip:_req.connection.remoteAddress
                        }
                        let updateVals = {
                            game_token:token,
                            ip_address:_req.connection.remoteAddress,
                            userprefs:JSON.stringify(user_prefs)
                        }
                        
                        db.updateUserWithId(data['user_id'], updateVals)
                        
                        return res.status(con.ResponseCodes.OK).send({
                            error :{
                                code:0,
                                text: 'success'
                            },
                            data :{
                                token: token,
                                server:server
                            }
                
                        })
                    }else{
                        return res.status(con.ResponseCodes.OK).send({
                            error :{
                                code:3,
                                text: 'We Cant Find Online Server'
                            },
                            data :null
                
                        })
                    }
                }else{
                    return res.status(con.ResponseCodes.OK).send({
                        error :{
                            code:1,
                            text: 'Invalid Token'
                        },
                        data :null            
                    })
                }               

            }else{
                return res.status(con.ResponseCodes.OK).send({
                    error :{
                        code:2,
                        text: 'Unexpected User Type'
                    },
                    data :null        
                })                
            }
        }

    }
    
};
exports.UserController = UserController;