import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

// Estilos reutilizables
const borderRadius = "rounded-lg";
const h1Style = "text-[#990000] text-2xl font-bold";
const h2Style = "text-[#990000] text-xl font-bold mb-2";
const h3Style = "text-[#000000] text-sm semi-bold mb-1";
const sectionStyle = `bg-gray-100 p-4 mb-4 ${borderRadius}`;
const divInput = "relative mb-4";
const inputStyle = `w-full px-4 py-2 border border-gray-300 shadow-md bg-white ${borderRadius} focus:outline-none focus:ring-2 focus:ring-blue-500`;
const buttonStyle = `bg-[#990000] text-white px-4 py-2 font-bold ${borderRadius}`;
const buttonContainerStyle = "flex justify-between items-center";

// Datos estáticos
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

const CEAdminActividades = () => {
  const router = useRouter();

  const [nombreClase, setNombreClase] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [capacidad, setCapacidad] = useState<number>(0);
  const [profesor, setProfesor] = useState("");
  const [identificacion, setIdentificacion] = useState<number>(0);
  const [actividadSeleccionada, setActividadSeleccionada] = useState("none");
  const [actividades, setActividades] = useState<
    { id: string; nombre: string }[]
  >([]);
  const [recursos, setRecursos] = useState([{ name: "", amount: "" }]);
  const [actividadesTemp, setActividadesTemp] = useState<any[]>([]);

  const { id } = router.query;
  useEffect(() => {
    if (!id || actividadesTemp.length === 0) return;

    const actividad = actividadesTemp.find((a) => a.id === id);
    
    if (actividad) {
      setActividadSeleccionada(actividad.id);
    }
  }, [id, actividadesTemp]);

  const tokenJWT =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwMDAwNTExMzciLCJ1c2VyTmFtZSI6Im1pZ3VlbC5tYXJ0aW5leiIsImVtYWlsIjoibWlndWVsLm1hcnRpbmV6QG1haWwuZXNjdWVsYWluZy5lZHUuY28iLCJuYW1lIjoiTWlndWVsIE1hcnTDrW5leiIsInJvbGUiOiJTVFVERU5UIiwic3BlY2lhbHR5IjoibnVsbCIsImV4cCI6MTc0Nzg3MTIzMH0.HFwmKin2ZScCf8rr-ZJDWUX0N-wHHFjNLBcrTraj93Y";

  const fetchActividades = async () => {
    try {
      const response = await axios.get(
        "https://hadesback-app-c5fwbybjd0gnf0fx.canadacentral-01.azurewebsites.net/api/activity/all",
        {
          headers: {
            Authorization: tokenJWT,
          },
        }
      );
      setActividadesTemp(response.data);
      //console.log("Actividades obtenidas:", response.data);
    } catch (error) {
      console.error("Error al obtener las actividades:", error);
    }
  };

  const CrearActividades = async (actividad) => {
    try {
      /*const response = await axios.post(
        "https://hadesback-app-c5fwbybjd0gnf0fx.canadacentral-01.azurewebsites.net/api/activity",
        actividad,
        {
          headers: {
            Authorization: tokenJWT,
          },
        }
      );
      console.log("Actividad Creada:", response.data);*/
      console.log("Actividad Creada:", actividad);
    } catch (error) {
      console.error("Error al crear las actividades:", error);
    }
  };

  const ActualizarActividades = async (actividad) => {
    try {
      const response = await axios.post(
        "https://hadesback-app-c5fwbybjd0gnf0fx.canadacentral-01.azurewebsites.net/api/activity/update",
        actividad,
        {
          headers: {
            Authorization: tokenJWT,
          },
        }
      );
      console.log("Actividad Actualizada:", response.data);
    } catch (error) {
      console.error("Error al actualizar las actividades:", error);
    }
  };

  useEffect(() => {
    fetchActividades();
  }, []);

  const [days, setDays] = useState([
    { year: "", semester: "", dayWeek: "none", startHour: "", endHour: "" },
  ]);

  const handleRecursoChange = (
    index: number,
    field: "name" | "amount",
    value: string
  ) => {
    const updated = [...recursos];
    updated[index][field] = value;
    setRecursos(updated);
  };

  const handleHorarioChange = (
    index: number,
    field: keyof (typeof days)[0],
    value: string
  ) => {
    const updated = [...days];
    updated[index][field] = value;
    setDays(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    

    // Validaciones básicas
    if (!nombreClase.trim()) {
      alert("El nombre de la clase es obligatorio.");
      return;
    }

    if (!ubicacion.trim()) {
      alert("La ubicación es obligatoria.");
      return;
    }

    if (capacidad <= 0) {
      alert("La capacidad debe ser un número mayor a cero.");
      return;
    }

    if (!profesor.trim()) {
      alert("El nombre del profesor es obligatorio.");
      return;
    }

    // Validar horarios
    const daysFiltrados = days.filter(
      (d) =>
        d.year && d.semester && d.dayWeek !== "none" && d.startHour && d.endHour
    );

    if (daysFiltrados.length === 0) {
      alert("Debe agregar al menos un horario válido.");
      return;
    }

    // Validar que no haya recursos con cantidad negativa
    const recursosFiltrados = recursos.filter(
      (r) => r.name.trim() !== "" && parseInt(r.amount) > 0
    );

    const actividad = {
      id: actividadSeleccionada,
      activityType: nombreClase,
      location: ubicacion,
      capacityMaximum: capacidad,
      teacher: profesor,
      teacherId: identificacion,
      resources: recursosFiltrados,
      days: daysFiltrados.map((d) => ({
        ...d,
        year: Number(d.year),
        semester: Number(d.semester),
      })),
    };

    if (actividad.id === "none") {
      actividad.id = "null";
      CrearActividades(actividad);
    }else{
      console.log("ERROR");
    }

    // Reset
    setNombreClase("");
    setUbicacion("");
    setCapacidad(0);
    setProfesor("");
    setIdentificacion(0);
    setRecursos([{ name: "", amount: "" }]);
    setDays([
      { year: "", semester: "", dayWeek: "none", startHour: "", endHour: "" },
    ]);
    setActividadSeleccionada("none");
    fetchActividades();
  };

  const addRecurso = () => setRecursos([...recursos, { name: "", amount: "" }]);

  const addHorario = () =>
    setDays([
      ...days,
      { year: "", semester: "", dayWeek: "none", startHour: "", endHour: "" },
    ]);

  // Después de fetchActividades y estados:
  useEffect(() => {
    if (actividadesTemp.length > 0) {
      const mapped = actividadesTemp.map(({ id, activityType }) => ({
        id,
        nombre: activityType,
      }));
      setActividades(mapped);
    }
  }, [actividadesTemp]);

  useEffect(() => {
    if (actividadSeleccionada !== "none") {
      const actividad = actividadesTemp.find(
        (act) => act.id === actividadSeleccionada
      );
      if (actividad) {
        setNombreClase(actividad.activityType);
        setUbicacion(actividad.location);
        setCapacidad(actividad.capacityMaximum);
        setProfesor(actividad.teacher);
        setIdentificacion(actividad.teacherId);
        setRecursos(
          actividad.resources.length > 0
            ? actividad.resources
            : [{ name: "", amount: "" }]
        );
        setDays(
          actividad.days.length > 0
            ? actividad.days.map((d) => ({
                year: String(actividad.year),
                semester: String(actividad.semester),
                dayWeek: d.dayWeek,
                startHour: d.startHour,
                endHour: d.endHour,
              }))
            : [
                {
                  year: "",
                  semester: "",
                  dayWeek: "none",
                  startHour: "",
                  endHour: "",
                },
              ]
        );
      }
    } else {
      // Si selecciona "Crear Nueva Actividad", limpiamos los estados
      setNombreClase("");
      setUbicacion("");
      setCapacidad(0);
      setProfesor("");
      setIdentificacion(0);
      setRecursos([{ name: "", amount: "" }]);
      setDays([
        { year: "", semester: "", dayWeek: "none", startHour: "", endHour: "" },
      ]);
    }
  }, [actividadSeleccionada, actividadesTemp]);

  return (
    <div className="flex flex-col w-[85%] mx-auto my-8 px-4 bg-white max-h-[80vh] overflow-auto">
      <h1 className={h1Style}>Edición de Clases</h1>

      <form onSubmit={handleSubmit}>
        {/* Selección de Actividad */}
        <div className={sectionStyle}>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <h2 className={h2Style}>Editar Actividad / Nueva Actividad</h2>
              <select
                value={actividadSeleccionada}
                onChange={(e) => setActividadSeleccionada(e.target.value)}
                className={inputStyle}
              >
                <option value="none">Crear Nueva Actividad</option>
                {actividades.map((actividad, index) => (
                  <option key={index} value={actividad.id}>
                    {actividad.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Información General */}
        <div className={sectionStyle}>
          <h2 className={h2Style}>Información General</h2>
          <div className={divInput}>
            <h3 className={h3Style}>Clase</h3>
            <input
              type="text"
              value={nombreClase}
              onChange={(e) => setNombreClase(e.target.value)}
              className={inputStyle}
              placeholder="Nombre de la Clase"
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <h3 className={h3Style}>Ubicación</h3>
              <input
                type="text"
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                className={inputStyle}
                placeholder="Ubicación"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <h3 className={h3Style}>Capacidad Máxima</h3>
              <input
                type="number"
                value={capacidad}
                onChange={(e) => {
                  setCapacidad(Number(e.target.value));
                }}
                className={inputStyle}
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Información Profesor */}
        <div className={sectionStyle}>
          <h2 className={h2Style}>Información Profesor</h2>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <h3 className={h3Style}>Profesor</h3>
              <input
                type="text"
                value={profesor}
                onChange={(e) => setProfesor(e.target.value)}
                className={inputStyle}
                placeholder="Nombre del Profesor"
              />
            </div>
          </div>
        </div>

        {/* Recursos */}
        <div className={sectionStyle}>
          <h2 className={h2Style}>Información Recursos</h2>
          {recursos.map((recurso, index) => (
            <div key={index} className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-[200px]">
                <h3 className={h3Style}>Recurso</h3>
                <input
                  type="text"
                  value={recurso.name}
                  onChange={(e) =>
                    handleRecursoChange(index, "name", e.target.value)
                  }
                  className={inputStyle}
                  placeholder="Nombre del Recurso"
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <h3 className={h3Style}>Cantidad</h3>
                <input
                  type="number"
                  value={recurso.amount}
                  onChange={(e) =>
                    handleRecursoChange(index, "amount", e.target.value)
                  }
                  className={inputStyle}
                  placeholder="0"
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
          {days.map((horario, index) => (
            <div key={index} className="mb-6">
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex-1 min-w-[200px]">
                  <h3 className={h3Style}>Año</h3>
                  <input
                    type="number"
                    value={horario.year}
                    onChange={(e) =>
                      handleHorarioChange(index, "year", e.target.value)
                    }
                    className={inputStyle}
                    placeholder="Año"
                  />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <h3 className={h3Style}>Semestre</h3>
                  <select
                    value={horario.semester}
                    onChange={(e) =>
                      handleHorarioChange(index, "semester", e.target.value)
                    }
                    className={inputStyle}
                  >
                    <option value="none">Seleccione Semestre</option>
                    {semestres.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[150px]">
                  <h3 className={h3Style}>Día</h3>
                  <select
                    value={horario.dayWeek}
                    onChange={(e) =>
                      handleHorarioChange(index, "dayWeek", e.target.value)
                    }
                    className={inputStyle}
                  >
                    <option value="none">Seleccione Día</option>
                    {diasSemana.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 min-w-[150px]">
                  <h3 className={h3Style}>Hora Inicio</h3>
                  <input
                    type="time"
                    value={horario.startHour}
                    onChange={(e) =>
                      handleHorarioChange(index, "startHour", e.target.value)
                    }
                    className={inputStyle}
                  />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <h3 className={h3Style}>Hora Fin</h3>
                  <input
                    type="time"
                    value={horario.endHour}
                    onChange={(e) =>
                      handleHorarioChange(index, "endHour", e.target.value)
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

        {/* Botones Finales */}
        <div className={buttonContainerStyle}>
          <button
            type="button"
            onClick={() =>
              router.push("/clasesExtracurriculares/CEAdminClases")
            }
            className={buttonStyle}
          >
            Volver
          </button>
          <button type="submit" className={buttonStyle}>
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CEAdminActividades;
