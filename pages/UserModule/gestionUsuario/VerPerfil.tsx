import { useEffect, useState } from "react";
import styles from "@/components/gestionUsuario/styles.module.css";
import { consultarUsuarios } from "@/pages/api/UserManagement//UserService";
import { Return } from "@/components/Return";
import CampoTexto from "@/components/gestionUsuario/CampoTexto";
import RectanguloConTexto from "@/components/gestionUsuario/RectanguloConTexto";
import { jwtDecode } from "jwt-decode";

const VerPerfil = () => {
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

  type MiToken = {
    id: string;
    [key: string]: any;
  };

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

      const filtrosConSoloUno = { id: idUsuario };

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

          alert("Consulta realizada con éxito");
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
              <CampoTexto etiqueta="Nombre" valor={datos.nombre} soloLectura={true} marcador="" onChange={() => { }} />,
              <CampoTexto etiqueta="Correo" valor={datos.correo} soloLectura={true} marcador="" onChange={() => { }} />,
              <CampoTexto etiqueta="Tipo de documento" valor={datos.tipoId} soloLectura={true} marcador="" onChange={() => { }} />,
              <CampoTexto etiqueta="Número de documento" valor={datos.doc} soloLectura={true} marcador="" onChange={() => { }} />,
              <CampoTexto etiqueta="Programa académico" valor={datos.programa} soloLectura={true} marcador="" onChange={() => { }} />,
              <CampoTexto etiqueta="Carnet estudiantil" valor={datos.carnet} soloLectura={true} marcador="" onChange={() => { }} />,
              <CampoTexto etiqueta="Número telefónico" valor={datos.tel} soloLectura={true} marcador="" onChange={() => { }} />,
              <CampoTexto etiqueta="Dirección" valor={datos.dir} soloLectura={true} marcador="" onChange={() => { }} />
              ].map((comp, i) => (
                <div key={i} style={{ flex: `1 1 ${i >= 6 ? "32.8%" : "calc(50% - 20px)"}`, minWidth: "200px" }}>
                    {comp}
                </div>
              ))}
            </div>
          </RectanguloConTexto>

          <div style={{ marginTop: "30px" }}>
          <RectanguloConTexto texto="Contacto de emergencia">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 40px", width: "100%" }}>
              {[
              <CampoTexto etiqueta="Nombre" valor={datos.contactoNombre} soloLectura={true} marcador="" onChange={() => { }} />,
              <CampoTexto etiqueta="Relación" valor={datos.contactoRelacion} soloLectura={true} marcador="" onChange={() => { }} />,
              
              ].map((comp, i) => (
                <div key={i} style={{ flex: `1 1 ${i >= 6 ? "32.8%" : "calc(50% - 20px)"}`, minWidth: "200px" }}>
                    {comp}
                </div>
              ))}

              {[
              <CampoTexto etiqueta="Tipo de documento" valor={datos.contactoTipoId} soloLectura={true} marcador="" onChange={() => { }} />,
              <CampoTexto etiqueta="Número de documento" valor={datos.contactoDoc} soloLectura={true} marcador="" onChange={() => { }} />,
              <CampoTexto etiqueta="Número telefónico" valor={datos.contactoTel} soloLectura={true} marcador="" onChange={() => { }} />,
              ].map((comp, i) => (
                <div key={i} style={{ flex: `1 1 ${i >= 2 ? "30.0%" : "calc(30% - 20px)"}`, minWidth: "200px" }}>
                    {comp}
                </div>
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
            <CampoTexto etiqueta="ID Admin" valor={datos.doc} soloLectura={true} marcador="" onChange={() => { }} />,
            <CampoTexto etiqueta="Tipo de documento" valor={datos.tipoId} soloLectura={true} marcador="" onChange={() => { }} />,
            <CampoTexto etiqueta="Nombre completo" valor={datos.nombre} soloLectura={true} marcador="" onChange={() => { }} />,
            <CampoTexto etiqueta="Rol" valor={datos.role} soloLectura={true} marcador="" onChange={() => { }} />,
            <CampoTexto etiqueta="Correo" valor={datos.correo} soloLectura={true} marcador="" onChange={() => { }} />,
            <CampoTexto etiqueta="Teléfono" valor={datos.tel} soloLectura={true} marcador="" onChange={() => { }} />
            ].map((comp, i) => (
                <div key={i} style={{ flex: `1 1 ${i >= 6 ? "32.8%" : "calc(50% - 20px)"}`, minWidth: "200px" }}>
                    {comp}
                </div>
              ))}
          </div>
        </RectanguloConTexto>
      )}
    <div style={{ height: "80px" }}></div>
    </div>
    
  );
};

export default VerPerfil;
