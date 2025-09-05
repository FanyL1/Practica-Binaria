
import express from "express";
import "dotenv/config";
import { join } from "path"; 
import morgan from "morgan";
import bodyParser from "body-parser";
import IndexRouter from "./routes/index.router.js";
import ViewRouter from "./routes/views.router.js";
import ApiRouter from "./routes/api.router.js"
import cookieParser from "cookie-parser";

const App = express();

App.use(express.static(join('public')));

//Establece el puerto. SET = establece
App.set('port', process.env.PORT || 2524);
//Utiliza el motor EJS
App.set('view engine', 'ejs');
 //Usa la libreria Morgan para obtener las peticiones que se le hacen al servidor
App.use(morgan('dev'))
//Usa la libreria BodyParse y express para reconocer los datos enviados en formato JSON
App.use(express.json());
App.use(express.urlencoded({extended: true}));
App.use(bodyParser.json());
App.use(cookieParser());//Usa la libreria CookieParser para reconocer las cookies y obtener las

//Utiliza las direcciones que se establecen en index.router
App.use('/',IndexRouter);
App.use('/', ViewRouter);
App.use('/api',ApiRouter);

// Escucha el puerto creado. LISTEN = Escucha
App.listen(App.get('port'),()=>{
    console.log('Si sirvo', App.get('port'), "http://localhost:2525");
});