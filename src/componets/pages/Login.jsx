import React, { useContext, useEffect, useState } from 'react'
import back from "../../assets/signupbackground.avif"
import { FaEye } from "react-icons/fa";
import { login } from '../../services/User/AuthServices';
import { useNavigate } from 'react-router-dom';
import UserContext  from "../../context/user/UserContext"

const Login = () => {

    const [seep , setSeep] = useState(false);
    const context = useContext(UserContext)
    const setUser = context.setUser;
    const navigate = useNavigate()
    const [data , setData] = useState({
        email : "",
        password : ""
    })
    const [error , setError] = useState("");

    const handleChange = (event)=>{
        setData({
          ...data,
          [event.target.name]:event.target.value
        })
    }

    const handleSubmit = async()=>{
        const output = await login(data);
        if(output.success === true){
          console.log("This is token generated form server",output.token);
          localStorage.setItem("token" , JSON.stringify(output.token));
          setUser(output.user)
          navigate("/")
        }
        else{
          setError(output.message)
        }
    }

    useEffect(()=>{
      setTimeout(() => {
        setError("")
      }, 7000);
    }),[error]

  return (
    <div className='signup-wrapper'>

    <img src={back} className='signup-back-image'></img>

    <div className='signup-form-wrapper'>
      
      <div className='signup-form'>
          
          <h2 className='main-heading'>Welcome Back</h2>

          <p className='heading-text'>SignIn to get back to your Account</p>


          <div  className='std-input-div'>
            <input  className='std-input' type='email' placeholder='Enter Email' name='email' value={data.email} onChange={handleChange}></input>
          </div>

          <div className='std-input-div password' >
            <input className='std-input'  type={seep ? 'text' : 'password'} placeholder='Password' name = "password" value={data.password} onChange={handleChange}></input>
            <FaEye className='faeye' onClick={()=>{setSeep(!seep)}}></FaEye>
          </div>

          
          <div className='dark-btn' onClick={handleSubmit}>SIGN IN</div>

          <div>SignIn with google</div>

          <div className='footer-text'>Dont have an Account? <p>SignUp</p></div>

          <div className='error-footer'>{error}</div>

      </div>

    </div>

</div>
  )
}

export default Login
