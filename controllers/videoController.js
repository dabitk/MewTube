//import {videos} from "../db"
import routes from "../routes"
import Video from "../models/Video"

export const home = async (req,res)=>{
    try{
        const videos = await Video.find({}).sort({_id: -1}); //-1은 위 아래 순서를 뒤바꾸겠다는 뜻.
        res.render("home",{pageTitle:"Home", videos});
    }catch(error){
        console.log(error);
        res.render("home", {pageTitle:"Home",videos:[]});
    }
}
export const search = async (req,res)=>{
    const {
        query:{term: searchingBy}
    } = req;
    //const searchingBy = req.query.term; 과 같다.
    let videos = [];
    try{
        videos = await Video.find({title:{$regex: searchingBy, $options: "i"}});    //option : i 는 대소문자를 구분하지 않겠다는 뜻임. regex는 해당 문자열이 포함되어있는지 체크해줌.
    }catch(error){
        console.log(error);
    }
    res.render("search",{pageTitle:"Search", searchingBy,videos});  //검색으로 해당하는 영상을 찾지 못한 경우는 videos는 빈 배열 상태를 갖는다.
}
export const getUpload = (req,res)=>
    res.render("upload",{pageTitle:"Upload"});

export const postUpload = async (req,res)=> {
    const{
        body:{title,description},
        file:{path}
    } = req;
    const newVideo = await Video.create({
        fileUrl: path,
        title,
        description
    });
    console.log(newVideo);
    //TO DO: upload and save video
    res.redirect(routes.videoDetail(newVideo.id));
};


export const videoDetail = async (req,res)=>{
    const {
        params: {id}
    } = req;
    try{
        const video = await Video.findById(id);
        res.render("videoDetail",{pageTitle: video.title, video});
    }catch(error){
        console.log(error);
        res.redirect(routes.home);
    }
};
export const getEditVideo = async (req,res)=>{
    const{
        params:{id}
    } = req;
    try{
        const video = await Video.findById(id);
        res.render("editVideo",{pageTitle: `Edit ${video.title}`, video});
    }catch(error){
        res.redirect(routes.home);
    }
}


export const postEditVideo = async (req,res) => {
    const {
        params:{id},
        body:{title, description}
    } = req;
    try{
        await Video.findOneAndUpdate({_id:id},{title,description}); //동일한 id를 가진 document를 찾아서 update 수행
        res.redirect(routes.videoDetail(id));
    }catch(error){
        res.redirect(routes.home); //에러가 발생하면 홈으로 리다이렉트 함.
    }
};
export const deleteVideo = async (req,res)=> {
    const {
        params:{id}
    }=req;
    try{
        await Video.findOneAndRemove({_id:id}); //동일한 id를 가진 document를 찾아서 delete 수행
    }catch(error){
        console.log(error);
    }
    res.redirect(routes.home);
};