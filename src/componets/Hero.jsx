import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { IoMdContacts } from "react-icons/io";
import { useSwipeable } from 'react-swipeable';


const Hero = (props) => {
    const user = props.user;
    //console.log("User in hero section: ",user);

    const navigate = useNavigate();

    const routeHandler = (id)=>{
        navigate(`/account/${id}`);
    }

    // const handlers = useSwipeable({
    //     onSwipedLeft: navigate("/createEntry/"),
    // })

    return (
        <div className='hero-wrapper'>

            <div className='hero-btn-con'>
                <div onClick={()=>{navigate("/create")}} className='homepage-btn' >Create</div>
                <div onClick={()=>{navigate("/split")}} className='homepage-btn'>Split</div>
            </div>

            <h2 className='homepage-heading2'><IoMdContacts className='contacts-icon'></IoMdContacts> Contacts</h2>

            
                {
                    user.accounts.length === 0 ? <h3>No Contacts</h3> : <div className='homepage-card-con'>

                    {
                        user.accounts.map((account,key)=>{
                            return (
                                <div className='homepage-card' onClick={()=>{ routeHandler(account._id)}} >
                                    <div className='card-name'>{account.name}</div>
                                    <div className='card-amount'>{account.totalAmount}</div>
                                </div>
                            )
                        })
                    }

                    </div>
                }

        </div>
    )
}

export default Hero
