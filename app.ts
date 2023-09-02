import express, {Express} from 'express'
import db from './db'
import dotenv from 'dotenv'
import hbs from 'hbs'
import routes from './routes/routes'
import auth from './routes/auth'
import path from 'path'
import cookieParser from 'cookie-parser'

// dot env config
dotenv.config({
    path:'./.env'
})

// databse connection
db.connect((err)=>{
    if(err) console.log('Database Error:', err);
    else console.log('Database connect successfully');
})


const location = path.join(__dirname,'./public')


const app: Express = express()
const port = process.env.PORT

// decode the cookie
app.use(cookieParser())

// req and resp url encoded
app.use(express.urlencoded({extended:false})) // you get req.body value is undefined when no there this code.
// set location for static files
app.use(express.static(location))

app.use("/",routes) // pages get
app.use('/auth', auth) // auth details post
app.set('view engine','hbs')

// Register common structure as partial register
const partialPath = path.join(__dirname,'./views/partial')
hbs.registerPartials(partialPath)


// server listening
app.listen(port,()=>{
    console.log(`server started @ ${port}`);
})