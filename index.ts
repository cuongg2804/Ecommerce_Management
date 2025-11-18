import express, {Request, Response} from 'express';
import path from 'path';
import {prefixAdmin, domainCDN} from  "./config/systemConfig";
import adminRouter from "./router/admin/index.router";
import clientRouter from "./router/clients/index.router";
import * as database from "./config/databaseConfig";
import bodyParser from 'body-parser';
import  dotenv  from "dotenv";

const app = express();
const port = 3000;

dotenv.config();

database.connect();

app.use(express.json()); 


app.use(bodyParser.urlencoded())
app.use(bodyParser.json({ type: 'application/*+json' }))
app.set("views", path.join(__dirname, 'views'));

app.set("view engine", 'pug');

app.locals.prefixAdmin = prefixAdmin;
app.locals.domainCDN = domainCDN;

app.use(express.static(path.join(__dirname, 'public')));
app.use(`${prefixAdmin}`, adminRouter);
app.use("/", clientRouter);

app.listen(port, () =>{
    console.log(`Connect successfully to port ` + port);
})