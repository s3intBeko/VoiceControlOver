const srv = require('./Init/server')

class App {
    static async initalize(){
        console.log("Api Starting")
        const server = new srv.Server()
        await server.start()
    }
}
exports.App = App

App.initalize()
.then(() => console.log('Api Server Started'))
.catch(err => console.log(err))