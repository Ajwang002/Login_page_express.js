import { Router } from "express";
import {register, login, logout} from './../controller/user'

const routes = Router()

routes.post('/register',register)
routes.post('/login',login)
routes.get('/logout',logout)

export default routes;