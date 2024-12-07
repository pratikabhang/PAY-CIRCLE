import React, { useContext, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../Navbar';
import { createEntry } from '../../services/Account/AccountServices';
import UserContext from '../../context/user/UserContext';
import { getUser } from '../../services/User/AuthServices';
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa6";

const CreateEntry = () => {
    const context = useContext(UserContext);
    const params = useParams();
    const id = params.id;
    const [loading, setLoading] = useState(false);
    const token = context.token;
    const setSkipp = context.setSkipp;
    const navigate = useNavigate();

    const [data,setData] = useState({
        amount:"",
        details:"",
        note:"",
        accountId:id
    })

    const changeHandler = (event)=>{
        setData((prev)=>{
            return {
                ...prev , 
                [event.target.name] : event.target.value,
            }
        })
    }

    const submitHandler = async()=>{
        setLoading(true)
        await createEntry(data,token);
        const user = await getUser(token,"true");
        //console.log(data)
        context.setUser(user);
        setSkipp("true");
        setLoading(false);
        navigate(`/account/${id}`);
    }

    const addSymbol = (symbol) => {
        if(symbol === '+'){
            if(data.amount.length != 0 && data.amount[0] == '-' ){
                const newAmount = data.amount.substring(1,data.amount.length);
                setData( (prev) => {
                    return {
                        ...prev , 
                        amount : newAmount
                    }
                } );
            }
        } else{
            if(data.amount.length != 0 && data.amount[0] == '-' ){
                return;
            }
            const newAmount = symbol + data.amount;
            setData( (prev) => {
                return {
                    ...prev , 
                    amount : newAmount
                }
            } );
        }
    }

  return (
    <div className='create-wrapper-1'>

        <div className={loading ? 'create-wrapper blur' : 'create-wrapper'}>
            <Navbar></Navbar>

            <div className='create-con '>
                <h2 className='homepage-heading2'>Create Entry</h2>
                <div className='create-input-con'>
                    <div className='create-input-con-amount'>
                        <input type='text' placeholder='Amount' name='amount' value={data.amount} onChange={changeHandler} list = "frequent"></input>
                        <datalist id='frequent'>
                            <option>15</option>
                            <option>20</option>
                            <option>30</option>
                            <option>45</option>
                            <option>50</option>
                            <option>70</option>
                            <option>100</option>
                        </datalist>
                        <FaMinus className='symbolIcon red' onClick={ ()=> { addSymbol('-') }}></FaMinus>
                        <FaPlus className='symbolIcon green' onClick={ ()=> { addSymbol('+') }}></FaPlus>
                    </div>
                    <textarea type='text' placeholder='Details' name='details' rows='4' col='100' value={data.details} onChange={changeHandler}></textarea>
                    <textarea type='text' placeholder='Note' rows='4' col='100' name='note' value={data.note} onChange={changeHandler}></textarea>
                </div>
                <div onClick={submitHandler} className='homepage-btn'>Create</div>
                
            </div>

        </div>

        <div className={loading ? 'loader' : 'block'}></div>
      
    </div>
  )
}

export default CreateEntry
