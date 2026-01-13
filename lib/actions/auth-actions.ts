//server side processing

"use server"
import { registerConsumer,registerRetailer } from "../api/auth";

export const handleRegisterConsumer = async (formData: any)=>{
    try{
        //how data is sent from component to backend api
        const res=await registerConsumer(formData);
        // component return logic 
        if(res.success){
            return{
                success:true,
                data: res.data,
                message:"Registration Successful"
            };
        }
        return {success:false, message:res.message || "Registration Failed"};
    
    }catch(err:Error | any){
        return{success:false, message: err.message || "Registration Failed"
        };
    }
}

export const handleRegisterRetailer = async (formData: any)=>{
    try{
        //how data is sent from component to backend api
        const res=await registerRetailer(formData);
        // component return logic 
        if(res.success){
            return{
                success:true,
                data: res.data,
                message:"Registration Successful"
            };
        }
        return {success:false, message:res.message || "Registration Failed"};
    
    }catch(err:Error | any){
        return{success:false, message: err.message || "Registration Failed"
        };
    }
}