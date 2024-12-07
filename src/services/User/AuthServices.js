const BASE_URL =    "https://mtracker-0sct.onrender.com" //   "http://localhost:4000"  

export const signUp = async (data)=>{
    try{
        console.log("In signup funtion")
        const res = await fetch (`${BASE_URL}/auth/signup`,
            {
                method:'POST',
                headers: {
                'Content-type': 'application/json',
                },
                mode:'cors',
                body:JSON.stringify(data),
            }
        )            
        const output = await res.json();    
        console.log(output)
        return output;
    } catch(err){
        console.log(err)
    }
}

export const login  = async(data) =>{
    try{
        const res = await fetch (`${BASE_URL}/auth/login`,
            {
                method:'POST',
                headers: {
                'Content-type': 'application/json',
                },
                mode:'cors',
                body:JSON.stringify(data),
            }
        )            
        const output = await res.json();    
        console.log(output)
        return output;
    } catch(err){
        console.log(err)
    }
}

export const getUser = async(token,skip)=>{
    try{

        const res = await fetch (`${BASE_URL}/auth/${skip}`,
            {
                method:'GET',
                headers: {
                'Content-type': 'application/json',
                'token': token
                },
                mode:'cors',
            }
        )       
        const output = await res.json();
        console.log("User details are :" , output);
        return output.body;

    } catch(err){
        console.log(err);
    }
}

export const uploadScanner = async(token,formData)=>{
    try{
        //console.log(formData , "in service")
        const res = await fetch (`${BASE_URL}/auth/scanner`,
            {
                method: 'POST',
                headers: {
                    'token': token,
                },
                mode: 'cors',
                body: formData,
            }
        )

        const output = await res.json();
        //console.log(output);
        if(output.success === true){
            return output.body
        }
        else{
            console.log(output);
        }
    } catch(err){
        console.log(err);
    }
}