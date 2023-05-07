import React from 'react';
import { useParams } from "react-router-dom";
import NotFoundPage from "../404/index";
import EmailSetting from "./emailSetting";
import UsernameSetting from "./usernameSetting";
import PhoneSetting from "./phoneSetting";
import DOBSetting from "./dobEdit";
import GenderSetting from "./genderSetting";
import ImgUploadSetting from "./imageUpload";

const EditSettings = () => {
  const { userId, option } = useParams();
  console.log(userId);
  console.log(option);

    //Render different components based on the value of 'option'
    switch (option) {
      case "uploadImage": 
        return <ImgUploadSetting userId={userId}/>
      case "username":
        return <UsernameSetting userId={userId}/>;
      case "email":
        return <EmailSetting userId={userId}/>;
      case "phone":
        return <PhoneSetting userId={userId}/>;
      case "dob":
        return <DOBSetting userId={userId}/>;
      case "gender":
        return <GenderSetting userId={userId}/>;
      default:
        return <NotFoundPage/>;
    }
};

export default EditSettings;
