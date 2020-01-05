import express from "express";
import routes from "../routes";
import passport from "passport";
import {home,search} from "../controllers/videoController";
import {getJoin,postJoin,getLogin,postLogin,githubLogin,postGithubLogIn,logout,getMe, facebookLogin, postFacebookLogin} from "../controllers/userController";
import {onlyPublic,onlyPrivate} from "../middlewares";
const globalRouter = express.Router();

globalRouter.get(routes.join,onlyPublic,getJoin);
globalRouter.post(routes.join,onlyPublic,postJoin,postLogin);
//postJoin에서 입력된 아이디 비밀번호는 next()호출로 postLogin으로 값을 넘겨줌.

globalRouter.get(routes.login,onlyPublic,getLogin);
globalRouter.post(routes.login,onlyPublic,postLogin);


globalRouter.get(routes.home,home);
globalRouter.get(routes.search,search);
globalRouter.get(routes.logout,onlyPrivate,logout);

globalRouter.get(routes.gitHub,githubLogin); // "/auth/github"로 들어가면 githubLogin을 써서 인증함.

globalRouter.get(
    routes.githubCallback,
    passport.authenticate("github",{failureRedirect:"/login"}), //인증에 실패하면 /login 페이지로 리다이렉트 된다.
    postGithubLogIn
);

globalRouter.get(routes.me,getMe);

globalRouter.get(routes.facebook, facebookLogin);
globalRouter.get(
    routes.facebookCallback,
    passport.authenticate("facebook",{failureRedirect:"/login"}),
    postFacebookLogin
);
export default globalRouter;