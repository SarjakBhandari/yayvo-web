import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RetailerData, retailerSchema } from "../_schema/retailer.schema";

export function useRetailerRegister(onSuccess?: () => void) {
  const form = useForm<RetailerData>({
    resolver: zodResolver(retailerSchema),
  });

  const handleFormSubmit = (data: RetailerData) => {
    console.log("Retailer Registration:", data);
    alert("Retailer Registration Successful!");
    if (onSuccess) onSuccess();
  };

  return {
    ...form,
    handleFormSubmit,
  };
}
