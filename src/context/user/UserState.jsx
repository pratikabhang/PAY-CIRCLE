import { useEffect, useState} from "react";
import UserContext from "./UserContext";
import { getUser } from "../../services/User/AuthServices";


const UserState = (props) => {
  const [loading,setLoading] = useState(true);
  const [user, setUser] = useState("");
  const [skipp,setSkipp] = useState(false);
  
  const token =  localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : "";
  console.log(token)
  let tempUser = "";
  useEffect(()=>{
    fetchData(token,"true");
  },[token]);


  async function  fetchData (token,skip){
    setLoading(true);
    if(token!==""){
      tempUser= await getUser(token,skip);
      setUser(tempUser);
      console.log(tempUser);
    }
    if(skip === "true"){
      setSkipp("false");
    }
    setLoading(false);
  }


  return (
    <UserContext.Provider value={{ user , setUser , loading , token , fetchData,setLoading , setSkipp , skipp}}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserState;