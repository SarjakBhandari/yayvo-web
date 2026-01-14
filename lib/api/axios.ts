import axios from "axios";


const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";
const axiosInstance=axios.create(
    {
    baseURL:BASE_URL,
    headers:{
        "Context-Type":"application/json" // working in json
    }
}
)

export default axiosInstance;