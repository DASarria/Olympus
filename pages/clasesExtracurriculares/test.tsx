import React, { useState } from "react";
import { useRouter } from "next/router";

const borderRadius = "rounded-lg";
const h1Style = "text-[#990000] text-2xl font-bold";
const h2Style = "text-[#990000] text-xl font-bold mb-2";
const h3Style = "text-[#000000] text-sm semi-bold mb-1";
const sectionStyle = `bg-gray-100 p-4 mb-4 ${borderRadius}`;
const divInput = "relative mb-4";
const inputStyle = `w-full px-4 py-2 border border-gray-300 shadow-md bg-white ${borderRadius} focus:outline-none focus:ring-2 focus:ring-blue-500 relative`;
const buttonStyle = `bg-[#990000] text-white px-4 py-2 font-bold ${borderRadius}`;
const buttonContainerStyle = "flex justify-between items-center";

const Test = () => {
  const [nombreClase, setNombreClase] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [capacidad, setCapacidad] = useState("");
  const [profesor, setProfesor] = useState("");
  const [identificacion, setIdentificacion] = useState("");
  const [recursos, setRecursos] = useState([{ nombre: "", cantidad: "" }]);
  const [horarios, setHorarios] = useState([
    {
      anio: "",
      semestre: "",
      dia: "none",
      horaInicio: "",
      horaFin: "",
    },
  ]);

  const handleRecursoChange = (index: number, field: string, value: any) => {
    const newRecursos = [...recursos];
    newRecursos[index][field] = field === "cantidad" ? parseInt(value) : value;
    setRecursos(newRecursos);
  };

  const handleHorarioChange = (index: number, field: string, value: any) => {
    const newHorarios = [...horarios];
    newHorarios[index][field] =
      field === "anio" || field === "semestre" || field === "dia"
        ? parseInt(value)
        : value;
    setHorarios(newHorarios);
  };

  const addRecurso = () => {
    setRecursos([...recursos, { nombre: "", cantidad: "" }]);
  };

  const addHorario = () => {
    setHorarios([
      ...horarios,
      {
        anio: "",
        semestre: "",
        dia: "",
        horaInicio: "",
        horaFin: "",
      },
    ]);
  };

  const handlePositiveNumberInput = (e) => {
    const value = e.target.value;
    if (parseInt(value) < 0) {
      e.target.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const recursosFiltrados = recursos.filter(
      (recurso) =>
        recurso.nombre.trim() !== "" && parseInt(recurso.cantidad) > 0
    );

    const horariosFiltrados = horarios.filter(
      (h) =>
        h.anio !== "" &&
        h.semestre !== "" &&
        h.dia !== "none" &&
        h.horaInicio !== "" &&
        h.horaFin !== ""
    );

    const activity = {
      teacher: profesor,
      teacherId: identificacion,
      activityType: nombreClase,
      location: ubicacion,
      capacityMaximum: capacidad,

      days: horariosFiltrados,

      recursos: recursosFiltrados,
    };

    console.log("Actividad creada:", activity);

    // Reset formulario
    setNombreClase("");
    setUbicacion("");
    setCapacidad("");
    setProfesor("");
    setIdentificacion("");
    setRecursos([{ nombre: "", cantidad: "" }]);
    setHorarios([
      {
        anio: "",
        semestre: "",
        dia: "",
        horaInicio: "",
        horaFin: "",
      },
    ]);
  };

  const diasSemana = [
    { value: "MONDAY", label: "Lunes" },
    { value: "TUESDAY", label: "Martes" },
    { value: "WEDNESDAY", label: "Miércoles" },
    { value: "THURSDAY", label: "Jueves" },
    { value: "FRIDAY", label: "Viernes" },
    { value: "SATURDAY", label: "Sábado" },
    { value: "SUNDAY", label: "Domingo" },
  ];

  const semestres = [
    { value: "1", label: "Semestre 1" },
    { value: "2", label: "Semestre 2" },
  ];

  const router = useRouter();

  const navegarA = (ruta) => {
    router.push(ruta);
  };

  return (
    <div className="flex flex-col w-[85%] mx-auto my-8 px-4 bg-white max-h-[80vh] overflow-auto">
      <h1 className={h1Style}>Edición de Clases</h1>

      <form onSubmit={handleSubmit}>
        {/* Información General */}
        <div className={sectionStyle}>
          <h2 className={h2Style}>Información General</h2>
          <div className={divInput}>
            <h3 className={h3Style}>Clase</h3>
            <input
              type="text"
              value={nombreClase}
              onChange={(e) => setNombreClase(e.target.value)}
              placeholder="Nombre de la Clase"
              className={inputStyle}
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <div className={`${divInput} flex-1 min-w-[200px]`}>
              <h3 className={h3Style}>Ubicación</h3>
              <input
                type="text"
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                placeholder="Ubicación"
                className={inputStyle}
              />
            </div>
            <div className={`${divInput} flex-1 min-w-[200px]`}>
              <h3 className={h3Style}>Capacidad Máxima</h3>
              <input
                type="number"
                value={capacidad}
                onChange={(e) => {
                  handlePositiveNumberInput(e);
                  setCapacidad(e.target.value);
                }}
                placeholder="0"
                className={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Profesor */}
        <div className={sectionStyle}>
          <h2 className={h2Style}>Información Profesor</h2>
          <div className="flex flex-wrap gap-4">
            <div className={`${divInput} flex-1 min-w-[200px]`}>
              <h3 className={h3Style}>Profesor</h3>
              <input
                type="text"
                value={profesor}
                onChange={(e) => setProfesor(e.target.value)}
                placeholder="Nombre del Profesor"
                className={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Recursos */}
        <div className={sectionStyle}>
          <h2 className={h2Style}>Información Recursos</h2>
          {recursos.map((recurso, index) => (
            <div className="flex flex-wrap gap-4" key={index}>
              <div className={`${divInput} flex-1 min-w-[200px]`}>
                <h3 className={h3Style}>Recurso</h3>
                <input
                  type="text"
                  value={recurso.nombre}
                  onChange={(e) =>
                    handleRecursoChange(index, "nombre", e.target.value)
                  }
                  placeholder="Nombre del Recurso"
                  className={inputStyle}
                />
              </div>
              <div className={`${divInput} flex-1 min-w-[200px]`}>
                <h3 className={h3Style}>Cantidad</h3>
                <input
                  type="number"
                  value={recurso.cantidad}
                  onChange={(e) => {
                    handlePositiveNumberInput(e);
                    handleRecursoChange(index, "cantidad", e.target.value);
                  }}
                  placeholder="0"
                  className={inputStyle}
                />
              </div>
            </div>
          ))}
          <button type="button" onClick={addRecurso} className={buttonStyle}>
            Nuevo Recurso
          </button>
        </div>

        {/* Horarios */}
        <div className={sectionStyle}>
          <h2 className={h2Style}>Información Horarios</h2>

          {horarios.map((horario, index) => (
            <div key={index} className="mb-6">
              {/* Fila: Año y Semestre */}
              <div className="flex flex-wrap gap-4 mb-4">
                <div className={`${divInput} flex-1 min-w-[200px]`}>
                  <h3 className={h3Style}>Año</h3>
                  <input
                    type="number"
                    value={horario.anio}
                    onChange={(e) =>
                      handleHorarioChange(index, "anio", e.target.value)
                    }
                    className={inputStyle}
                    placeholder="Año Actual"
                  />
                </div>
                <div className={`${divInput} flex-1 min-w-[200px]`}>
                  <h3 className={h3Style}>Semestre</h3>
                  <select
                    value={horario.semestre}
                    onChange={(e) =>
                      handleHorarioChange(index, "semestre", e.target.value)
                    }
                    className={inputStyle}
                  >
                    <option value="none">Semestre 1 - 2</option>
                    {semestres.map((semestre) => (
                      <option key={semestre.value} value={semestre.value}>
                        {semestre.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Fila: Día, Hora Inicio, Hora Fin */}
              <div className="flex flex-wrap gap-4">
                <div className={`${divInput} flex-1 min-w-[150px]`}>
                  <h3 className={h3Style}>Día</h3>
                  <select
                    value={horario.dia}
                    onChange={(e) =>
                      handleHorarioChange(index, "dia", e.target.value)
                    }
                    className={inputStyle}
                  >
                    <option value="none">Dia de la semana</option>
                    {diasSemana.map((dia) => (
  <option key={dia.value} value={dia.value}>
    {dia.label}
  </option>
))}

                  </select>
                </div>
                <div className={`${divInput} flex-1 min-w-[150px]`}>
                  <h3 className={h3Style}>Hora Inicio</h3>
                  <input
                    type="time"
                    value={horario.horaInicio}
                    onChange={(e) =>
                      handleHorarioChange(index, "horaInicio", e.target.value)
                    }
                    className={inputStyle}
                  />
                </div>
                <div className={`${divInput} flex-1 min-w-[150px]`}>
                  <h3 className={h3Style}>Hora Fin</h3>
                  <input
                    type="time"
                    value={horario.horaFin}
                    onChange={(e) =>
                      handleHorarioChange(index, "horaFin", e.target.value)
                    }
                    className={inputStyle}
                  />
                </div>
              </div>
            </div>
          ))}

          <button type="button" onClick={addHorario} className={buttonStyle}>
            Nuevo Horario
          </button>
        </div>

        {/* BOTONES FINALES */}
        <div className={buttonContainerStyle}>
          <button
            type="button"
            className={buttonStyle}
            onClick={() => navegarA("/clasesExtracurriculares/CEAdminClases")}
          >
            Volver
          </button>
          <button type="submit" className={buttonStyle}>
            Guardar
          </button>
        </div>
      </form>
      <div></div>
    </div>
  );
};

export default Test;

/*
  <div className={`${divInput} flex-1 min-w-[200px]`}>
             <h3 className={h3Style}>Identificación</h3>
              <input
                type="text"
                value={identificacion}
                onChange={(e) => setIdentificacion(e.target.value)}
                placeholder="Carnet o Documento"
                className={inputStyle}
              />
            </div>
*/
