import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RetailerData, retailerSchema } from "../_schema/retailer.schema";
import { useRouter } from "next/router";
import { useState, useTransition } from "react";
import { handleRegisterRetailer } from "@/lib/actions/auth-actions";

export function useRetailerRegister(onSuccess?: () => void) {
  const router= useRouter();
    const [pending, setTransition]= useTransition();
    const [errors, setError]= useState("");
  const form = useForm<RetailerData>({
    resolver: zodResolver(retailerSchema),
  });

 const handleFormSubmit =async (data: RetailerData) => {
       //ccall action here
       setError("");
       try{
         const res= await handleRegisterRetailer(data);
         if(!res.success){
           throw new Error(res.message || "Registration Failed")
         }
         //handle redirect (optional)
         setTransition(()=>{
           router.push("/login");
         }
       )
       }catch(err:Error | any){
           setError(err.message || "Registration Failed")
         }
   };

  return {
    ...form,
    handleFormSubmit,
    errors,
    pending
  };
}
