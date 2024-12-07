import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getAccount , deleteAccount } from '../../services/Account/AccountServices';
import UserContext from '../../context/user/UserContext';
import Navbar from '../Navbar';

const ViewAccount = () => {
    const context = useContext(UserContext)
    const params = useParams();
    const id = params.id;
    const [account , setAccount ] = useState("");
    const token =  context.token;
    const setUser = context.setUser;
    const setSkipp = context.setSkipp;
    const [loading , setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{

        async function fetchData (id){
            setLoading(true);
            const response = await getAccount(id,token);
            if(response.success === true){
                response.body.entry.reverse();
                setAccount(response.body);
                //console.log(response.body);
            }
            else{
                console.log(response);
            }
            //console.log(response);
            setLoading(false);
        }
        fetchData(id);

    },[id]);

    const deleteHandler = async ()=>{
        setLoading(true); 
        const user = await deleteAccount(id,token);
        console.log(user);
        setUser(user);
        setLoading(false);
        setSkipp("true");
        navigate("/");
    }

    const entryHandler = (id)=>{
        navigate(`/entry/${id}`);
    }

    return (
    <div className='account-wrapper'>
        
        <Navbar></Navbar>

        {
            loading ? <div className='loader'></div> : <div>
                {
                    account ? <div className='account-con'>
                        <h2>{account.name}</h2>
                        <div className='account-main'>
                            <h3 className='totalAmount'>{account.totalAmount}</h3>
                            <div className='homepage-btn' onClick={()=>{navigate(`/createEntry/${id}`)}}>Create Entry</div>
                            <div className='homepage-btn' onClick={deleteHandler}>Delete</div>
                        </div>
                        <div className='entry-card-con'>
                            {
                                account.entry.map((entry,key)=>{
                                    return <div className='entry-card'>
                                        <div className='entry-card-main' onClick={()=>{entryHandler(entry._id)}}>
                                            <div className={entry.amount < 0 ? 'red' : 'green'}>{entry.amount}</div>
                                            <div>{entry.createAt.substring(0,10).split('-').reverse().join('-')}</div>
                                        </div>
                                        <div>{entry.details}</div>
                                    </div>
                                })
                            }
                        </div>
                    </div> : <h3>NO ACCOUNT PRESENT</h3>
                }
            </div>
        }

      
    </div>
   )
}

export default ViewAccount
