import { useState } from "react";

import { Return } from "@/components/Return";
import CampoSelect from "@/components/gestionUsuario/CampoSelect";
import CampoTexto from "@/components/gestionUsuario/CampoTexto";
import RectanguloConTexto from "@/components/gestionUsuario/RectanguloConTexto";

import {
  crearUsuarioEstudiante,
  crearUsuarioAdministrador,
} from "@/pages/api/UserManagement/UserService";

const CrearUsuario = () => {
  const opcionesRol = [
    "ADMIN", "SALA_ADMIN", "TRAINER", "MEDICAL_SECRETARY", 
    "DOCTOR", "TEACHER", "EXTRACURRICULAR_TEACHER", "BIENESTAR"
  ];
  //const especialidades = ["GENERAL_MEDICINE", "DENTIST", "PSYCHOLOGY"];

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
        res = await crearUsuarioEstudiante(datos);
      } else if (datos.tipoUsuario === "Administrador") {
        res = await crearUsuarioAdministrador(datos);
      }
      alert("Usuario creado: " + res.message);
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
        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 40px", width: "100%", boxSizing: "border-box" }}>
          <div style={{ flex: "1 1 calc(50% - 20px)", minWidth: "200px" }}>
            <CampoSelect
              etiqueta="Tipo de usuario"
              marcador="Seleccione tipo de usuario"
              opciones={["Usuario", "Administrador"]}
              valor={datos.tipoUsuario}
              onChange={(v) => setDatos({ ...datos, tipoUsuario: v })}
            />
          </div>
        </div>
      </RectanguloConTexto>

      {datos.tipoUsuario === "Usuario" && (
        <div style={{ marginTop: "30px" }}>
          <RectanguloConTexto texto="Información Personal">
  <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 40px", width: "100%", boxSizing: "border-box", marginTop: "30px" }}>
    {[
      {
        key: "nombre",
        componente: (
          <CampoTexto
            etiqueta="Nombre"
            marcador="Digite nombre completo"
            valor={datos.nombre}
            onChange={(v) => setDatos({ ...datos, nombre: v })}
          />
        )
      },
      {
        key: "correo",
        componente: (
          <CampoTexto
            etiqueta="Correo"
            marcador="Digite correo electrónico del estudiante"
            valor={datos.correo}
            onChange={(v) => setDatos({ ...datos, correo: v })}
          />
        )
      },
      {
        key: "tipoId",
        componente: (
          <CampoSelect
            etiqueta="Tipo de documento"
            marcador="Seleccione tipo de documento"
            opciones={["CC", "TI"]}
            valor={datos.tipoId}
            onChange={(v) => setDatos({ ...datos, tipoId: v })}
          />
        )
      },
      {
        key: "doc",
        componente: (
          <CampoTexto
            etiqueta="Número de documento"
            marcador="Digite número de documento"
            valor={datos.doc}
            onChange={(v) => setDatos({ ...datos, doc: v })}
          />
        )
      },
      {
        key: "programa",
        componente: (
          <CampoSelect
            etiqueta="Programa académico"
            marcador="Seleccione programa académico"
            opciones={[
              "Ingeniería de Sistemas","Administración de Empresas", "Economía" ,"Ingeniería Industrial","Ingeniería Civil","Ingeniería Electrónica", "Ingeniería Mecánica",
                  "Ingeniería Eléctrica", "Matemática", "Estadística", "Ingeniería Biomédica"
            ]}
            valor={datos.programa}
            onChange={(v) => setDatos({ ...datos, programa: v })}
          />
        )
      },
      {
        key: "carnet",
        componente: (
          <CampoTexto
            etiqueta="Carnet estudiantil"
            marcador="Digite número de Carnet estudiantil"
            valor={datos.carnet}
            onChange={(v) => setDatos({ ...datos, carnet: v })}
          />
        )
      },
      {
        key: "tel",
        componente: (
          <CampoTexto
            etiqueta="Número telefónico"
            marcador="Digite número telefónico"
            valor={datos.tel}
            onChange={(v) => setDatos({ ...datos, tel: v })}
          />
        )
      },
      {
        key: "cumple",
        componente: (
          <CampoTexto
            etiqueta="Cumpleaños"
            marcador="YYYY-MM-DD"
            valor={datos.cumple}
            onChange={(v) => setDatos({ ...datos, cumple: v })}
          />
        )
      },
      {
        key: "dir",
        componente: (
          <CampoTexto
            etiqueta="Dirección"
            marcador="Digite dirección"
            valor={datos.dir}
            onChange={(v) => setDatos({ ...datos, dir: v })}
          />
        )
      },
    ].map(({ key, componente }, i) => (
      <div
        key={`infoPersonal-${key}`}
        style={{ flex: `1 1 ${i >= 6 ? "32.8%" : "calc(50% - 20px)"}`, minWidth: "200px" }}
      >
        {componente}
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
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "5px 40px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {[
          {key: "contactoNombre", comp: (
              <CampoTexto etiqueta="Nombre" marcador="Digite nombre completo" 
              valor={datos.contactoNombre} onChange={(v) => setDatos({ ...datos, contactoNombre: v })}/>),
          },

          {
            key: "contactoRelacion",
            comp: (
              <CampoTexto
                etiqueta="Relación"
                marcador="Digite relación con el estudiante"
                valor={datos.contactoRelacion}
                onChange={(v) => setDatos({ ...datos, contactoRelacion: v })}
              />
            ),
          },
          {
            key: "contactoTipoId",
            comp: (
              <CampoSelect
                etiqueta="Tipo de documento"
                marcador="Seleccione tipo de documento"
                opciones={["CC", "TI"]}
                valor={datos.contactoTipoId}
                onChange={(v) => setDatos({ ...datos, contactoTipoId: v })}
              />
            ),
          },
          {
            key: "contactoDoc",
            comp: (
              <CampoTexto
                etiqueta="Número de documento"
                marcador="Digite número de documento"
                valor={datos.contactoDoc}
                onChange={(v) => setDatos({ ...datos, contactoDoc: v })}
              />
            ),
          },
          {key: "contactoTel", comp: (
              <CampoTexto etiqueta="Número telefónico" marcador="Digite número telefónico" valor={datos.contactoTel} onChange={(v) => setDatos({ ...datos, contactoTel: v })}/>),},

        ].map(({ key, comp }, i) => (<div key={`contactoEmergencia-${key}`} style={{ flex: `1 1 ${i >= 2 ? "32.8%" : "calc(50% - 20px)"}`, minWidth: "200px",}}>{comp}</div>

        ))}
        
      </div>
    </RectanguloConTexto>
  </div>
)}


      {datos.tipoUsuario === "Administrador" && (
        <div style={{ marginTop: "30px" }}>
          <RectanguloConTexto texto="Información del Administrador">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 40px", width: "100%", boxSizing: "border-box" }}>
              {[
                {key: "idAdmin", comp: (
                <CampoTexto etiqueta="ID Admin" marcador="Digite ID" valor={datos.doc} onChange={(v) => setDatos({ ...datos, doc: v })}/>),},
                {key: "tipoIdAdmin", comp: (
                <CampoSelect etiqueta="Tipo de documento" marcador="Seleccione tipo" opciones={["CC", "TI"]} valor={datos.tipoId} onChange={(v) => setDatos({ ...datos, tipoId: v })}/>),},
                {key: "NombreAdmin", comp: (
                <CampoTexto etiqueta="Nombre completo" marcador="Digite nombre" valor={datos.nombre} onChange={(v) => setDatos({ ...datos, nombre: v })}/>),},
                {key: "RolAdmin", comp: (
                <CampoSelect etiqueta="Rol" marcador="Seleccione rol" opciones={opcionesRol} valor={datos.rol} onChange={(v) => setDatos({ ...datos, rol: v })}/>),},
                {key: "CorreoAdmin", comp: (
                <CampoTexto etiqueta="Correo" marcador="Digite correo" valor={datos.correo} onChange={(v) => setDatos({ ...datos, correo: v })}/>),},
                {key: "TelefonoAdmin", comp: (
                <CampoTexto etiqueta="Teléfono" marcador="Digite teléfono" valor={datos.tel} onChange={(v) => setDatos({ ...datos, tel: v })}/>),},
                ].map(({ key, comp }, i) => (<div key={`administrador-${key}`} style={{ flex: `1 1 ${i >= 2 ? "32.8%" : "calc(50% - 20px)"}`, minWidth: "200px",}}>{comp}</div>
                ))}
            </div>
          </RectanguloConTexto>
        </div>
      )}

      <div style={{ width: "90%", margin: "30px auto 60px" }}>

        <button onClick={handleSubmit} style={{
  fontSize: 'clamp(14px, 2vw, 20px)',
  padding: '0.4em 0.8em',
  backgroundColor: '#990000',
  color: 'white',
  border: 'none',
  borderRadius: '16px',
  cursor: 'pointer',
  fontFamily: "'Open Sans', sans-serif"
}}>
  Crear Usuario
</button>


      </div>
    </div>
  );
};

export default CrearUsuario;
