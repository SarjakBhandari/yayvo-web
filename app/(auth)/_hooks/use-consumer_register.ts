import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConsumerData, consumerSchema } from "../_schema/consumer.schema";
import { handleRegisterConsumer } from "@/lib/actions/auth-actions";
import { useRouter } from "next/router";
import { useState, useTransition } from "react";

export function useConsumerRegister(onSuccess?: () => void) {
  const router= useRouter();
  const [pending, setTransition]= useTransition();
  const [errors, setError]= useState("");


  const form = useForm<ConsumerData>({
    resolver: zodResolver(consumerSchema),
  });

  const onSubmit =async (data: ConsumerData) => {
      //ccall action here
      setError("");
      try{
        const res= await handleRegisterConsumer(data);
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
    onSubmit,
    errors,
    pending
  };
}
