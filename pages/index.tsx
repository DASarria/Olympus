import { useRouter } from "next/router";

const Index = () => {
  const router = useRouter();
  const role = "admin"; // Esto deberia cambiar cuando usen el 
                        //login aqui, realmente deberia llamarse User o algo asi para guardar toda esa informacion

  const handleLogin = () => {
    sessionStorage.setItem("role", role);
    router.push("/Dashboard");
  }

  const handleTurnos = () => {
    router.push("/TurnosMenu");
  }

  return (
    <div className="flex gap-4"> {/* Añadí flex y gap para separar los botones */}
      <button 
        className="border-1 rounded px-4 py-2 bg-blue-500 text-white"
        onClick={handleLogin}
      >
        Login
      </button>
      
      <button 
        className="border-1 rounded px-4 py-2 bg-green-500 text-white"
        onClick={handleTurnos}
      >
        Apartado Turnos
      </button>
    </div>
  );
};

export default Index;