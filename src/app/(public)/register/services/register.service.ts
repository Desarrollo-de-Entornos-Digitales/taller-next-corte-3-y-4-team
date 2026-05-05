import axiosClient from "../../../../lib/axios/client";

interface RegisterResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string;
    rolId: number;
    rol: string;
    permissions: string[];
  };
}

class RegisterService {
  async register(name: string, email: string, password: string): Promise<RegisterResponse> {
    console.log("Enviando registro:", { name, email, password, rolId: 2 });
    const result = await axiosClient.post("/auth/register", {
      name,
      email,
      password,
      rolId: 2,
    });
    console.log("Respuesta:", result.data);
    return result.data;
  }
}

export const registerService = new RegisterService();