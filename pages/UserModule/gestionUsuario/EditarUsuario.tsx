import { useState } from "react";
import axios from "axios";
import styles from "@/components/gestionUsuario/styles.module.css";
import { consultarUsuarios, borrarUsuarioPorId } from "@/pages/api/UserManagement//UserService";
import { Return } from "@/components/Return";
import CampoTexto from "@/components/gestionUsuario/CampoTexto";
import CampoSelect from "@/components/gestionUsuario/CampoSelect";
import RectanguloConTexto from "@/components/gestionUsuario/RectanguloConTexto";
import FormularioEditarUsuario from "@/components/gestionUsuario/FormularioEditarUsuario";

const EditarUsuario = () => {
  type FiltroKey = "academicProgram" | "codeStudent" | "userName" | "fullName" | "role" | "id";

  interface Filtros {
    academicProgram: string;
    codeStudent: string;
    userName: string;
    fullName: string;
    role: string;
    id: string;
  }

  const [filtros, setFiltros] = useState<Filtros>({
    academicProgram: "",
    codeStudent: "",
    userName: "",
    fullName: "",
    role: "",
    id: ""
  });

  const [filtroSeleccionado, setFiltroSeleccionado] = useState<FiltroKey>("fullName");
  const [resultados, setResultados] = useState([]);
  const [usuarioEditando, setUsuarioEditando] = useState<any | null>(null);

  const opcionesFiltro = [
    { label: "Programa académico", value: "academicProgram" },
    { label: "Código estudiante", value: "codeStudent" },
    { label: "Usuario", value: "userName" },
    { label: "Nombre completo", value: "fullName" },
    { label: "ID", value: "id" },
    { label: "Rol", value: "role" }
  ];

  const filtrosConSoloUno = Object.fromEntries(
    Object.keys(filtros).map((k) => [k, k === filtroSeleccionado ? filtros[k] || null : null])
  );

  const consultar = async () => {
  try {
    const datos = await consultarUsuarios(filtrosConSoloUno);
    setResultados(datos);
    alert("Consulta realizada con éxito");
  } catch (e) {
    console.error(e);
    alert("Error al consultar usuarios");
  }
  };



  const editarUsuario = (usuario: any) => {
    setUsuarioEditando(usuario);
  };

  const borrarUsuario = async (id: string) => {
  const confirmacion = window.confirm(`¿Estás seguro de que deseas eliminar al usuario con ID: ${id}?`);
  if (!confirmacion) return;

  try {
    await borrarUsuarioPorId(id);
    alert("Usuario eliminado con éxito");
    setResultados(prev => prev.filter((u: any) => u.id !== id));
  } catch (e) {
    console.error(e);
    alert("Error al eliminar el usuario");
  }
  };



  return (
    <div style={{ padding: "20px", fontFamily: "'Open Sans', sans-serif" }}>
      <Return
        className="!self-stretch !flex-[0_0_auto] !w-full mb-6"
        text="Consultar usuarios"
        returnPoint="/Module6"
      />

      <RectanguloConTexto texto="Filtros de búsqueda">
        <div style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ minWidth: "200px", flex: "1" }}>
            <CampoSelect
              etiqueta="Buscar por"
              marcador="Seleccione filtro"
              opciones={opcionesFiltro.map(op => op.label)}
              valor={opcionesFiltro.find(op => op.value === filtroSeleccionado)?.label || ""}
              onChange={(labelSeleccionado) => {
                const filtro = opcionesFiltro.find(op => op.label === labelSeleccionado);
                if (filtro) setFiltroSeleccionado(filtro.value as FiltroKey);
              }}
            />
          </div>

          <div style={{ flex: "2", minWidth: "250px" }}>
            {filtroSeleccionado === "academicProgram" && (
              <CampoSelect
                etiqueta="Programa académico"
                marcador="Seleccione programa"
                opciones={[
                  "Ingeniería de Sistemas", "Ingeniería Electrónica", "Ingeniería Mecánica",
                  "Ingeniería Eléctrica", "Matemática", "Estadística", "Ingeniería Biomédica"
                ]}
                valor={filtros.academicProgram}
                onChange={(v) => setFiltros({ ...filtros, academicProgram: v })}
              />
            )}
            {filtroSeleccionado === "role" && (
              <CampoSelect
                etiqueta="Rol"
                marcador="Seleccione rol"
                opciones={["STUDENT","ADMIN", "SALA_ADMIN", "TRAINER", "MEDICAL_SECRETARY", "DOCTOR", "TEACHER", "EXTRACURRICULAR_TEACHER", "BIENESTAR"]}
                valor={filtros.role}
                onChange={(v) => setFiltros({ ...filtros, role: v })}
              />
            )}
            {["codeStudent", "userName", "fullName", "id"].includes(filtroSeleccionado) && (
              <CampoTexto
                etiqueta={
                  filtroSeleccionado === "codeStudent" ? "Código estudiante" :
                  filtroSeleccionado === "userName" ? "Usuario" :
                  filtroSeleccionado === "id" ? "ID" :
                  "Nombre completo"
                }
                marcador="Ingrese valor"
                valor={filtros[filtroSeleccionado]}
                onChange={(v) => setFiltros({ ...filtros, [filtroSeleccionado]: v })}
              />
            )}
          </div>
        </div>
      </RectanguloConTexto>

      <div style={{ width: "90%", margin: "30px auto 30px" }}>
        <button className={styles.boton} onClick={consultar} style={{ width: "100%" }}>
          Consultar
        </button>
      </div>

      {resultados.length > 0 && (
        <RectanguloConTexto texto="Resultados de búsqueda">
          <div style={{ marginTop: "30px", fontSize: "clamp(14px, 2vw, 20px)", textAlign: "center"}}>
            <div style={{ border: "1px solid #ccc", borderRadius: "16px", overflow: "hidden", backgroundColor: "#FFFFFF" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ backgroundColor: "#FFFFFF" }}>
                  <tr>
                    <th style={{ padding: "12px", borderBottom: "1px solid #ccc", borderRight: "1px solid #ccc" }}>Nombre</th>
                    <th style={{ padding: "12px", borderBottom: "1px solid #ccc", borderRight: "1px solid #ccc" }}>ID</th>
                    <th style={{ padding: "12px", borderBottom: "1px solid #ccc" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {resultados.map((u: any, i: number) => (
                    <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "12px", borderRight: "1px solid #ccc" }}>{u.fullName}</td>
                      <td style={{ padding: "12px", borderRight: "1px solid #ccc" }}>{u.id}</td>
                      <td style={{ padding: "12px" }}>
                        <button
                          className={styles.boton}
                          onClick={() => editarUsuario(u)}
                          style={{ marginRight: "10px", width: "30%" }}
                        >
                          Editar
                        </button>
                        <button
                          className={styles.boton}
                          onClick={() => borrarUsuario(u.id)}
                          style={{ marginRight: "10px", width: "30%" }}
                        >
                          Borrar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </RectanguloConTexto>
      )}

      {usuarioEditando && (
        <FormularioEditarUsuario datosIniciales={usuarioEditando}/>
      )}

    </div>
  );
};

export default EditarUsuario;
