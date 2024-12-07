import React, { useContext, useReducer, useState } from 'react'
import UserContext from '../../context/user/UserContext'
import { uploadScanner } from '../../services/User/AuthServices';
import Navbar from "../../componets/Navbar";

const Scanner = () => {

    const context = useContext(UserContext);
    const user = context.user;
    const setUser = context.setUser;
    const token = context.token;
    const setSkipp = context.setSkipp;
    const [loading , setLoading ] = useState(false);

    const onChangeFile = async (event)=>{
       
        event.stopPropagation();
        event.preventDefault();
        const selectedFile = event.target.files[0];
        //console.log(selectedFile)
        let formData = new FormData();
        formData.append("scanner", selectedFile)
        setLoading(true)
        const tempUser = await uploadScanner(token,formData);
        setUser(tempUser);
        setSkipp("true");
        setLoading(false);
    }

  return (
    <div className='scanner-wrapper'>

      <Navbar></Navbar>

      {
        loading ? <div className='loader'></div> : <div>
          
          <div className='scanner-con'>
            <img src={user.scanner} className='scanner-img'></img>
            <input onChange={onChangeFile} type='file' className='scanner-input'></input>
          </div>
        </div>
      }
    </div>
  )
}

export default Scanner
