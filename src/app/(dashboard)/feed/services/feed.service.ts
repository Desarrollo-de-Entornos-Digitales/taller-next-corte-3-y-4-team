const API_URL = "http://127.0.0.1:3000";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

export const feedService = {
  getExercises: async () => {
    const res = await fetch(`${API_URL}/exercises`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
    return res.json();
  },
  getStreak: async () => {
    const res = await fetch(`${API_URL}/exercise-history/me/streak`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
    return res.json();
  },
  getTotalExercises: async () => {
    const res = await fetch(`${API_URL}/exercise-history/me`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
    const data = await res.json();
    return data.length;
  },
};