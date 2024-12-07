import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getEntry , editEntry , deleteEntry } from '../../services/Account/AccountServices';
import Navbar from '../Navbar';
import UserContext from '../../context/user/UserContext';

const ViewEntry = () => {

    const params = useParams();
    const id = params.id;
    const navigate = useNavigate();
    const context = useContext(UserContext);
    const token = context.token;

    const [entry,setEntry] = useState('');
    const [copy,setCopy] = useState('');
    const [editFlag , setEditFlag] = useState(false);
    const [loading,setLoading] = useState(false);
    const setSkipp = context.setSkipp;
    const setUser = context.setUser;


    useEffect(()=>{
        
        const fetchData  = async(id)=>{
            setLoading(true);
            const res = await getEntry(id);
            setEntry(res);
            setLoading(false);
        }
        fetchData(id);

    },[id]);

    const changeHandler = (event)=>{
        setEntry((prev)=>{
            return {
                ...prev,
                [event.target.name] : event.target.value
            }
        })
    }

    const saveHandler = async()=>{
        setLoading(true);
        const newEntry = await editEntry(id,entry);
        console.log(newEntry);
        setEntry(newEntry);
        setEditFlag(false);
        setSkipp("true");
        setLoading(false);
    }

    const deleteHandler = async() => {
        setLoading(true)
        const res = await deleteEntry(token,id);
        if(res){
            setUser(res);
            setSkipp("true");
            navigate("/");
        } else{
            console.log("Failed to delete");
        }
        setLoading(false);
    }

    const discardHandler = () =>{
        setEntry(copy);
        setEditFlag(false);
    }

    return (
    <div className='entry-wrapper'>

        <Navbar></Navbar>

        {
            loading ||entry == '' ? <div className='loader'></div> : 
            <div className='entry-con'>

                {
                    editFlag ? <div className='entry-con'>

                         <div className='entry-top'>
                            <input value={entry.amount} name="amount" onChange={changeHandler}></input>
                            <div className='date-con'>
                                <div>Cretated: {entry.createAt.substring(0,10)}</div>
                                <div>Updated: {entry.updateAt.substring(0,10)}</div>
                            </div>
                        </div>

                        <textarea rows='5' onChange={changeHandler} name='details' value={entry.details}>{entry.details}</textarea>
                        <textarea rows='5' onChange={changeHandler} name='note' value={entry.note}>{entry.note}</textarea>

                        <div className='entry-btn-con'>
                            <div className='homepage-btn' onClick={discardHandler}>Discard</div>
                            <div className='homepage-btn' onClick={saveHandler}>Save</div>
                        </div>


                    </div> : <div className='entry-con'>

                        <div className='entry-top'>
                            <div className={entry.amount < 0 ? 'red amount' : 'green amount'}>{entry.amount}</div>
                            <div className='date-con'>
                                <div>Cretated: {entry.createAt.substring(0,10)}</div>
                                <div>Updated: {entry.updateAt.substring(0,10)}</div>
                            </div>
                        </div>

                        <h3>{entry.details}</h3>
                        <h4>{entry.note}</h4>

                        <div className='entry-btn-con'>
                            <div className='homepage-btn' onClick={deleteHandler}>Delete</div>
                            <div className='homepage-btn' onClick={()=>{setEditFlag(!editFlag);setCopy(entry)}}>Edit</div>
                        </div>

                    </div>
                }

            </div>
        }

    </div>
  )
}

export default ViewEntry
