import React, {useState} from "react";
import {Typography, Button, Form, message, Input, Icon} from 'antd';
import axios from 'axios';
import Dropzone from 'react-dropzone';


//드랍존 다운받기 npm install react-dropzone --save //save를해야 dependencies에 흔적이남음

const {TextArea} = Input;
const {Title} = Typography;

const PrivateOption = [
    {value: 0 , label: "Private"},
    {value: 1, label: "Public"}
];

const CategoryOption = [
    {value: 0, label: "Film & Animation"},
    {value: 1, label: "Autos & Vehicles"},
    {value: 2, label: "Music"},
    {value: 3, label: "Pets & Animals"},
]
function VideoUploadPage(props){
    const{user} = props;

    const [VideoTitle, setVideoTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [privacy, setPrivacy] = useState(0)
    const [Category, setCategory] = useState("Film & Animation");
    const [FilePath, setFilePath] = useState("");
 
    const onTitleChange = (e)=>{
        setVideoTitle(e.currentTarget.value);
    }

    const onDescriptionChange = (e)=>{
        setDescription(e.currentTarget.value);
    }

    const onPrivateChange= (e) =>{
        setPrivacy(e.currentTarget.value);
        console.log(privacy);
    }

    const onCategoryChange= (e) =>{
        setCategory(e.currentTarget.value);
        console.log(Category);
    }

    const onDrop = async (files) =>{
        let formData = new FormData;
        const config = {
            header: {'content-type':'multipart/form-data'}
        }
        formData.append("file", files[0])
        
       await axios.post('/api/video/uploadfiles',formData,config)
        .then(response =>{
            if(response.data.success){//서버로부터의 res.json({...})정보는 client에서 response.data로 조회가능함
                console.log(response.data);
                setFilePath(response.data.filePath);
        
        }else{
                alert('비디오 업로드 실패');
            }
        })
    }

    const onSubmit = async (e) =>{
        e.preventDefault(); //새로고침 안되게 막아줌

        const variables = {
            writer: user.userData._id,
            title:VideoTitle,
            description:Description,
            privacy:privacy,
            filePath:FilePath,
            category:Category
        }

        await axios.post('/api/video/uploadVideo', variables)
        .then(response => {
            if(response.data.success){//서버로부터의 res.json({...})정보는 client에서 response.data로 조회가능함
                message.success('성공적으로 업로드를 했습니다.');
               
                setTimeout(()=>{    
                    props.history.push('/'); //홈으로 경로변경해줌 , 함수형컴포넌트 매개변수에서props파라미터로 넣어줘야함
                },2000);
               
                
            }else{
                alert('비디오 업로드 실패')
            }
        })
    }
    
    return(
        <div style={{maxWidth: '700px', margin:'2rem auto'}}>
            <div style={{ textAlign: 'center', marginBottom:'2rem'}}>
                <Title level= {2}> Upload Video</Title>
            </div>

            <Form onSubmit={onSubmit} >
                <div style = {{display:'flex', justifyContent:'space-between'}}>
                    {/* Drop Zone */}
                    <Dropzone
                    onDrop={onDrop} //Dropzone에 파일이올라갈시 발동
                    multiple={false} //파일을 하나만 올릴껀지, 여러개올릴껀지
                    maxSize={10000000000000}
                    >
                    {({getRootProps, getInputProps})=>(
                        <div style={{width: '300px', height:'240px',border: '1px solid lightgray', display:'flex',
                        alignItems: 'center', justifyContent:'center'}}{...getRootProps()}>
                            <input {...getInputProps()}/>
                            <Icon type = "plus" styles={{fontSize:'3rem'}}/>
                        </div>
                    )}

                    </Dropzone>

                    {/* Thumnail */}
                    {FilePath && (
                    <div>
                      <video style={{width:'300px',marginLeft:'0px'}}src={`http://localhost:5000/${FilePath}`} controls={false}/>
                    </div>)
                    }           
                </div>
            <br/>
            <br/>
            <label>Title</label>
            <Input
                onChange={onTitleChange}
                value={VideoTitle}
            />

            <br/>
            <br/>
            <label>Desctiption</label>
            <TextArea
                onChange={onDescriptionChange}
                value={Description}
            />

            <br/>
            <br/>
            <select onChange={onPrivateChange}>
                {PrivateOption.map((item, index)=>(
                    <option key={index} valu={item.value}>{item.label}</option>
                ))}
                
            </select>

            <br/>
            <br/>
            <select onChange={onCategoryChange}>
            {CategoryOption.map((item, index)=>(
                    <option key={index} valu={item.value}>{item.label}</option>
                ))}
              
            </select>
            <br/>
            <br/>
            <Button type = "primary" size="large" onClick={onSubmit}>
                Submit
            </Button>
            </Form>
            
        </div>
    )
}

export default VideoUploadPage;
