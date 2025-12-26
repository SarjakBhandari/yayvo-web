import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConsumerData, consumerSchema } from "../_schema/consumer.schema";

export function useConsumerRegister(onSuccess?: () => void) {
  const form = useForm<ConsumerData>({
    resolver: zodResolver(consumerSchema),
  });

  const onSubmit = (data: ConsumerData) => {
    console.log("Consumer Registration:", data);
    alert("Consumer Registration Successful!");
    if (onSuccess) onSuccess();
  };

  return {
    ...form,
    onSubmit,
  };
}
