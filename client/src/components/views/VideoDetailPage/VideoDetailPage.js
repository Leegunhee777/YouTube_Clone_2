import React, { useEffect, useState } from 'react'
import {Row, Col, List, Avatar} from 'antd'//반응형으로 반들떄 유용, Row와 Col이거 두개로 일단 전체틀을잡는다!!!.
import axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';
import Comment from './Sections/Comment';
import LikeDislikes from './Sections/LikeDislikes';

function VideoDetailPage(props){

    const videoId = props.match.params.videoId;
    const variable = {videoId:videoId}
    
    const [VideoDetail, setVideoDetail] = useState([]);
    
    const [Comments, setComments] = useState([]);

    useEffect(()=> {
         axios.post('/api/video/getVideoDetail',variable)
        .then(response =>{
            if(response.data.success){
                setVideoDetail(response.data.videoDetail);
            }else{
                alert('비디어 정보를 가져오지 못했습니다.')
            }
        })

        //댓글처리를위한 post임
        //해당 비디오에 관련된 모든 댓글 다가져옴
        axios.post('/api/comment/getComments', variable)
        .then(response =>{
            if(response.data.success){
                setComments(response.data.comments)
            }else{
                alert('코멘트 정보를 가져오는 것을 실패하였습니다.')
            }
        })
    },[])

    const refreshFunction= (newComment) =>{  //refreshFunction을 이용하여 실시간 처럼 댓글이 추가되게 할수있음, (새로고침없이도)
        setComments(Comments.concat(newComment)) //댓글이 submit되고->DB에 댓글이 추가되고,->DB에서 새롭게 갱신된 디비값을가져와->newComment이게 디비에서 가져온값임
                                                 // refreshFunction을 호출하여, State변수인 Comments를 업데이트해준다.<Comment.js의 onsubmit함수참고>
    }
    if(VideoDetail.writer){ //값이 들어가기도 전에 렌더되는경우가 있어 undefined에러뜰때있음, 조건문을 걸어 처리해줘야하는 경우 간혹있음 
        
        
        
        return(
            <Row gutter= {[16, 16]}>{/*gutter은 내부의 Col사이의 여백을지정하는것임 */}
                <Col lg={18} xs={24}> {/*가로 전체가 24임 그중 18비중을 차지하게 설정 */}
                    <div style= {{width: '100%', padding: '3rem 4rem'}}>
                        <video style={{ width: '100%'}} src={`http://localhost:5000/${VideoDetail.filePath}`} controls={true}/>
    
                       
                        <List.Item
                            actions={[<LikeDislikes video={VideoDetail} userId={props.user} videoId={videoId}/>,<Subscribe receivedUser={VideoDetail.writer._id} user = {props.user}/>]} //구독버튼처리를위한 컴포넌트임
                        >
                            <List.Item.Meta
                                avatar ={<Avatar src={VideoDetail.writer.image} />} 
                                title =  {VideoDetail.title}
                                description =  {VideoDetail.description}
                            />
                        </List.Item>

                    {/*-------------------------댓글관련 부분임!!-------------------------------- */}
                    <Comment refreshFunction={refreshFunction} videoId={ props.match.params.videoId} commentLists={Comments}/>

                    
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