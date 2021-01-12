import React, { useEffect, useState } from 'react'
import {Row, Col, List, Avatar} from 'antd'//반응형으로 반들떄 유용, Row와 Col이거 두개로 일단 전체틀을잡는다!!!.
import axios from 'axios';
import SideVideo from './Sections/SideVideo';


function VideoDetailPage(props){

    const videoId = props.match.params.videoId;
    const variable = {videoId:videoId}
    
    const [VideoDetail, setVideoDetail] = useState([]);

    useEffect(()=> {
         axios.post('/api/video/getVideoDetail',variable)
        .then(response =>{
            if(response.data.success){
                console.log(response.data);
                setVideoDetail(response.data.videoDetail);
            }else{
                alert('비디어 정보를 가져오지 못했습니다.')
            }
        })
    },[])

    if(VideoDetail.writer){ //값이 들어가기도 전에 렌더되는경우가 있어 undefined에러뜰때있음, 조건문을 걸어 처리해줘야하는 경우 간혹있음 
        return(
            <Row gutter= {[16, 16]}>{/*gutter은 내부의 Col사이의 여백을지정하는것임 */}
                <Col lg={18} xs={24}> {/*가로 전체가 24임 그중 18비중을 차지하게 설정 */}
                    <div style= {{width: '100%', padding: '3rem 4rem'}}>
                        <video style={{ width: '100%'}} src={`http://localhost:5000/${VideoDetail.filePath}`} controls={true}/>
    
                       
                        <List.Item
                            actions
                        >
                            <List.Item.Meta
                                avatar ={<Avatar src={VideoDetail.writer.image} />} 
                                title =  {VideoDetail.title}
                                description =  {VideoDetail.description}
                            />
                        </List.Item>
                    </div>
    
    
    
    
                </Col>
                <Col lg={6} xs={24}>{/*가로 전체가 24임 그중 6비중을 차지하게 설정 */}
                    <SideVideo/>
                </Col>
    
          </Row>
        )
    }else{
       return( <div>...loading</div>)
    }
    
}

export default VideoDetailPage