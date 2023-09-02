import { Request, Response, NextFunction } from 'express';
import db from '../db'
import bcrypt from 'bcryptjs'
import JWT, {Secret, VerifyErrors} from 'jsonwebtoken'
import { promisify } from 'util';


// set jwt secret code
const jwt_secret:Secret = process.env.JWT_SECRET || ''
const jwt_cookies_expire:any = process.env.JWT_COOKIES_EXPIRE

// declar cookies key variable
var cookiesKey:string = ''

// set promise
const verifyAsync = promisify(JWT.verify) as (
    token: string,
    SecretKey: Secret
  ) => Promise<JWT.JwtPayload>;

// Login
export const login = async (req:Request, res:Response) =>{
    try {
        const {email, password} = req.body
        db.query(`select * from users where email = '${email}'`, async (err, result) =>{
            if(err) return console.log("err:",err);
            else if (result.rowCount <=0) 
            {
               return res.render('login',{email_msg:'Email Id does not exist', msg_type:'error'})
            }
            else if( !await bcrypt.compare(password,result.rows[0].password))
            {
                return res.render('login',{passwd_msg:'Password does not match with Email Id ', msg_type:'error'})
            }
            else{
                const id = result.rows[0].id

                // Auth Token create
                const token =JWT.sign({id:id}, jwt_secret, {expiresIn:process.env.JWT_EXPIRES_IN});
                // Cookies create
                const cookieOptions ={
                    expires:new Date( Date.now()+jwt_cookies_expire*24*60*60*100),
                    httpOnly: true
                }
                // set cookiesKey value
                cookiesKey = result.rows[0].name

                res.cookie(cookiesKey,token,cookieOptions);
                res.status(200).redirect('/home');
            }
        })
    }
    catch(error:any) {
        console.log(error);
    };

}

// Register
export const register = (req:Request,res:Response) =>{
    const {name, email, phone_number, password, confirm_password} = req.body
    db.query(`select email from users where email = '${email}'`,async (err,result) =>{
        if(err) console.log('err:',err);
        else if (result.rowCount > 0) 
        {
            return res.render('register',{email_msg: 'email id already exist'})
        }
        else if (password !== confirm_password) 
        {
            return res.render('register',{passwd_msg: 'Password do not match'})
        }
        else{
            const hashedPassword = await bcrypt.hash(password,8)

            const insertQuery = `
                INSERT INTO users (name, email, phone_number, password)
                VALUES ($1, $2, $3, $4)
            `;
      
            const values = [name, email, phone_number, hashedPassword];
      
            await db.query(insertQuery, values,(err,result) =>{
                if(err) console.log("err",err);
                else if(result) 
                {
                    res.status(200).redirect('/login')
                }
            })
        }
    })
};

// logout
export const logout = async (req:Request, res:Response) =>{
    console.log('logout');
    res.cookie(cookiesKey,'logout',{
        expires: new Date(Date.now()*2*1000),
        httpOnly: true
    });
    res.redirect('/login')
    // alert('Successfully Logout...')
}


// middleware
export const isLogedIn = async (req:Request, res:Response, next:NextFunction) => {
    if(req.cookies)
    {
        try {
            const token = req.cookies[cookiesKey]; // Assuming cookiesKey is defined
            const decode = await verifyAsync(token,jwt_secret);

            db.query(`select * from users where id = ${decode.id}`, async (err,result) =>{
                if(result.rowCount<=0) return next();
                if(err) console.log(err)
                req.body.user = result.rows[0]
                return next()
            })
        } catch (error) {
            next()
        }
    }
    else{
        next()
    }
}


