import {Pool} from 'pg'
import dotenv from 'dotenv'

dotenv.config({
    path:'./.env'
})

const db = new Pool({
    user:process.env.DBUSER,
    host:'localhost',
    database:process.env.DBNAME,
    password:process.env.DBPASS,
    port:5432
})
console.log("env:",process.env.DBUSER);

export default db;
