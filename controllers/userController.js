import passport from "passport";
import routes from "../routes"
import User from "../models/User";

export const getJoin = (req, res) => {
    res.render("join",{pageTitle: "Join"});
};

export const postJoin = async (req,res,next) => {
    const {
        body:{name,email,password,password2}
    }=req;
    if(password !== password2){
        res.status(400);    //비밀번호, 비밀번호 재입력 값이 다르면 400 상태코드를 반환함.
        res.render("join",{pageTitle:"Join"});
    }else{
        try{
            const user = await User({
                name,
                email
            });
            await User.register(user, password);
            next(); //미들웨어는 next()를 호출하는것으로 res로 컨트롤을 넘긴다
        }catch(error){
            console.log(error);
            res.redirect(routes.home);  //TO DO: Register User, Log user in
        }
    }

};

export const getLogin = (req, res) =>
    res.render("login",{pageTitle: "Log In"});

export const postLogin = passport.authenticate('local',{
    failureRedirect: routes.login,
    successRedirect:routes.home
});
//깃허브 로그인을 시도했을때 github로 보내는데 사용됨.
export const githubLogin = passport.authenticate("github");
//깃허브 로그인을 해서 사용자 정보를 받아왔을때 실행됨. 
export const githubLoginCallback = async (accessToken,refreshToken,profile,cb)=>{
    //깃허브 인증을 승인하면 깃허브에서 내 페이지로 승인을 기다리는 상태가 된다.
    const{_json:{id,avatar_url: avatarUrl,name,email}}=profile;
    try{
        const user = await User.findOne({email}); //email로 한 개의 document를 탐색하는 MongoDB 쿼리
        if(user){ //유저를 찾았으면 유저정보를 update
            user.githubId = id;
            user.save();
            return cb(null, user); //콜백함수 호출. 쿠키에 저장.
        }else{ //유저를 찾지 못했으면 새로 등록함
            const newUser = await User.create({
                email,
                name,
                githubId: id,
                avatarUrl
            });
            return cb(null,newUser);
        }
    }catch(error){
        return cb(error);
    }
};

export const postGithubLogIn = (req,res) =>{
    res.redirect(routes.home); //깃허브로 로그인한후 홈으로 리다이렉트 시킴.
};

export const facebookLogin = passport.authenticate("facebook");

export const facebookLoginCallback = async (accessToken, refreshToken, profile, cb)=>{
    const { _json:{id,name,email}}=profile;
    try{
        const user = await User.findOne({email});
        if(user){
            user.id=id; //영상에서는 facebookId를 사용.
            user.avatarUrl=`https://graph.facebook.com/${id}/picture?type=large`;
            user.save();
            return cb(null,user);
        }else{
            const newUser = await User.create({
                email,
                name,
                id,//영상에서는 facebookId를 사용.
                avatarUrl: `https://graph.facebook.com/${id}/picture?type=large`
            });
            return cb(null,newUser);
        }
    }catch(error){
        return cb(error);
    }
    console.log(accessToken, refreshToken, profile, cb);
}

export const postFacebookLogin = (req,res,next)=>{
    res.redirect(routes.home);
}

export const logout = (req, res) =>{
    req.logout(); //passport를 사용한 로그아웃.
    res.redirect(routes.home);
};

export const getMe = (req,res,next)=>{
    //userDetail과 하는 일을 같지만 userDetail에서는 user를 DB에서 찾아야 함.
    res.render("userDetail", {pageTitle:"User Detail", user: req.user});
};

export const getEditProfile = (req, res) => 
    res.render("editProfile",{pageTitle: "Edit Profile"});

export const postEditProfile = async (req,res)=>{
    const{
        body: {name,email},
        file
    }=req;
    try{
        
        await User.findByIdAndUpdate(req.user.id,
        {
            name,
            email,
            avatarUrl: file ? file.path:req.user.avatarUrl //file이 존재하면 file.path를 저장. 없으면 그대로 저장

        });
        res.redirect(routes.me);
        console.log(req.params.id);
    }catch(error){
        res.render("editProfile",{pageTitle:"Edit Profile"});
    }
};
   

export const userDetail = async (req, res) =>{
    const {params:{id}}=req;
    try{
        const user = await User.findById(id);
        res.render("userDetail",{pageTitle: "User Detail", user});
    }catch(error){ //랜덤 id 패러미터를 입력하거나 해서 에러가 발생하면 홈으로 리다이렉트 시킴.
        res.redirect(routes.editProfile);
    }
};
export const getChangePassword = (req, res) =>
  res.render("changePassword", { pageTitle: "Change Password" });

export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword, newPassword1 }
  } = req;
  try {
    if (newPassword !== newPassword1) {

        res.status(400);
        res.redirect(`/users/${routes.changePassword}`);
        return;
    }else{
        await req.user.changePassword(oldPassword, newPassword);
        res.redirect(routes.me);
        
    }
  } catch (error) {
    console.log(error);
    res.status(400);
    res.redirect(`/users/${routes.changePassword}`);
  }
};
