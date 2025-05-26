import { useRouter } from "next/router";
import { useEffect } from "react";
import { NavBtn } from "@/components/NavBtn";
import Horario from "@/assets/images/UserModule/horario.png";
import Usuario from "@/assets/images/UserModule/usuarios.webp";
import EditUser from "@/assets/images/CrearUser.jpg";

const Module6 = () => {
  const router = useRouter();
  const role: string = "ADMIN";

  useEffect(() => {
    // Validación si es necesaria
  }, [role, router]);

  return (
    <>
      <div className="flex flex-col w-full items-start p-6 mb-4 bg-[#990000] rounded-2xl">
        <h2 className="text-white text-2xl font-semibold mb-2">
          MODULO DE GESTIÓN DE USUARIOS Y HORARIOS
        </h2>
        <p className="text-white text-base">
          Realiza el registro, modificación y eliminación de usuarios, también realiza el manejo de configuraciones para los distintos servicios.
        </p>
      </div>

      <div className="flex flex-wrap items-start gap-[10px_10px] relative">
        {role === "ADMIN" && (
          <>
            <NavBtn
              image={{ src: Usuario.src }}
              texto="Agregar usuario"
              navigate="/UserModule/gestionUsuario/CrearUsuario"
            />
            <NavBtn
              image={{ src: EditUser.src }}
              texto="Editar usuario"
              navigate="/UserModule/gestionUsuario/EditarUsuario"
            />
            <NavBtn
              image={{ src: Horario.src }}
              texto="Gestión de horarios"
              navigate="/UserModule/ScheduleManagement/SchedulePage"
            />
          </>
        )}
      </div>
    </>
  );
};

export default Module6;

