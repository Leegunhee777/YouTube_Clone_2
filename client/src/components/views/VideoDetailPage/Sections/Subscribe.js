import axios from 'axios'
import React, { useEffect,useState } from 'react'

function Subscribe({receivedUser,user}){

    //videoDetail페이지의 ,영상에대해, 영상올린자의 구독자수를 담고있음
    const [SubscribeNumber, setSubscribeNumber] = useState(0);

      //videoDetail페이지의 ,영상에대해,영상올리자를 구독한상태인지 아닌지를 담고있음
    const [Subscribed, setSubscribed] = useState(false);

    useEffect(()=>{
        console.log('구독자관련Test');
        console.log(user);
     
        let variable = {receivedUser: receivedUser} //구독을 사람들에게 받는사람(동영상올린자의 _id정보를 가져옴)
    
        //해당영상을 올린자의 구독자수를 뽑아오기위한 처리임
        axios.post('/api/subscribe/subcribeNumber', variable)
        .then(response => {
            if(response.data.success){
                setSubscribeNumber(response.data.subscribeNumber);
            }else{
                alert('구독자 수 정보를 받아오지 못했습니다.')
            }
        })


        //구독되있는사람인지 안되있는사람인지 처리해주기 위해 필요한작업
       
        if(user.userData) //로그인상태라면 접근가능!!하게 처리하기위해필요!!!!!!!!
        {
        let subscribeVariable = {receivedUser: receivedUser, giveUser: user.userData._id};
        //구독을 받는사람의 정보(동영상올란자의 _id정보)와 ,현재로그인중인 사람의 _id(user.userData._id)를 가져옴
        axios.post('/api/subscribe/subscribedboolean', subscribeVariable)
            .then(response =>{
                if(response.data.success){
                    setSubscribed(response.data.subscribed);
                }else{
                    alert('정보를 받아오지 못했습니다.')
                }
            })
        }

       
    },[user])


    const onSubscribe = ()=>{
    
        let subscribedVariable = {
            receivedUser:receivedUser,
            giveUser: user.userData._id
        }

        if(Subscribed){ //이미 구동중이라면
            axios.post('/api/subscribe/unSubscribe', subscribedVariable)
            .then(response =>{
                if(response.data.success){
                    console.log(response.data);
                    setSubscribeNumber(SubscribeNumber -1)
                    setSubscribed(!Subscribed)
                }else{
                    alert('구독 취소하는데 실패했습니다.')
                }
            })
                            
        }else{ //구독중이아니라면

            axios.post('/api/subscribe/subscribe', subscribedVariable)
            .then(response =>{
                if(response.data.success){
                    console.log(response.data);
                    setSubscribeNumber(SubscribeNumber + 1)
                    setSubscribed(!Subscribed)
                }else{
                    alert('구독하는데 실패했습니다.')
                }
            })
        }
    
    }

 if(user.userData) //로그인안되있는사람도 user.userData정보는가지고있다. -참고-
 {
    return(
        <div>  
            
            구독자수:{SubscribeNumber}
           
            {user.userData.isAuth && user.userData._id !== receivedUser &&
          
            <button
            style={{
                backgroundColor:`${Subscribed ? '#AAAAAA' : '#CC0000'}`,
                borderRadius: '4px', color: 'white',
                padding: '10px 16px', fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
            }}
            onClick={onSubscribe}
            >
             {Subscribed ? '구독중' :' 구독하기'}
            </button>
        
            }
            <br/>
            {/*
            로그인중인사람:  {user.userData._id}
            영상주인:    {receivedUser}
            */ }
           
        </div>
            
    )
}else{
    return(<div>...loading</div>)
}
}
export default Subscribe;