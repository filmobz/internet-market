import axios from "axios";

const axiosinstance = axios.create({
    baseURL:"https://68ed114feff9ad3b14047282.mockapi.io/api",
    headers:{
        "Content-Type" : "application/json"
    }
})


export default axiosinstance    