const Db = require('./Query')
const con = require("../Helpers/constants")
const Path = require('path')
const signTokenGuess = require("../Helpers/signJWT").signTokenGuess

const dotenv = require('dotenv');


dotenv.config();
db = new Db.Query()
class ModelDb{
  
  constructor(){
    this.test = ''
  }
  async createUser(req, res){
    //console.log(req.headers)
    const findOneQuery = 'SELECT * FROM users.players WHERE email=$1';
    var rs = await db.query(findOneQuery,[req.body['email']])
    if(rs.rowCount > 0){
      return res.status(con.ResponseCodes.OK).send({
        error :{
        code:2,
        success:false,
        text: 'You Already Registered'
        },
        data :null
      })

    }
    console.log("NEW USER")

    console.log("User Name : " + req.body['user_name'] + " Password : " + req.body['user_pass'])
    let avatar_url = process.env.SERVER_URL + ":" + process.env.SERVER_PORT+ '/Images/avatar1.png'
    if(req.file){
      avatar_url = process.env.SERVER_URL + ":" + process.env.SERVER_PORT+ '/' + req.file.path
    }

    //INSERT INTO users.players (_id, player_id, name, points, avatar_url, game_token, player_token, level, level_xp, status, socket_id, hearth_beat, last_login, game_state, ip_address, online, config, password, email, userprefs) VALUES (DEFAULT, '1', 'First User', 15000, null, null, null, 1, 1, 1, null, null, null, null, null, null, null, '123456', '1@g.com', null)
    const insertQuery = "INSERT INTO users.players (_id, player_id, name, points, avatar_url, game_token, player_token, level, level_xp, status, socket_id, hearth_beat, last_login, game_state, ip_address, online, config, password, email, userprefs,type) VALUES (DEFAULT, $1, $2, $3, $7, null, null, 1, 1, 1, null, null, null, null, null, null, null, $5, $4, null,$6)"
    var shortid = require('shortid');    
    const new_user = [
      shortid.generate(),
      req.body['user_name'],
      15000,
      req.body['email'],
      req.body['user_pass'],
      1,
      avatar_url
    ]
    try{
      let r = await db.query(insertQuery,new_user)
      if(r.rowCount > 0){      
          return res.status(con.ResponseCodes.OK).send({
            error :{
                code:1,
                success:true,
                text: 'Success Create User.'
            },
            data :null
      
          })
      }else{
        return res.status(con.ResponseCodes.OK).send({
          error :{
          code:2,
          success:false,
          text: 'There Is Problem For Insert'
        },
        data :null
      })

      }
    }catch(error){
      return res.status(con.ResponseCodes.BadRequest).send({
          error :{
          code:1,
          success:false,
          text: error
        },
        data :null
      })
    }
  }

  async userLogin(email,password,ipAdress){
    console.log(`Email : ${email} Pwd :${password} IP : ${ipAdress}`)
    const findOneQuery = 'SELECT * FROM users.players WHERE email=$1 and password=$2 ';
    var r = await db.query(findOneQuery,[email,password])
    if(r.rowCount < 1){
      return {
        error:{
          success:false,
          code:2
        },        
        payload:null
      }
    }
    let currentUser = r.rows[0]
    if(currentUser['status'] < 1){
      return {
        error:{
          success:false,
          code:currentUser['status'] 
        },        
        payload:null
      }
    }
    const findServerQuery = 'SELECT * FROM game.servers WHERE online=true and state=$1 and type=$2'
    const values = [
      1,
      1
    ]
    let server = ''
    try {
      let s = await db.query(findServerQuery, values)
      if(s.rowCount > 0){
        server = s.rows[0].ip + ":" + s.rows[0].port
      }else{
        return {
          error:{
            success:false,
            code:4
          },        
          payload:null
        }
      }
    }catch(err){
      console.error("Get Servers Error : " + err)
      return {
        error:{
          success:false,
          code:4
        },        
        payload:null
      }
    }
    let playerToken = signTokenGuess({
      userId : currentUser["player_id"],
      email : currentUser["email"],
      ipAddress : ipAdress
    })
    let updatePlayerData = {
      ip_address:ipAdress,
      player_token:playerToken
    }
    //CAN BE AWAIT OR NOT ???
    await this.userUpdateById(currentUser["player_id"],updatePlayerData)
    return {
      error:{
        success:false,
        code:0
      },   
      payload:{
        userId:currentUser['player_id'],
        signedRequest:playerToken,
        point:server
      }
    }

  }

  async userUpdateById(playerId,updateData){
    const updateQuery = updateUsertByID(playerId,updateData)          
    let vals = []
    Object.values(updateData).forEach(x=>{
      vals.push(x)
    })
    try{
      var r = await db.query(updateQuery,vals)
      return true
    }catch(err){
      console.error("Update Query Error : " + err)
      return false
    }
  }

  async loginUser(req,res){    
    //TODO WILL NOT NEED IT MORE 
    const findOneQuery = 'SELECT * FROM users.players WHERE email=$1 and password=$2';
    console.log("User Name : " + req.body['user_name'] + " Password : " + req.body['user_pass'])
    if(req.body['user_name']){
      try {
        var r = await db.query(findOneQuery,[req.body['user_name'],req.body['user_pass']])
        if(r.rowCount < 1){
          if(req.body['redirect']){
            res.writeHead(301,
              {Location: process.env.SERVER_URL + ":" + process.env.SERVER_PORT + '/user/register'}
            );
            res.end();

          }else{
            return res.status(con.ResponseCodes.OK).send({
              error :{
                  code:2,
                  success:false,
                  text: 'Credentials Wrong '
              },
              data :{
                  user_id: null,
                  redirect: 'register'
              }
            })
          }
        }else{
          //console.log(r)

          const findServerQuery = 'SELECT * FROM game.servers WHERE online=true and state=$1 and type=$2'
          const values = [
            1,
            1
          ]
          let server = ''
          try {
            let s = await db.query(findServerQuery, values)
            if(s.rowCount > 0){
              server = s.rows[0].ip + ":" + s.rows[0].port
            }else{
              return res.status(con.ResponseCodes.OK).send({
                error :{
                    code:4,
                    success:false,
                    text: 'Sorry We cant Find Server For Now'
                },
                data :{
                    user_id: null,
                    redirect: 'login'
                }
              })

            }

          }catch(err){
            console.error("Get Servers Error : " + err)
            return null
          }
          let user = r.rows[0]
          let player ={
            user_id: user['player_id'],
            email: user['email'],
            ip_address: req.connection.remoteAddress
          }
          let user_token = signTokenGuess(player)
          let update_user = {
            ip_address: req.connection.remoteAddress,
            player_token: user_token
          }
          const updateQuery = updateUsertByID(user['player_id'],update_user)          
          let vals = []
          Object.values(update_user).forEach(x=>{
            vals.push(x)
          })
          try{
            var r = await db.query(updateQuery,vals)
          }catch(err){
            console.error("Update Query Error : " + err)
          }
          if(req.body['redirect']){
            
            //http://192.168.0.105/WebBuild/?userId=3&userToken=3333&server=192.168.0.105:9669&api=127.0.0.1:4568
            let url =  process.env.GAME_URL + "?userId=" + user['player_id'] + "&userToken=" + user_token + '&server=' + server + '&api='+ process.env.SERVER_IP +':' + process.env.SERVER_PORT
            
            //
            try{
              res.redirect(url)
              /*res.writeHead(301,
                {Location:url}
              );
              res.end();*/
            }catch(err){
              console.log("Err : " + err)
            }

          }else{
            return res.status(con.ResponseCodes.OK).send({
              error :{
                  code:0,
                  success:true,
                  text: 'success login in'
              },
              data :{
                  user_id: user['player_id'],
                  name: user['name'],
                  points: user['points'],
                  player_token: user_token,
                  server:server,
                  api:process.env.SERVER_URL +':' + process.env.SERVER_PORT,
                  redirect: 'game'
              }
            })

          }
          

        }
      } catch(error) {
        console.log('error' + error)
        return res.status(con.ResponseCodes.OK).send({
          error :{
            code:3,
            success:false,
            text: error
        },
        data :{
            user_id: null,
            redirect: 'register'
        }
        });
      }

    }       
    return res.status(con.ResponseCodes.BadRequest).send({
      error :{
          code:5,
          success:false,
          text: 'We need User Name'
      },
      data :{
          user_id: null
      }
    })
  }
  getServerList(state, type){
    const findServerQuery = 'SELECT * FROM game.servers WHERE online=true and state=$1 and type=$2'
    const values = [
      state,
      type
    ]
    try {
      let r = db.query(findServerQuery, values)
      return r
    }catch(err){
      console.error("Get Servers Error : " + err)
      return null
    }


  }
  async updateUserWithId(user_id, values){
    const updateQuery = updateUsertByID(user_id,values)          
    let vals = []
    Object.values(values).forEach(x=>{
      vals.push(x)
    })
    //console.log(updateQuery + " - " + JSON.stringify(vals))
    try{
      var r = await db.query(updateQuery,vals)
    }catch(err){
      console.error("Update Query Error : " + err)
    }
  }

  async getAll(req, res) {
    const findAllQuery = 'SELECT * FROM users.players';
    try {
      var r = await db.query(findAllQuery)
      console.log(r.rowCount)
      return res.status(200).send({ 'rows': r.rows, 'count': r.rowCount });
    } catch(error) {
      return res.status(400).send(error);
    }
  }

}
exports.ModelDb = ModelDb

updateUsertByID = function (id, cols) {
  var query = ['UPDATE users.players'];
  query.push('SET');
  var set = [];
  Object.keys(cols).forEach(function (key, i) {
    set.push(key + ' = ($' + (i + 1) + ')'); 
  });
  query.push(set.join(', '));
  query.push("WHERE player_id = '" + id +"'" );
  return query.join(' ');
}