import React, { useContext, useState } from 'react'
import UserContext from '../context/user/UserContext'
import { CiSearch } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import { ImQrcode } from "react-icons/im";
import { GiLion } from "react-icons/gi";
import { GrPower } from "react-icons/gr";


const Navbar = (props) => {
    const context = useContext(UserContext);
    const token = context.token;
    const user = context.user;
    const setUser = props.setUser;
    const fetchData = context.fetchData;
    const setLoading = context.setLoading;
    const navigate = useNavigate();
    const skipp = context.skipp;

    const [text,setText] = useState("");

    const serachHandler =async ()=>{
      //here we need to sort the accounts array inside the user and set it as a new user
      setLoading(true);

      const filterdAccounts = user.accounts.filter(account => account.name.toLowerCase().includes(text.toLowerCase()));

      setUser((prev)=>{
        return {
          ...prev,
          accounts:filterdAccounts
        }
      });
      setLoading(false);
      //console.log(text);
    }

    const logoutHandler = ()=>{
      localStorage.removeItem("token");
      location.reload("/")
    }

    const handleOpenPhonePe = () => {
      const appUrl = 'phonepe://';
      const fallbackUrl = 'https://play.google.com/store/apps/details?id=com.phonepe.app';
    
      // Create an invisible iframe
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
    
      // Attempt to open the app using the deep link
      iframe.src = appUrl;
    
      // Fallback to Play Store if the app is not installed
      setTimeout(() => {
        window.location.href = fallbackUrl;
      }, 4000); // 2 seconds should be enough to detect if the app is installed
    };
    
  return (
    <div className='nav-wrapper'>
        <div className='logo-con'>
          <h1 className='logo' onClick={()=>{setText("");navigate("/");fetchData(token,skipp)}}>MTracker</h1>
          <div className='logo-btn-con'>
            <GrPower className='logo-btn' onClick={logoutHandler}></GrPower>
            <ImQrcode className='logo-btn' onClick={()=>{navigate("/scanner")}}  onDoubleClick={handleOpenPhonePe}></ImQrcode>
            <GiLion className='logo-btn' onClick={()=>{navigate("/self")}}></GiLion>
          </div>
        </div>
        
        <div className='input-div'>
            <input type='text' placeholder='Search' value={text} name='text' onChange={(event)=>{setText(event.target.value)}} onKeyDown={(event)=>{if(event.key=="Enter"){serachHandler()}}} ></input>
            <CiSearch className='search-icon' onClick={serachHandler}></CiSearch>
        </div>

    </div>
  )
}

export default Navbar
