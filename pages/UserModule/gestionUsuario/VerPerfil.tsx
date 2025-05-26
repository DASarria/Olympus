import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { consultarUsuarios } from "@/pages/api/UserManagement//UserService";
import { Return } from "@/components/Return";
import CampoTexto from "@/components/gestionUsuario/CampoTexto";
import RectanguloConTexto from "@/components/gestionUsuario/RectanguloConTexto";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";

const VerPerfil = () => {
  const router = useRouter();
  const [datos, setDatos] = useState({
    tipoUsuario: "",
    nombre: "",
    correo: "",
    tipoId: "",
    doc: "",
    programa: "",
    carnet: "",
    tel: "",
    dir: "",
    contactoNombre: "",
    contactoRelacion: "",
    contactoTipoId: "",
    contactoDoc: "",
    contactoTel: "",
    role: "",
  });

  interface FiltrosUsuario {
    academicProgram: string | null;
    codeStudent: string | null;
    userName: string | null;
    fullName: string | null;
    role: string | null;
    id: string | null;
  }

  // ✅ Tipo del token JWT corregido
  interface MiToken {
    id: string;
    exp?: number;
    iat?: number;
    [key: string]: unknown;
  }

  function changePassword() {
    router.push("/UserModule/gestionUsuario/ChangePasswordPage");
  }

  useEffect(() => {
    const fetchData = async () => {
      const tokenConBearer = sessionStorage.getItem("token");

      if (!tokenConBearer) {
        console.error("No hay token en sessionStorage");
        return;
      }

      const token = tokenConBearer.replace("Bearer ", "");
      const decoded = jwtDecode<MiToken>(token);
      const idUsuario = decoded.id;

      const filtrosConSoloUno: FiltrosUsuario = {
        academicProgram: null,
        codeStudent: null,
        userName: null,
        fullName: null,
        role: null,
        id: idUsuario,
      };

      try {
        const res = await consultarUsuarios(filtrosConSoloUno);
        if (res && res.length > 0) {
          const u = res[0];
          setDatos({
            tipoUsuario: u.role === "ADMIN" ? "Administrador" : "Usuario",
            nombre: u.fullName || "",
            correo: u.userName || "",
            tipoId: u.typeIdStudent || "CC",
            doc: u.id || "",
            programa: u.academicProgram || "",
            carnet: u.codeStudent || "",
            tel: u.contactNumber || "",
            dir: u.address || "",
            contactoNombre: u.fullNameContact || "",
            contactoRelacion: u.relationship || "",
            contactoTipoId: u.typeIdContact || "",
            contactoDoc: u.idContact || "",
            contactoTel: u.phoneNumber || "",
            role: u.role || "",
          });
        } else {
          alert("Usuario no encontrado");
        }
      } catch (e) {
        console.error(e);
        alert("Error al consultar usuarios");
      }
    };

    fetchData();
  }, []);


  return (
    <div style={{ padding: "20px", fontFamily: "'Open Sans', sans-serif" }}>
      <Return
        className="!self-stretch !flex-[0_0_auto] !w-full mb-6"
        text="Perfil de usuario"
        returnPoint="/Module6"
      />

      {datos.tipoUsuario === "Usuario" && (
        <>
          <RectanguloConTexto texto="Información Personal">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 40px", width: "100%" }}>
              {[
              {key: "Nombre", comp: (
              <CampoTexto etiqueta="Nombre" valor={datos.nombre} soloLectura={true} marcador="" onChange={() => { }}/>),},
              {key: "Correo", comp: (
              <CampoTexto etiqueta="Correo" valor={datos.correo} soloLectura={true} marcador="" onChange={() => { }}/>),},
              {key: "TipoDocumento", comp: (
              <CampoTexto etiqueta="Tipo de documento" valor={datos.tipoId} soloLectura={true} marcador="" onChange={() => { }}/>),},
              {key: "NumeroDocumento", comp: (
              <CampoTexto etiqueta="Número de documento" valor={datos.doc} soloLectura={true} marcador="" onChange={() => { }}/>),},
              {key: "ProgramaAcadémico", comp: (
              <CampoTexto etiqueta="Programa académico" valor={datos.programa} soloLectura={true} marcador="" onChange={() => { }}/>),},
              {key: "CarnetEstudiantil", comp: (
              <CampoTexto etiqueta="Carnet estudiantil" valor={datos.carnet} soloLectura={true} marcador="" onChange={() => { }}/>),},
              {key: "NumeroTelefónico", comp: (
              <CampoTexto etiqueta="Número telefónico" valor={datos.tel} soloLectura={true} marcador="" onChange={() => { }}/>),},
              {key: "Dirección", comp: (
              <CampoTexto etiqueta="Dirección" valor={datos.dir} soloLectura={true} marcador="" onChange={() => { }}/>),},
              ].map(({ key, comp }, i) => (<div key={`Usuario-${key}`} style={{ flex: `1 1 ${i >= 2 ? "32.8%" : "calc(50% - 20px)"}`, minWidth: "200px",}}>{comp}</div>
              ))}
            </div>
          </RectanguloConTexto>

          <div style={{ marginTop: "30px" }}>
          <RectanguloConTexto texto="Contacto de emergencia">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 40px", width: "100%" }}>
              {[
              {key: "Nombre", comp: (
              <CampoTexto etiqueta="Nombre" valor={datos.contactoNombre} soloLectura={true} marcador="" onChange={() => { }}/>),},
              {key: "Relación", comp: (
              <CampoTexto etiqueta="Relación" valor={datos.contactoRelacion} soloLectura={true} marcador="" onChange={() => { }}/>),},
              ].map(({ key, comp }, i) => (<div key={`contactoEmergencia-${key}`} style={{ flex: `1 1 ${i >= 2 ? "32.8%" : "calc(50% - 20px)"}`, minWidth: "200px",}}>{comp}</div>
              ))}

              {[
              {key: "Tipo de documento", comp: (
              <CampoTexto etiqueta="Tipo de documento" valor={datos.contactoTipoId} soloLectura={true} marcador="" onChange={() => { }}/>),},
              {key: "Número de documento", comp: (
              <CampoTexto etiqueta="Número de documento" valor={datos.contactoDoc} soloLectura={true} marcador="" onChange={() => { }}/>),},
              {key: "Número telefónico", comp: (
              <CampoTexto etiqueta="Número telefónico" valor={datos.contactoTel} soloLectura={true} marcador="" onChange={() => { }}/>),},
              ].map(({ key, comp }, i) => (<div key={`contactoEmergencia-${key}`} style={{ flex: `1 1 ${i >= 2 ? "32.8%" : "calc(50% - 20px)"}`, minWidth: "200px",}}>{comp}</div>
              ))}

            </div>
          </RectanguloConTexto>
          </div>
        </>
      )}

      {datos.tipoUsuario === "Administrador" && (
        <RectanguloConTexto texto="Información Personal">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 40px", width: "100%" }}>
            {[
            {key: "ID Admin", comp: (
            <CampoTexto etiqueta="ID Admin" valor={datos.doc} soloLectura={true} marcador="" onChange={() => { }}/>),},
            {key: "Tipo de documento", comp: (
            <CampoTexto etiqueta="Tipo de documento" valor={datos.tipoId} soloLectura={true} marcador="" onChange={() => { }}/>),},
            {key: "Nombre completo", comp: (
            <CampoTexto etiqueta="Nombre completo" valor={datos.nombre} soloLectura={true} marcador="" onChange={() => { }}/>),},
            {key: "Rol", comp: (
            <CampoTexto etiqueta="Rol" valor={datos.role} soloLectura={true} marcador="" onChange={() => { }}/>),},
            {key: "Correo", comp: (
            <CampoTexto etiqueta="Correo" valor={datos.correo} soloLectura={true} marcador="" onChange={() => { }}/>),},
            {key: "Teléfono", comp: (
            <CampoTexto etiqueta="Teléfono" valor={datos.tel} soloLectura={true} marcador="" onChange={() => { }}/>),},
            ].map(({ key, comp }, i) => (<div key={`Admin-${key}`} style={{ flex: `1 1 ${i >= 2 ? "32.8%" : "calc(50% - 20px)"}`, minWidth: "200px",}}>{comp}</div>
              ))}
          </div>
          <div
            style={{marginTop:"20px"}}
          >
            <motion.div
              whileHover={{
                scale: 1.005,
                transition: { duration: 0.15 },
              }}
            >
              <button
                onClick = {changePassword}
                style={{
                  backgroundColor: "#990000",
                  color: "#ffffff",
                  fontFamily: "'Open Sans', sans-serif",
                  borderRadius: "16px",
                  padding: "10px 20px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "20px",
                  whiteSpace: "nowrap",
                }}
              >
                Cambiar contraseña
              </button>
            </motion.div>
          </div>
        </RectanguloConTexto>
      )}
    
    </div>
    
  );
};

export default VerPerfil;
