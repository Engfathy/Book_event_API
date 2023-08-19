import express from "express";
import cors from "cors";
import dotEnv from "dotenv";
import Db from "./database/db.class";
import userRouter from "./router/userRouter";
import eventsRouter from "./router/eventsRouter";


const app: express.Application = express();

// app.use(express.static("public"));  => to deal with static element
app.use(cors());
app.use(express.json());
app.use("/user", userRouter);
app.use("/events", eventsRouter);


// config env
dotEnv.config({ path: "./config.env" });
const hostName:string | undefined = process.env.HOST_NAME;
const port: number= Number(process.env.PORT);

// For example, if you have different .env files for different 
// environments (like development, testing, production), 
// you can determine the appropriate file to load based on your current environment:
// if (process.env.NODE_ENV === 'production') {
//   require('dotenv').config({ path: '.env.production' });
// } else if (process.env.NODE_ENV === 'development') {
//   require('dotenv').config({ path: '.env.development' });
// } else {
//   require('dotenv').config(); // Load default .env file
// }

//-------------------------------------------------------


// connect db and its confiqure

Db.ConnectDb();

app.get("/", (req: express.Request, res: express.Response) => {
    res.send("<h1>Welcom to event-booking</h1>").status(200);
});

if(hostName && port){
    app.listen(port, hostName, () => {
        console.log(`server is running at http://${hostName}:${port}`);
    });
}
