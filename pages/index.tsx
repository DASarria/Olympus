import { useRouter } from "next/router";
import { useState } from "react";

const Index = () => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState("ADMIN");

  const handleLogin = () => {
    // Guardar el rol seleccionado en sessionStorage
    sessionStorage.setItem("role", selectedRole);
    
    // Simular un token JWT (solo para pruebas)
    const tokens = {
      ADMIN: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwMDAwMDAwIiwidXNlck5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AZXNjdWVsYWluZy5lZHUuY28iLCJuYW1lIjoiQURNSU5JU1RSQURPUiIsInJvbGUiOiJBRE1JTiIsImV4cCI6MTc0Nzc5Mzc3Nn0.token-simulado",
      STUDENT: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIwMDAwMDAwIiwidXNlck5hbWUiOiJlc3R1ZGlhbnRlIiwiZW1haWwiOiJlc3R1ZGlhbnRlQGVzY3VlbGFpbmcuZWR1LmNvIiwibmFtZSI6IkVTVFVESUFOVEUiLCJyb2xlIjoiU1RVREVOVCIsImV4cCI6MTc0Nzc5Mzc3Nn0.token-simulado",
      TEACHER: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMwMDAwMDAwIiwidXNlck5hbWUiOiJwcm9mZXNvciIsImVtYWlsIjoicHJvZmVzb3JAZXNjdWVsYWluZy5lZHUuY28iLCJuYW1lIjoiUFJPRkVTT1IiLCJyb2xlIjoiVEVBQ0hFUiIsImV4cCI6MTc0Nzc5Mzc3Nn0.token-simulado"
    };
    
    sessionStorage.setItem("token", tokens[selectedRole as keyof typeof tokens]);
    
    // Redirigir al Dashboard
    router.push("/Dashboard");
  }
  
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="bg-red-800 border border-red-900 text-white p-8 rounded-2xl shadow-xl w-80">
        <h2 className="text-2xl font-bold text-center mb-6">Modo de Prueba</h2>
        
        <div className="mb-6">
          <label className="block mb-2 font-medium">Seleccionar Rol:</label>
          <select 
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full px-3 py-2 border border-red-900 rounded focus:outline-none bg-white text-black"
          >
            <option value="ADMIN">Administrador</option>
            <option value="STUDENT">Estudiante</option>
            <option value="TEACHER">Profesor</option>
          </select>
        </div>
        
        <button
          className="w-full bg-white text-red-800 font-semibold py-2 rounded-lg hover:border-2 hover:border-red-900 transition"
          onClick={handleLogin}
        >
          Entrar como {selectedRole === "ADMIN" ? "Administrador" : selectedRole === "STUDENT" ? "Estudiante" : "Profesor"}
        </button>
      </div>
    </div>
  );
};

export default Index;