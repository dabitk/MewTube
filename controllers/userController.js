import routes from "../routes"

export const getJoin = (req, res) => {
    res.render("join",{pageTitle: "Join"});
};

export const postJoin = (req,res) => {
    const {
        body:{name,email,password,password2}
    }=req;
    if(password !== password2){
        res.status(400);    //비밀번호, 비밀번호 재입력 값이 다르면 400 상태코드를 반환함.
    }else{
        res.redirect(routes.home);  //TO DO: Register User, Log user in
    }
    res.render("join",{pageTitle: "Join"});
};

export const getLogin = (req, res) =>
    res.render("login",{pageTitle: "Log In"});
export const postLogin = (req,res) => {
    res.redirect("routes.home");
};


export const logout = (req, res) =>{
    //To Do: Process Log OUt
    res.redirect(routes.home);
}
export const editProfile = (req, res) => res.render("editProfile",{pageTitle: "Edit Profile"});
export const userDetail = (req, res) => res.render("userDetail",{pageTitle: "User Detail"});
export const changePassword = (req,res) => res.render("changePassword",{pageTitle: "Change Password"});