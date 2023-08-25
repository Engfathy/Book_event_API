import express from "express";
import cors from "cors";
import dotEnv from "dotenv";
import Db from "./database/db.class";
import userRouter from "./router/userRouter";
import eventsRouter from "./router/eventsRouter";


const app: express.Application = express();


app.use(cors());
app.use(express.json());
app.use("/user", userRouter);
app.use("/events", eventsRouter);


// config env
dotEnv.config({ path: "./config.env" });
const hostName:string | undefined = process.env.HOST_NAME;
const port: number= Number(process.env.PORT);



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
