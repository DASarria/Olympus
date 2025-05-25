import axios from "axios";
import { promises } from "dns";

export const API_BASE = "https://usermanagement-bhe9cfg4b5b2hthj.eastus-01.azurewebsites.net";
//export const API_BASE = "http://localhost:8080"; // Usa esta línea para desarrollo local

const headers = () => {
  const token = sessionStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `${token}`
  };
};

// 1. Consultar usuarios
export const consultarUsuarios = async (filtros: any) => {
  const res = await axios.post(`${API_BASE}/user/query`, filtros, {
    headers: headers()
  });
  return res.data.data;
};

// 2. Eliminar usuario
export const borrarUsuarioPorId = async (id: string) => {
  const res = await axios.delete(`${API_BASE}/user/${id}`, {
    headers: headers()
  });
};

// 3. Crear usuario estudiante
export const crearUsuarioEstudiante = async (datos: any) => {
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
export const crearUsuarioAdministrador = async (datos: any) => {
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


interface changePasswordDTO{
  password:string;
  newPassword:string;
  newPasswordConfirm:string;
}
interface Response{
  status:string;
  message:string;
  data:null;
}
export async function changePassword(params:changePasswordDTO):Promise<Response> {
  try{
    const response = await axios.put(`${API_BASE}/user/password`, params, {
      headers: headers()
    });
    return response.data;
  }catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorBody = error.response?.data;
      return errorBody;
    }
    // Garantiza que la función no finaliza sin retornar
    const errorResponse:Response = {
        status:"500",
        message:"Error Desconocido",
        data:null
    }
    throw error;
  }
    
}


