import express from "express";
import routes from "../routes";
import {
    getUpload,
    postUpload,
    videoDetail,
    getEditVideo,
    postEditVideo,
    deleteVideo
} from "../controllers/videoController";
import {uploadVideo,onlyPrivate} from "../middlewares";

const videoRouter = express.Router();

//업로도
videoRouter.get(routes.upload, onlyPrivate,getUpload);
videoRouter.post(routes.upload, onlyPrivate,uploadVideo, postUpload); //파일을 업로드하면 미들웨어인 uploadVideo에 의해 서버상의 폴더에 저장된. postUpload는 이 폴더안의 파일의 경로를 DB에 저장함.

//비디오 디테일
videoRouter.get(routes.videoDetail(), videoDetail);

//비디오 수정
videoRouter.get(routes.editVideo(), onlyPrivate,getEditVideo);
videoRouter.post(routes.editVideo(),onlyPrivate,postEditVideo);

//비디오 삭제
videoRouter.get(routes.deleteVideo(), onlyPrivate,deleteVideo);

export default videoRouter;