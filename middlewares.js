import multer from "multer";
import routes from "./routes";

const multerVideo = multer({dest:"uploads/videos/"});
const multerAvatar = multer({dest:"uploads/avatars/"});

export const localsMiddleware = (req,res,next)=>{
    res.locals.siteName="WeTube";
    res.locals.routes = routes;
    res.locals.loggedUser = req.user||null; //유저가 존재하지 않으면 빈 object를 줌.
    next();
};

//로그인 되어있는 상태에서 /login페이지에 다시 접근하는 것을 막아주는 미들웨어.
export const onlyPublic = (req,res,next)=>{
    if(req.user){
        res.redirect(routes.home);
    }else{
        next();
    }
}

//로그인되어 있는 상태만 이용가능하게 하는 미들웨어.
export const onlyPrivate=(req,res,next)=>{
    if(req.user){
        next();
    }else{
        res.redirect(routes.home);
    }
}

export const uploadVideo = multerVideo.single("videoFile");
export const uploadAvatar = multerAvatar.single("avatar");