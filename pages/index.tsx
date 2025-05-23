
import { useRouter } from "next/router";
import React, { useState } from "react";
import login from "@/pages/api/UserManagement/LoginService"
import ErrorMessage from "@/components/ErrorMessage";


// Tipos para los componentes de la aplicación

export interface Routine {
  id: number;
  title: string;
  series: number;
  repetitions: number;
}

export interface User {
  name: string;
  initials: string;
}


const Index = () => {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  interface LogDTO{
    fullname:string;
    role:string;
    token:string;
  }
  interface response{
    status:string;
    message:string;
    data:LogDTO;
  }
  
  
  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); 
    
    const loginResponse:response = await login({ userName, password });
    if(loginResponse.status== "200"){
      sessionStorage.setItem("token", loginResponse.data.token);
      sessionStorage.setItem("role", loginResponse.data.role);
      router.push("/Dashboard");
    }
    if(loginResponse.status == "400"){
      setErrorMessage(loginResponse.message)
    }
  };

  const handleCloseError = () => {
    setErrorMessage(null);  
  };


  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div
        className="bg-red-800 border border-red-900 text-white p-8 rounded-2xl shadow-xl w-80"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-white">Usuario</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-3 py-2 border border-red-900 rounded focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-black"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium text-white">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-red-900 rounded focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-black"
            required
          />
        </div>

        <button
          className="w-full bg-white text-red-800 font-semibold py-2 rounded-lg hover:border-2 hover:border-red-900 transition"
          onClick = {handleLogin}
        >
          Entrar
        </button>
      </div>
      
      {errorMessage && (
        <ErrorMessage message={errorMessage} onClose={handleCloseError} />
      )}

    </div>
  );

};

export default Index;
