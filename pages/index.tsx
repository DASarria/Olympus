import {useRouter} from "next/router";

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
  const role = "admin"; // Esto deberia cambiar cuando usen el 
                        //login aqui, realmente deberia llamarse User o algo asi para guardar toda esa informacion

  const handleLogin = () => {
    sessionStorage.setItem("role", role);
    
    router.push("/Dashboard");
  }
  return (
    <div>
      <button className="border-1 rounded"
        onClick={handleLogin}>Login</button>
    </div>
  );

};

export default Index;