import VideoInfo from "../../classes/abstract/VideoInfo";
import "../styles/VideoData";

const VideoData = ({title, author_name, duration, thumbnail_url}: VideoInfo) => {
    return (
        <div id="video-data">
            {thumbnail_url && 
                <img src={thumbnail_url} alt="video thumbnail" id="thumbnail"/>
            }
            <h2 id="video-name">{title}</h2>
            <p id="author-name">{author_name}</p>
            <p id="duration">{Math.floor(duration / 60)}:{(duration % 60 < 9 ? "0" : "") + duration % 60}</p>
        </div>
    );
}
 
export default VideoData;