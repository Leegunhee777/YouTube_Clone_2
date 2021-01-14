import React, { useEffect,useState } from 'react'
import axios from "axios"
function SideVideo(){

    const [sideVideos, setsideVideos] = useState([]);

    useEffect(() => {
        axios.get('/api/video/getVideos')
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.videos)
                    setsideVideos(response.data.videos)
                } else {
                    alert('Failed to get Videos')
                }
            })
    }, [])

    const renderSideVideo = sideVideos.map((video, index)=>{
        return <div key={index} style={{display:'flex', marginBottom: "1rem", padding: '0 2rem'}}> 
        <div style={{width:'40%', marginRight: "1rem"}}>
            <a href={`/video/${video._id}`}  style={{ color:'gray' }}>
                <video style={{width:'100%' ,height:'100%' }}src={`http://localhost:5000/${video.filePath}`} controls={false}/>
            </a>

        </div>
        <div style={{width: '50%'}}>
            <a href={`/video/${video._id}`}  style={{ color:'gray' }}>
                <span style={{ fontSize: "1rem", color:'black'}}>{video.title}</span>
                <br/>
                <span>{video.writer.name}</span>
                <br/>
                <span>{video.views}</span>
                <br/>
                <span></span>
                
            </a>

        </div>
    </div>
    })
    return(
        <React.Fragment>
            {renderSideVideo}
        </React.Fragment>
        
    )
}

export default SideVideo