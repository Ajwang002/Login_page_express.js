import { Router,Request,Response } from "express";
import { isLogedIn } from "../controller/user";

const routes = Router()

// Home Page
routes.get(['/','/login'],isLogedIn,(req:Request,res:Response)=>{
    if(req.body.user)
    {
        console.log("home1");
        res.redirect('/home')
    }
    else{
        console.log("login");
        res.render('login')
    }
})
routes.get('/profile',isLogedIn,(req:Request,res:Response)=>{
    if(req.body.user)
    {
        res.render('profile',{ user:req.body.user})
    }
    else{
        res.redirect('/login')
    }
})
routes.get('/home', isLogedIn,(req:Request,res:Response)=>{
    console.log("home2");
    if(req.body.user)
    {
        res.render('home',{ user:req.body.user})
    }
    else{
        res.redirect('/login')
    }
})
routes.get('/register',(req:Request,res:Response)=>{
    res.render('./../views/register.hbs')
})




export default routes;