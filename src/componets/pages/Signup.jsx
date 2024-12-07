import React, { useEffect, useState } from 'react'
import back from "../../assets/signupbackground.avif"
import { signUp } from '../../services/User/AuthServices'
import { FaEye } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify'

const Signup = () => {

  const navigate = useNavigate();

  const [seep , setSeep] = useState(false);
  const [seecp , setSeecp] = useState(false);
  const [error , setError] = useState("");
  const [data,setData] = useState({
    name:'',
    email:'',
    password:'',
    confirmPassword:''
  })

  const handleChange = (event)=>{
    setData({
      ...data,
      [event.target.name]:event.target.value
    })
  }

  const handleSubmit = async()=>{
    console.log(data);
    const output = await signUp(data);
    console.log(output.success)
    if(output.success === true){
      navigate("/login");
    }
    else{
      setError(output.message)
    }
  }

  useEffect(()=>{
    setTimeout(() => {
      setError("")
    }, 7000);
  },[error])

  return (
    <div className='signup-wrapper'>

        <img src={back} className='signup-back-image'></img>

        <div className='signup-form-wrapper'>
          
          <div className='signup-form'>
              
              <h2 className='main-heading'>Welcome</h2>

              <p className='heading-text'>Singup to get started with your first record</p>

              <div className='std-input-div'>
                <input type='text'  className = "std-input" placeholder='Enter Name' name='name' value={data.name} onChange={handleChange} ></input>
              </div>

              <div  className='std-input-div'>
                <input  className='std-input' type='email' placeholder='Enter Email' name='email' value={data.email} onChange={handleChange}></input>
              </div>

              <div className='std-input-div password' >
                <input className='std-input'  type={seep ? 'text' : 'password'} placeholder='Password' name = "password" value={data.password} onChange={handleChange}></input>
                <FaEye className='faeye' onClick={()=>{setSeep(!seep)}}></FaEye>
              </div>

              <div className='std-input-div password'>
                <input className='std-input'  type={seecp ? 'text' : 'password'} placeholder='Confirm Password' name='confirmPassword' value={data.confirmPassword} onChange={handleChange}></input>
                <FaEye className='faeye' onClick={()=>{setSeecp(!seecp)}}></FaEye>
              </div>

              <div className='dark-btn' onClick={handleSubmit}>SIGN UP</div>

              <div>Sign up with google</div>

              <div className='footer-text'>Already have an Account? <p>Sign In</p></div>

              <div className='error-footer'>{error}</div>

          </div>

        </div>

    </div>
  )
}

export default Signup
