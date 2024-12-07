import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../Navbar'
import UserContext from '../../context/user/UserContext';
import { useNavigate } from 'react-router-dom';
import { split } from '../../services/Account/AccountServices';

const Split = () => {

    const [data,setData] = useState({
        amount : "",
        details: "",
        accounts : []
    })
    const context = useContext(UserContext);
    const token = context.token;
    const setUser2 = context.setUser;
    const setSkipp = context.setSkipp;
    const [user,setUser] = useState(context.user);
    const [loading , setLoading ] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
        if(user === "" || user === null){
            navigate("/");
        }
    })
    

    const submitHandler = async()=>{
        setLoading(true);
        const newUser = await split(data,token);
        //console.log(newUser);
        setUser2(newUser);
        setSkipp("true");
        setLoading(false);
        navigate("/");
    }

    const changeHandler = (event) =>{
        setData({...data,[event.target.name]:event.target.value});
    }

    const selectHandler = (id)=>{
        if(data.accounts.includes(id)){
            let arr = data.accounts;
            let ind = arr.indexOf(id);
            arr.splice(ind,1);
            setData({...data,["accounts"]:arr});
            //console.log(arr);
            return;
        }
        let arr = new Array(data.accounts.length + 1) ;
        arr = data.accounts;
        //console.log(arr);
        arr.push(id);
        //console.log(arr);
        setData({...data ,["accounts"]:arr});
    }

  return (
    <div className='split-wrapper'>
        
        <Navbar setUser = {setUser}></Navbar>

        {
            loading ? <div className='loader'></div> : <div  className='split-wrapper-2'>

                <div className='split-top'>
                    <input type='text' placeholder='Amount' value={data.amount} name='amount' onChange={changeHandler}></input>
                    <textarea rows='5' placeholder='Details' value={data.details} name='details' onChange={changeHandler}></textarea>
                    <div className='homepage-btn' onClick={submitHandler}>Create</div>
                </div>

                {
                            user.accounts.length === 0 ? <h3>No Contacts</h3> : <div className='homepage-card-con'>

                            {
                                user.accounts.map((account,key)=>{
                                    return ( 
                                        <div className={data.accounts.includes(account._id) ? 'selected homepage-card' : 'homepage-card'} onClick={()=>{selectHandler(account._id)}}>
                                            <div className='card-name'>{account.name}</div>
                                            <div className='card-amount'>{account.totalAmount}</div>
                                        </div>
                                    )
                                })
                            }

                            </div>
                }


            </div>
        }

        
        
    </div>
  )
}

export default Split
