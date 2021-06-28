const Express = require('express');
const BodyParser = require('body-parser')
const Path = require('path')
const cors = require('cors')
const Route = require('../Routes/Route')
const MethodOverride = require('method-override')
require('../Config/config')

class Server{

    constructor(){
        this.app = Express()
        this.routesAll = new Route.Routes()
        this.config()
        this.routesAll.routes(this.app)
    }
    config(){
        /*
        header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");
*/      
        this.app.use(cors());
        this.app.options('*', cors());
        this.app.use((_req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', '"Origin, X-Requested-With, Accept, Content-Type, Content-Length');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            next();
        });
        //this.app.use('/Images',Express.static(Path.join(__dirname,'../Images')))
        this.app.use('/Images',Express.static(Path.join(__dirname,'../Images')))
        this.app.use(BodyParser.urlencoded({ extended: true }));
        this.app.use(BodyParser.json({ limit: '50mb' }));
        this.app.set("view engine","jade")
        this.app.use(BodyParser.json({ type: 'application/json' }));
        this.app.use(MethodOverride('X-HTTP-Method-Override'));
        
        this.app.use((err, _req, res, next) => {
            res.status(err.status || 500).json({
                message: err.message,
                succeed: false
            });
            next(err);
        });
    }
    async start() {
        /*const { Client } = require('pg')
        const client = new Client()
        
        await client.connect()
        const res = await client.query('SELECT $1::text as message', ['Hello world!'])
        console.log(res.rows[0].message) // Hello world!
        await client.end()*/

    
        return new Promise(resolve => {
            this.app.listen(process.env.SERVER_PORT, () => {
                //Init_1.Log.writer.info(`[EXPRESS] ${process.env.SERVER_PORT}`);
                console.log(`[EXPRESS] ${process.env.SERVER_PORT}`)
                resolve();
            });
        });
    }


}
exports.Server = Server