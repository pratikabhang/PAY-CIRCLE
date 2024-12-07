const BASE_URL =  "https://mtracker-0sct.onrender.com" //  "http://localhost:4000"  

export const getSelf = async(token)=>{
    try{

        const res = await fetch (`${BASE_URL}/self/`,
            {
                method:'GET',
                headers: {
                'Content-type': 'application/json',
                'token':token
                },
                mode:'cors',
            }
        )    
        const output = await res.json();
        if(output.success === true){
            return output.body;
        }  
        else{
            console.log(output)
        }

    } catch(err){
        console.log(err)
    }
}

export const createSelf = async(id,data,token)=>{
    try{

        const res = await fetch (`${BASE_URL}/self/${id}`,
            {
                method:'POST',
                headers: {
                'Content-type': 'application/json',
                'token':token
                },
                mode:'cors',
                body:JSON.stringify(data)
            }
        )    
        const output = await res.json();
        if(output.success === true){
            return output.body;
        }
        else{
            console.log(output);
        }

    } catch(err){
        console.log(err)
    }
}

export const roundUp = async(id,data,token)=>{
    try{

        const res = await fetch (`${BASE_URL}/self/roundup/${id}`,
            {
                method:'POST',
                headers: {
                'Content-type': 'application/json',
                'token':token
                },
                mode:'cors',
                body:JSON.stringify(data)
            }
        )    
        const output = await res.json();
        if(output.success === true){
            return output.body;
        }
        else{
            console.log(output);
        }

    } catch(err){
        console.log(err)
    }
}