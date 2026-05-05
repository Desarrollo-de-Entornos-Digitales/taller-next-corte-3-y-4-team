import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

export const feedService = {
  getExercises: async () => {
    const response = await axiosClient.get("/exercises");
    return response.data;
  },
  getStreak: async () => {
    const response = await axiosClient.get("/exercise-history/me/streak");
    return response.data;
  },
  getTotalExercises: async () => {
    const response = await axiosClient.get("/exercise-history/me");
    return response.data.length;
  },
};