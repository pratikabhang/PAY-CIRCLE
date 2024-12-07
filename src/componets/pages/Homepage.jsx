import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../Navbar'
import UserContext  from "../../context/user/UserContext"
import { useNavigate } from 'react-router-dom';
import Hero from '../Hero';

const Homepage = () => {

  const context = useContext(UserContext);
  const [user,setUser] = useState(context.user);
  const [loading,setLoading] = useState(context.loading);
  const token = context.token;

  const navigate = useNavigate();

  useEffect(()=>{
    setLoading(context.loading);
    setUser(context.user);
    //console.log(context.user);
  },[context.loading , context.user])

  return (
    <div className='homepage-wrapper'>
      <Navbar setUser = {setUser}></Navbar>

      {/* homepage will have two different divs one for login and signup and another for logged in users */}

      {
        loading ? <div className='loader'></div> : user === "" ? <div className='pre-loginHomePage-con'>
          <h2>You need to SignUp or LogIn to Continue...</h2>
          <div className='homepage-btn-con'>
            <div className='homepage-btn' onClick={()=>{navigate("/signup")}}>SignUp</div>
            <div className='homepage-btn' onClick={()=>{navigate("/login")}}>LogIn</div>
          </div>
        </div> : 

        <div className='homepage-con'>
          <Hero user = {user} token = {token}></Hero>
        </div>
      }

      

    </div>
  )
}

export default Homepage
