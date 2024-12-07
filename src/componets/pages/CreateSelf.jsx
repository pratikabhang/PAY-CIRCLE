import React, { useContext, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../Navbar';
import UserContext from '../../context/user/UserContext';
import { getUser } from '../../services/User/AuthServices';
import {createSelf} from "../../services/Self/SelfServicec";

const CreateSelf = () => {
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
        accountId:id,
        category:""
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
        await createSelf(id,data,token);
        const self = await getUser(token,"true");
        //console.log(user)
        setSkipp("true");
        setLoading(false);
        navigate(`/`);
    }

  return (
    <div className='create-wrapper-1'>

        <div className={loading ? 'create-wrapper blur' : 'create-wrapper'}>
            <Navbar></Navbar>

            <div className='create-con '>
                <h2 className='homepage-heading2'>Create Entry</h2>
                <div className='create-input-con'>
                    <input type='text' placeholder='Amount' name='amount' value={data.amount} onChange={changeHandler}></input>
                    <textarea type='text' placeholder='Details' name='details' rows='4' col='100' value={data.details} onChange={changeHandler}></textarea>
                    <textarea type='text' placeholder='Note' rows='4' col='100' name='note' value={data.note} onChange={changeHandler}></textarea>
                    <select name='category' value={data.category} onChange={changeHandler} className='category-select'>
                        <option value="">Select Category</option>
                        <option value="Food">Food</option>
                        <option value="Groceries">Groceries</option>
                        <option value="Fuel">Fuel</option>
                        <option value="Subscriptions">Subscriptions</option>
                        <option value="Clothes">Clothes</option>
                        <option value="Travel">Travel</option>
                        <option value="Rent">Rent</option>
                        <option value="Stationary">Stationary</option>
                        <option value="Courses">Courses</option>
                        <option value="Laundry">Laundry</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Medical">Medical</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div onClick={submitHandler} className='homepage-btn'>Create</div>
                
            </div>

        </div>

        <div className={loading ? 'loader' : 'block'}></div>
      
    </div>
  )
}

export default CreateSelf
