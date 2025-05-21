import { useState } from "react";
import axios from "axios";
import styles from "@/components/gestionUsuario/styles.module.css";


import { Return } from "@/components/Return";
import { withRoleProtection } from "@/hoc/withRoleProtection";
import CampoSelect from "@/components/gestionUsuario/CampoSelect";
import CampoTexto from "@/components/gestionUsuario/CampoTexto";
import RectanguloConTexto from "@/components/gestionUsuario/RectanguloConTexto";



const CrearUsuario = () => {

  const opcionesRol = ["ADMIN", "SALA_ADMIN", "TRAINER", "MEDICAL_SECRETARY", "DOCTOR", "TEACHER", "EXTRACURRICULAR_TEACHER", "BIENESTAR"];
  const especialidades = ["GENERAL_MEDICINE", "DENTIST" , "PSYCHOLOGY"];

  const [datos, setDatos] = useState({
    tipoUsuario: "", 

    nombre: "",
    correo: "",
    tipoId: "",
    doc: "",
    programa: "",
    carnet: "",
    tel: "",
    cumple: "",
    dir: "",
    contactoNombre: "",
    contactoRelacion: "",
    contactoTipoId: "",
    contactoDoc: "",
    contactoTel: "",

    especialidad: "",
    rol: "",
    contrasena: "",
  });

  const handleSubmit = async () => {
  try {
    let res;

    if (datos.tipoUsuario === "Usuario") {
      const payload = {
        codeStudent: datos.carnet,
        studentPassword: datos.doc,
        fullNameStudent: datos.nombre,
        academicProgram: datos.programa,
        emailAddress: datos.correo,
        contactNumber: datos.tel,
        birthDate: datos.cumple,
        address: datos.dir,
        typeIdStudent: datos.tipoId,
        idStudent: datos.doc,
        idContact: datos.contactoDoc,
        typeIdContact: datos.contactoTipoId,
        fullNameContact: datos.contactoNombre,
        phoneNumber: datos.contactoTel,
        relationship: datos.contactoRelacion,
      };

      res = await axios.post("http://localhost:8080/authentication/student", payload);
      alert("Usuario creado: " + res.data.message);
      return;

    } else if (datos.tipoUsuario === "Administrador") {
      const payload = {
        idAdmin: datos.doc,
        typeId: datos.tipoId,
        fullName: datos.nombre,
        specialty: datos.especialidad,
        role: datos.rol,
        emailAddress: datos.correo,
        contactNumber: datos.tel,
        adminPassword: datos.doc,
        schedule: [],
      };

      res = await axios.post("http://localhost:8080/authentication/admin", payload);
      alert("Usuario creado: " + res.data.message);
      return;
    }

  } catch (e) {
    console.error(e);
    alert("Error al crear usuario");
  }
};


  return (
    <div style={{ padding: "20px", fontFamily: "'Open Sans', sans-serif" }}>
      <Return
        className="!self-stretch !flex-[0_0_auto] !w-full mb-6"
        text="Crear usuario"
        returnPoint="/Module6"
      />

      <RectanguloConTexto texto="Tipo de usuario">
        <div
          style={{display: "flex", flexWrap: "wrap", gap: "5px 40px", width: "100%", boxSizing: "border-box",}}
        >
          {[
            <CampoSelect etiqueta="Tipo de usuario" marcador="Seleccione tipo de usuario" opciones={["Usuario", "Administrador"]} 
              valor={datos.tipoUsuario} onChange={(v) => setDatos({ ...datos, tipoUsuario: v })} />,

          ].map((comp, i) => (
            <div key={i} style={{ flex: `1 1 ${i >= 6 ? "32.8%" : "calc(50% - 20px)"}`, minWidth: "200px" }}>
              {comp}
            </div>
          ))}
        </div>
      </RectanguloConTexto>


      {datos.tipoUsuario=== "Usuario" && (
      <div style={{ marginTop: "30px" }}>
      <RectanguloConTexto texto="Información Personal">
        <div
          style={{display: "flex", flexWrap: "wrap", gap: "5px 40px", width: "100%", boxSizing: "border-box", marginTop: "30px",}}
        >
          {[
            <CampoTexto etiqueta="Nombre" marcador="Digite nombre completo" 
              valor={datos.nombre} onChange={(v) => setDatos({ ...datos, nombre: v })} />,

            <CampoTexto etiqueta="Correo" marcador="Digite correo electrónico del estudiante" 
              valor={datos.correo} onChange={(v) => setDatos({ ...datos, correo: v })} />,

            <CampoSelect etiqueta="Tipo de documento" marcador="Seleccione tipo de documento" opciones={["CC", "TI"]} 
              valor={datos.tipoId} onChange={(v) => setDatos({ ...datos, tipoId: v })} />,

            <CampoTexto etiqueta="Número de documento" marcador="Digite número de documento" 
              valor={datos.doc} onChange={(v) => setDatos({ ...datos, doc: v })} />,

            <CampoSelect etiqueta="Programa académico" marcador="Seleccione programa académico" 
              opciones={["Ingeniería de Sistemas", "Ingeniería Electrónica", "Ingeniería Mecánica", "Ingeniería Eléctrica", "Matemática", "Estadística", "Ingeniería Biomédica"]} 
              valor={datos.programa} onChange={(v) => setDatos({ ...datos, programa: v })} />,

            <CampoTexto etiqueta="Carnet estudiantil" marcador="Digite número de Carnet estudiantil" 
              valor={datos.carnet} onChange={(v) => setDatos({ ...datos, carnet: v })} />,

            <CampoTexto etiqueta="Número telefónico" marcador="Digite número telefónico" 
              valor={datos.tel} onChange={(v) => setDatos({ ...datos, tel: v })} />,

            <CampoTexto etiqueta="Cumpleaños" marcador="YYYY-MM-DD" 
              valor={datos.cumple} onChange={(v) => setDatos({ ...datos, cumple: v })} />,

            <CampoTexto etiqueta="Dirección" marcador="Digite dirección" 
              valor={datos.dir} onChange={(v) => setDatos({ ...datos, dir: v })} />,

          ].map((comp, i) => (
            <div key={i} style={{ flex: `1 1 ${i >= 6 ? "32.8%" : "calc(50% - 20px)"}`, minWidth: "200px" }}>
              {comp}
            </div>
          ))}
        </div>
      </RectanguloConTexto>
      </div>
      )}


      {datos.tipoUsuario === "Usuario" && (
      <div style={{ marginTop: "30px" }}>
        <RectanguloConTexto texto="Contacto de emergencia">
          <div
            style={{display: "flex", flexWrap: "wrap", gap: "5px 40px", width: "100%", boxSizing: "border-box",}}
          >
            {[
              <CampoTexto etiqueta="Nombre" marcador="Digite nombre completo" 
                valor={datos.contactoNombre} onChange={(v) => setDatos({ ...datos, contactoNombre: v })} />,

              <CampoTexto etiqueta="Relación" marcador="Digite relación con el estudiante" 
                valor={datos.contactoRelacion} onChange={(v) => setDatos({ ...datos, contactoRelacion: v })} />,

              <CampoSelect etiqueta="Tipo de documento" marcador="Seleccione tipo de documento" opciones={["CC", "TI"]} 
                valor={datos.contactoTipoId} onChange={(v) => setDatos({ ...datos, contactoTipoId: v })} />,

              <CampoTexto etiqueta="Número de documento" marcador="Digite número de documento" 
                valor={datos.contactoDoc} onChange={(v) => setDatos({ ...datos, contactoDoc: v })} />,

              <CampoTexto etiqueta="Número telefónico" marcador="Digite número telefónico" 
                valor={datos.contactoTel} onChange={(v) => setDatos({ ...datos, contactoTel: v })} />,

            ].map((comp, i) => (
              <div key={i} style={{ flex: `1 1 ${i >= 2 ? "32.8%" : "calc(50% - 20px)"}`, minWidth: "200px" }}>
                {comp}
              </div>
            ))}
          </div>
        </RectanguloConTexto>
      </div>
      )}

      {datos.tipoUsuario=== "Administrador" && (
  <div style={{ marginTop: "30px" }}>
    <RectanguloConTexto texto="Información del Administrador">
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: "5px 40px", width: "100%", boxSizing: "border-box" }}
      >
        {[
          <CampoTexto etiqueta="ID Admin" marcador="Digite ID" 
            valor={datos.doc} onChange={(v) => setDatos({ ...datos, doc: v })} />,

          <CampoSelect etiqueta="Tipo de documento" marcador="Seleccione tipo" opciones={["CC", "TI"]} 
            valor={datos.tipoId} onChange={(v) => setDatos({ ...datos, tipoId: v })} />,

          <CampoTexto etiqueta="Nombre completo" marcador="Digite nombre" 
            valor={datos.nombre} onChange={(v) => setDatos({ ...datos, nombre: v })} />,

          <CampoSelect etiqueta="Rol" marcador="Seleccione rol" opciones={opcionesRol}
            valor={datos.rol} onChange={(v) => setDatos({ ...datos, rol: v })} />,

          <CampoTexto etiqueta="Correo" marcador="Digite correo" 
            valor={datos.correo} onChange={(v) => setDatos({ ...datos, correo: v })} />,

          <CampoTexto etiqueta="Teléfono" marcador="Digite teléfono" 
            valor={datos.tel} onChange={(v) => setDatos({ ...datos, tel: v })} />,

          datos.rol === "DOCTOR" && (
          <CampoSelect etiqueta="Especialidad" marcador="Digite especialidad" opciones={especialidades}
            valor={datos.especialidad} onChange={(v) => setDatos({ ...datos, especialidad: v })} />),

        ].map((comp, i) => (
          <div key={i} style={{ flex: "1 1 calc(50% - 20px)", minWidth: "200px" }}>
            {comp}
          </div>
        ))}
      </div>
    </RectanguloConTexto>
  </div>
)}

      <div style={{ width: "90%", margin: "30px auto 60px" }}>
        <button onClick={handleSubmit} className={styles.boton}>
          Crear Usuario
        </button>
      </div>
    </div>

    


  );
};

export default withRoleProtection(["USER", "TRAINER"], "/Module6")(CrearUsuario);