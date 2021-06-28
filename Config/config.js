const dotenv = require('dotenv')
dotenv.config()
let path
path = `${__dirname}/.env.dev`;

dotenv.config({ path });