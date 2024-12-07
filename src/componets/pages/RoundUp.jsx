import React, { useContext, useState } from 'react'
import { useParams , useNavigate } from 'react-router-dom'
import Navbar from '../Navbar';
import { roundUp } from '../../services/Self/SelfServicec';
import UserContext from '../../context/user/UserContext';

const RoundUp = () => {
    const params = useParams();
    const id = params.id;
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate()
    const [amount,setAmount] = useState();
    const context = useContext(UserContext);
    const token = context.token;

    const submitHandler = async()=>{
        setLoading(true);
        const data = {
            amount:amount,
        }
        const res = await roundUp(id,data,token);
        navigate("/");
        setLoading(false);
    }

  return (
    <div className='roundup-wrapper'>
        <Navbar></Navbar>
        {
            loading ? <div className='loader'></div> :
            <div className='roundup-con'>
                <input type='text' placeholder='Balance' name="amount" value={amount} onChange={(event)=>{setAmount(event.target.value)}} className='std-input'></input>
                <div className='homepage-btn' onClick={submitHandler}>Submit</div>
            </div>
        }
    </div>
  )
}

export default RoundUp
