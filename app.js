import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import passport from "passport";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import {localsMiddleware} from "./middlewares";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";
import routes from "./routes";
import "./passport"; //passport 설정 파일을 가져옴.

const app = express();

const CookieStore = MongoStore(session);

app.use(helmet());
app.set('view engine','pug');
app.use("/uploads",express.static("uploads"));
app.use("/static",express.static("static"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(morgan("dev"));
app.use(
    session({
        secret:process.env.COOKIE_SECRET,
        resave:true,
        saveUninitialized:false,
        store:new CookieStore({mongooseConnection: mongoose.connection}) //이 저장소를 mongo와 연결시켜야 한다.
    })
);
app.use(passport.initialize()); //passport가 초기화 됨.
app.use(passport.session()); //passport가 쿠키를 들여다보고 정보에 해당하는 사용자를 검색함.

app.use(localsMiddleware);

app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);

export default app;