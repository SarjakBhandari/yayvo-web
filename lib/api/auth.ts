//ACTUAL API CALLS

import axios from "./axios";
import { API } from "./endpoints"

export const registerConsumer=async(registerData:any)=>{
    try{
        const response=await axios.post(API.AUTH.REGISTER_C,registerData);
        return response.data;
    }catch(err:Error|any){
        throw new Error(
            err.response?.data?.message // backend error message
            ||err.message //general axios message
            || "Registration Failed" //fallback message
        )
    }
}
export const registerRetailer=async(registerData:any)=>{
    try{
        const response=await axios.post(API.AUTH.REGISTER_R,registerData);
        return response.data;
    }catch(err:Error|any){
        throw new Error(
            err.response?.data?.message // backend error message
            ||err.message //general axios message
            || "Registration Failed" //fallback message
        )
    }
}