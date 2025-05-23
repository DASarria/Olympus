

import { useRouter } from "next/router";
import React, { useState } from "react";
import login from "@/pages/api/UserManagement/LoginService"
import ErrorMessage from "@/components/ErrorMessage";


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
    
    console.log("Intentando iniciar sesión con:", { userName, password });
    
    try {
      const loginResponse:response = await login({ userName, password });
      console.log("Respuesta del servidor:", loginResponse);
      
      // Check if loginResponse exists before accessing its properties
      if(loginResponse && loginResponse.status === "200"){
        sessionStorage.setItem("token", loginResponse.data.token);
        // Normaliza el rol a mayúsculas antes de guardarlo
        sessionStorage.setItem("role", loginResponse.data.role.toUpperCase());
        router.push("/Dashboard");
      }
      else if(loginResponse && loginResponse.status === "400"){
        setErrorMessage(loginResponse.message)
      }
      else {
        // Handle case where loginResponse exists but has unexpected status
        setErrorMessage("Error de autenticación. Respuesta inesperada del servidor.");
        console.error("Respuesta inesperada:", loginResponse);
      }
    } catch (error) {
      console.error("Error durante el login:", error);
      setErrorMessage("Error de conexión con el servidor");
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
