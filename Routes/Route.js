const ControllerUser = require('../Controller/userController')
const ControllerNonAuthenticated = require('../Controller/nonAuthenticated')
const Database = require('../Database/modelDb')
const Express = require('express')
const Path = require('path')


const multer = require('multer')
const storage = multer.diskStorage({
    destination:function(req,file,cb){
      cb(null,'./Images')
    },
    filename:function(req,file,cb){
        const crypto = require('crypto');
        let customFileName = crypto.randomBytes(18).toString('hex')
        cb(null,customFileName + Path.extname(file.originalname))
    }
  
  })
  //const upload = multer({dest:'Images/'})
  const upload = multer({storage:storage})

class Routes {

	
	constructor() {
        this.apiv1 = '/api/v1';
        this.userController = new ControllerUser.UserController()
        this.nonAuthenticated = new ControllerNonAuthenticated.NonAuthenticated();
        this.database = new Database.ModelDb()
	}

	async routes(app){
        var test_router = Express.Router() 
        //app.use('/Images/' , test_router)
		/*app.get('/Images,', async (_req, res) => { 
			
            res.status(200).send({
				message: 'Poker Server Restful Service Working',
				succeed: true
			})
        })*/
        app.get('/user/login', function (req, res) {
            res.render('loginForm')
         })
        app.post('/user/login', this.database.loginUser)

        app.get('/user/register', function (req, res) {
            res.render('registerForm')
         })
        app.post('/user/register',upload.single('file'), this.database.createUser)

        app.get('/test', function(req,res){
            res.render('sample')
        })
        app.post('/user/update', function(req,res){
            if(req.body['user_id']){
                if(req.body['action'] == 'username'){
                    //TODO UPDATE USERNAME
                    res.stats(200).send({
                        succeed:true,
                        code:0,
                        message:'UserName Updated'
                    })

                }else if(req.body['action']== 'picture'){
                    //TODO UPDATE USERNAME
                    res.stats(200).send({
                        succeed:true,
                        code:0,
                        message:'Avatar Updated'
                    })

                }else{
                    res.stats(200).send({
                        succeed:false,
                        code:3,
                        message:'Undefined action',
                    })
                }
            }else{
                res.stats(200).send({
                    succeed:false,
                    code:2,
                    message:'Require User Id',
                })
            }
        })
        app.post('user/info', function(req,res){
            if(req.body['user_id']){
                //TODO MAKE SOME TOKEN HERE                
                res.status(200).send({
                    succeed:true,
                    action:'UserProfile_GetDynamic',
                    code:0,
                    request_data:{
                        sn:1,
                        uid:req.body['user_id']
                    },
                    response_data:{
                        user_profile:{
                            name:'User Name',
                            avatar_url_large:'',
                            level:1,
                            exp:1,
                            buddies:[],
                            register:'dateOf'    
                        },
                        stats:{
                            biggest_pot:10000,
                            best_hand:'Flush',
                            likes:0,
                        },
                        points:{
                            total:1
                        },
                        room:{
                            has_own:false,
                            id:1,
                            server:1
                        }
                        

                    },
                    
                })
            }else{
                res.stats(200).send({
                    succeed:false,
                    code:2,
                    message:'Require User Id',
                })
            }
        })

		/*app.all('/', (_req, res) =>
			res.status(200).send({
				message: 'Enevo Poker Server Restful Service Working',
				succeed: true
            }));*/
            /*/*var response = {message : 'OK'}
            res.send(response)*/
        app.get('/', async (_req, res) =>
			res.status(200).send({
				message: 'Poker Server Restful Service Working',
				succeed: true
			}))
        app.post("/NonAuthenticated/Login", this.nonAuthenticated.Login)
        app.post("/NonAuthenticated/PreAuth", this.nonAuthenticated.PreAuth)
		// USER ROUTES	
		app.post(`${this.apiv1}/auth`, this.userController.authenticate)

	}
}
exports.Routes = Routes;