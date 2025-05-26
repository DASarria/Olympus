import React, { useState } from 'react';
import axios from 'axios';
import CampoSelect from './CampoSelect';
import CampoTexto from './CampoTexto';
import RectanguloConTexto from './RectanguloConTexto';
import styles from "@/components/gestionUsuario/styles.module.css";
import { API_BASE } from "@/pages/api/UserManagement//UserService";

export interface UsuarioData {
  fullName: string;
  academicProgram: string;
  codeStudent: string;
  role: string;
  id: string;
  userName: string;
  contactNumber: string;
  address: string;
  typeIdStudent: string;
  idContact: string;
  typeIdContact: string | null;
  fullNameContact: string;
  phoneNumber: string;
  relationship: string;
}

interface Props {
  datosIniciales: UsuarioData;
}

const FormularioEditarUsuario: React.FC<Props> = ({ datosIniciales }) => {
  const [form, setForm] = useState({ ...datosIniciales });

  const handleSubmit = async () => {
    const payload = {
      academicProgram: form.academicProgram,
      contactNumber: form.contactNumber,
      address: form.address,
      idStudent: form.id,
      idContact: form.idContact,
      typeIdContact: form.typeIdContact || 'CC',
      fullNameContact: form.fullNameContact,
      phoneNumber: form.phoneNumber,
      relationship: form.relationship
    };

    const payloadInicial = {
      academicProgram: datosIniciales.academicProgram,
      contactNumber: datosIniciales.contactNumber,
      address: datosIniciales.address,
      idStudent: datosIniciales.id,
      idContact: datosIniciales.idContact,
      typeIdContact: datosIniciales.typeIdContact || 'CC',
      fullNameContact: datosIniciales.fullNameContact,
      phoneNumber: datosIniciales.phoneNumber,
      relationship: datosIniciales.relationship
    };

    const sinCambios = JSON.stringify(payload) === JSON.stringify(payloadInicial);
    if (sinCambios) {
      console.log('No hubo cambios, pero se enviará igual');
    }

    try {
      const token = sessionStorage.getItem("token");

      //await axios.put("https://usermanagement-bhe9cfg4b5b2hthj.eastus-01.azurewebsites.net/user", payload, {
      await axios.put(`${API_BASE}/user`, payload, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${token}` // <-- Aquí se incluye el token
        }
      });
      alert('Datos actualizados correctamente');
    } catch (error) {
      console.error(error);
      alert('Error al actualizar los datos');
    }
  };

  return (
    <>  
      <div style={{ marginTop: "30px" }}>
      <RectanguloConTexto texto="Editar usuario">
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
            {key: "Digite correo", comp: (
            <CampoTexto etiqueta="Correo" marcador="Digite correo" valor={form.userName} onChange={v => setForm({ ...form, userName: v })}/>),},
            {key: "Digite dirección", comp: (
            <CampoTexto etiqueta="Dirección" marcador="Digite dirección" valor={form.address} onChange={v => setForm({ ...form, address: v })}/>),},
            {key: "Digite número", comp: (
            <CampoTexto etiqueta="Número de contacto" marcador="Digite número" valor={form.contactNumber} onChange={v => setForm({ ...form, contactNumber: v })}/>),},
            {key: "Digite programa", comp: (
            <CampoTexto etiqueta="Programa académico" marcador="Digite programa" valor={form.academicProgram} onChange={v => setForm({ ...form, academicProgram: v })}/>),},
            {key: "Digite nombre", comp: (
            <CampoTexto etiqueta="Nombre del contacto" marcador="Digite nombre" valor={form.fullNameContact} onChange={v => setForm({ ...form, fullNameContact: v })}/>),},
            {key: "Digite teléfono", comp: (
            <CampoTexto etiqueta="Teléfono del contacto" marcador="Digite teléfono" valor={form.phoneNumber} onChange={v => setForm({ ...form, phoneNumber: v })}/>),},
            {key: "Digite parentesco", comp: (
            <CampoTexto etiqueta="Parentesco" marcador="Digite parentesco" valor={form.relationship} onChange={v => setForm({ ...form, relationship: v })}/>),},
            {key: "Tipo de documento del contacto", comp: (
            <CampoSelect etiqueta="Tipo de documento del contacto" marcador="Seleccione" opciones={["CC", "TI"]} valor={form.typeIdContact || ''} onChange={v => setForm({ ...form, typeIdContact: v })}/>),},
          ].map(({ key, comp }, i) => (<div key={`EditarUsuario-${key}`} style={{ flex: `1 1 ${i >= 2 ? "32.8%" : "calc(50% - 20px)"}`, minWidth: "200px",}}>{comp}</div>
          ))}
        </div>
      </RectanguloConTexto>
      </div>

      <div style={{ width: "90%", margin: "30px auto 60px" }}>
        <button onClick={handleSubmit} className={styles.boton}>
          Guardar cambios
        </button>
      </div>
    </>
  );
};

export default FormularioEditarUsuario;