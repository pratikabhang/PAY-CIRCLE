import React, { useContext, useState } from 'react'
import Navbar from '../Navbar'
import UserContext from '../../context/user/UserContext'
import { createAccount } from '../../services/Account/AccountServices'
import { useNavigate } from 'react-router-dom'

const CreateAccount = () => {
  
    const context = useContext(UserContext);
    const setUser = context.setUser;
    const setSkipp = context.setSkipp;
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();

    const [data,setData] = useState({
        name:"",
        totalAmount:"",
        details:"",
        note:"",
    })
    const token = context.token;

    const changeHandler = (event)=>{
        setData((prev)=>{
            return {
                ...prev ,
                [event.target.name] : event.target.value
            }
        })
    }

    const submitHandler = async () => {
        console.log(data);
        //api call to create account
        setLoading(true);
        await createAccount(data,token,setUser);
        setSkipp("true");
        setLoading(false);
        navigate("/");
    }

    return (
    <div className='create-wrapper-1'>

        <div className={loading ? 'create-wrapper blur' : 'create-wrapper'}>
            <Navbar></Navbar>

            <div className='create-con '>
                <h2 className='homepage-heading2'>Create Account</h2>
                <div className='create-input-con'>
                    <input type='text' placeholder='Name' name='name' value={data.name} onChange={changeHandler}></input>
                    <input type='text' placeholder='Initial Amount' name='totalAmount' value={data.totalAmount} onChange={changeHandler}></input>
                    <textarea  rows='3' placeholder='Details' name='details' value={data.details} onChange={changeHandler}></textarea>
                    <textarea rows='3' placeholder='Note' name='note' value={data.note} onChange={changeHandler}></textarea>
                </div>
                <div onClick={submitHandler} className='homepage-btn'>Create</div>
                
            </div>

        </div>

        <div className={loading ? 'loader' : 'block'}></div>
      
    </div>
  )
}

export default CreateAccount
