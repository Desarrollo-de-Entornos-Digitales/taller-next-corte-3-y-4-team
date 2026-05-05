import axios from 'axios';

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

console.log("API Base URL:", process.env.NEXT_PUBLIC_API_URL);

export default axiosClient;
