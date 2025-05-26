import axios from "axios";

export const API_BASE = "https://chronosproduction-accheze7aycuc6dk.eastus-01.azurewebsites.net";
// export const API_BASE = "http://localhost:8080"; // Usa esta línea para desarrollo local

const headers = () => {
  const token = sessionStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `${token}`
  };
};

// Interfaces

interface FiltrosUsuario {
  academicProgram: string | null;
    codeStudent: string| null;
    userName: string| null;
    fullName:string | null;
    role:string | null;
    id: string| null;
}

interface DatosEstudiante {
  carnet: string;
  doc: string;
  nombre: string;
  programa: string;
  correo: string;
  tel: string;
  cumple: string;
  dir: string;
  tipoId: string;
  contactoDoc: string;
  contactoTipoId: string;
  contactoNombre: string;
  contactoTel: string;
  contactoRelacion: string;
}

interface DatosAdministrador {
  doc: string;
  tipoId: string;
  nombre: string;
  especialidad: string;
  rol: string;
  correo: string;
  tel: string;
}

// 1. Consultar usuarios
export const consultarUsuarios = async (filtros: FiltrosUsuario) => {
  const res = await axios.post(`${API_BASE}/user/query`, filtros, {
    headers: headers()
  });
  return res.data.data;
};

// 2. Eliminar usuario
export const borrarUsuarioPorId = async (id: string) => {
  await axios.delete(`${API_BASE}/user/${id}`, {
    headers: headers()
  });
};

// 3. Crear usuario estudiante
export const crearUsuarioEstudiante = async (datos: DatosEstudiante) => {
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

  const res = await axios.post(`${API_BASE}/authentication/student`, payload, {
    headers: headers()
  });
  return res.data;
};

// 4. Crear usuario administrador
export const crearUsuarioAdministrador = async (datos: DatosAdministrador) => {
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

  const res = await axios.post(`${API_BASE}/authentication/admin`, payload, {
    headers: headers()
  });
  return res.data;
};

interface changePasswordDTO {
  password: string;
  newPassword: string;
  newPasswordConfirm: string;
}

interface Response {
  status: string;
  message: string;
  data: null;
}

export async function changePassword(params: changePasswordDTO): Promise<Response> {
  try {
    const response = await axios.put(`${API_BASE}/user/password`, params, {
      headers: headers()
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorBody = error.response?.data;
      return errorBody;
    }
    throw error;
  }
}
