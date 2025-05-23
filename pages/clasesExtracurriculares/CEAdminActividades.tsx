import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

//Variables de TAILWIND
const borderRadius = "rounded-lg";
const h1Style = "text-[#990000] text-2xl font-bold";
const h2Style = "text-[#990000] text-xl font-bold mb-2";
const h3Style = "text-[#000000] text-sm semi-bold mb-1";
const sectionStyle = `bg-gray-100 p-4 mb-4 ${borderRadius}`;
const divInput = "relative mb-4";
const inputStyle = `w-full px-4 py-2 border border-gray-300 shadow-md bg-white ${borderRadius} focus:outline-none focus:ring-2 focus:ring-blue-500`;
const buttonStyle = `bg-[#990000] text-white px-4 py-2 font-bold ${borderRadius}`;
const buttonContainerStyle = "flex justify-between items-center";

// Datos estáticos (Forma rigida de evitar errores)
const nombresActividades = [
  { value: "Ajedrez", label: "Ajedrez" },
  { value: "Aerobicos", label: "Aerobicos" },
  { value: "Baloncesto", label: "Baloncesto" },
  { value: "Baile para no Bailarines", label: "Baile para no Bailarines" },
  { value: "Danza", label: "Danza" },
  { value: "Fotografia", label: "Fotografia" },
  { value: "Futbol Femenino", label: "Futbol Femenino" },
  { value: "Futbol Masculino", label: "Futbol Masculino" },
  { value: "Futbol Administrativos", label: "Futbol Administrativos" },
  { value: "Futsal Femenino", label: "Futsal Femenino" },
  { value: "Futsal Masculino", label: "Futsal Masculino" },
  { value: "Guitarra", label: "Guitarra" },
  { value: "Juegos Escenicos", label: "Juegos Escenicos" },
  { value: "Pilates", label: "Pilates" },
  { value: "Rumba", label: "Rumba" },
  { value: "Teatro", label: "Teatro" },
  { value: "Tecnica Vocal", label: "Tecnica Vocal" },
  { value: "Vitrales", label: "Vitrales" },
  {
    value: "Voleybol Femenino y Masculino",
    label: "Voleybol Femenino y Masculino",
  },
  { value: "Taekwondo", label: "Taekwondo" },
  { value: "Tenis de Campo", label: "Tenis de Campo" },
  { value: "Tenis de mesa", label: "Tenis de mesa" },
  { value: "Yoga", label: "Yoga" },
];

const years: { value: number; label: number }[] = [];
const tempYear = new Date().getFullYear();
for (let year = tempYear; year <= tempYear + 2; year++) {
  years.push({ value: year, label: year });
}

const semestres = [
  { value: "1", label: "Semestre 1" },
  { value: "2", label: "Semestre 2" },
];

const diasSemana = [
  { value: "MONDAY", label: "Lunes" },
  { value: "TUESDAY", label: "Martes" },
  { value: "WEDNESDAY", label: "Miércoles" },
  { value: "THURSDAY", label: "Jueves" },
  { value: "FRIDAY", label: "Viernes" },
  { value: "SATURDAY", label: "Sábado" },
  { value: "SUNDAY", label: "Domingo" },
];

//Interfaces de datos
interface Actividad {
  id: string;
  year: number;
  semester: number;
  activityType: string;
  teacher: string;
  teacherId: number;
  location: string;
  capacityMaximum: number;
  schedules: string[];
  days: Day[];
  resources: Recurso[];
}

//Esto es igual que actividad (Lo uso para actividades nuevas, donde no debo enviar el id)
type ActividadNueva = Omit<Actividad, "id"> & { id?: string };

interface Day {
  dayWeek: string;
  startHour: string;
  endHour: string;
}

interface Recurso {
  name: string;
  amount: number;
}

const CEAdminActividades = () => {
  useEffect(() => {
    fetchDatos();
  }, []);

  //Constantes para peticiones
  const tokenJWT =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMTMyMTQxIiwidXNlck5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AZXNjdWVsYWluZy5lZHUuY28iLCJuYW1lIjoiZWwgYWRtaW4iLCJyb2xlIjoiQURNSU4iLCJzcGVjaWFsdHkiOiJudWxsIiwiZXhwIjoxNzQ3OTY2MTQyfQ.vjOpZTA2Q_XxqbWe5uEFoX6EUZ61R8L_72BmF1TgdhE";

  const linkAPI =
    "https://hadesback-app-c5fwbybjd0gnf0fx.canadacentral-01.azurewebsites.net";
  const linkAPIUSER =
    "https://usermanagement-bhe9cfg4b5b2hthj.eastus-01.azurewebsites.net";

  //VARIABLES GENERALES (Guardar informacion o usarla)
  const router = useRouter();
  const { id } = router.query; //Variable que traer las cosas del link
  const [actividadesTemp, setActividadesTemp] = useState<Actividad[]>([]);
  const [profesoresTemp, setProfesoresTemp] = useState<any[]>([]);

  const [actividades, setActividades] = useState<
    { id: string; nombre: string }[]
  >([]);
  const [profesores, setProfesores] = useState<
    { id: string; fullName: string }[]
  >([]);

  //VARIABLES DE USO (Que usan los campos, select, input, etc)
  const [actividadSeleccionada, setActividadSeleccionada] = useState("none");

  const [nombreActividadSeleccionada, setNombreActividadSeleccionada] =
    useState("none");
  const [ubicacion, setUbicacion] = useState("");
  const [capacidad, setCapacidad] = useState<number>(0);

  const [profesorSeleccionado, setProfesorSeleccionado] = useState("none");

  const [recursos, setRecursos] = useState<Recurso[]>([
    { name: "", amount: 0 },
  ]);

  const [yearSeleccionado, setYearSeleccionado] = useState("none");
  const [semestreSeleccionado, setSemestreSeleccionado] = useState("none");
  const [days, setDays] = useState([
    { dayWeek: "none", startHour: "", endHour: "" },
  ]);

  //Donde traemos informacion para "actualizar" o mostrar
  const fetchDatos = () => {
    fetchActividades();
    fetchProfesores();
  };

  const fetchActividades = async () => {
    try {
      const response = await axios.get(`${linkAPI}/api/activity/all`, {
        headers: {
          Authorization: tokenJWT,
        },
      });
      setActividadesTemp(response.data);
    } catch (error) {
      console.error("Error al obtener las actividades:", error);
    }
  };

  const fetchProfesores = async () => {
    try {
    const response = await axios.post(
      `${linkAPIUSER}/user/query`,
      {
  "role": "EXTRACURRICULAR_TEACHER"
},
      {
        headers: {
          Authorization: tokenJWT,
        }
      }
    );
    
    setProfesoresTemp(response.data.data);
    } catch (error) {
      console.error("Error al obtener los profesores", error);
    }
  };

  //ACTUALIZAR LAS VARIABLES DE LOS SELECT QUE SU INFORMACION VIENE DE AFUERA
  useEffect(() => {
    if (actividadesTemp.length > 0) {
      const mapped = actividadesTemp
      .filter((a) => a.id !== null)
      .map(({ id, activityType }) => ({
        id,
        nombre: activityType,
      }));
      setActividades(mapped);
    }
  }, [actividadesTemp]);

  useEffect(() => {
    if (profesoresTemp.length > 0) {
      const mapped = profesoresTemp.map(({ id, fullName }) => ({
        id,
        fullName,
      }));
      setProfesores(mapped);
    }
  }, [profesoresTemp]);

  //Manejo de cosas
  const addRecurso = () => setRecursos([...recursos, { name: "", amount: 0 }]);

  const handleRecursoChange = (
    index: number,
    field: keyof Recurso,
    value: string
  ) => {
    const updated = [...recursos];
    if (field === "amount") {
      updated[index][field] = Number(value);
    } else {
      updated[index][field] = value;
    }
    setRecursos(updated);
  };

  const addHorario = () =>
    setDays([...days, { dayWeek: "none", startHour: "", endHour: "" }]);

  const handleHorarioChange = (
    index: number,
    field: keyof (typeof days)[0],
    value: string
  ) => {
    const updated = [...days];
    updated[index][field] = value;
    setDays(updated);
  };

  //Para cargar la informacion cuando llegue desde el link (Se ponga el id de la clase ?id=id)
  useEffect(() => {
    if (id && typeof id === "string") {
      setActividadSeleccionada(id);
    }
  }, [id]);

  //Para llenar los campos
  useEffect(() => {
    if (actividadSeleccionada !== "none") {
      const actividad = actividadesTemp.find(
        (act) => act.id === actividadSeleccionada
      );
      if (!actividad) return;

      setNombreActividadSeleccionada(actividad.activityType);
      setUbicacion(actividad.location);
      setCapacidad(actividad.capacityMaximum);

      // Asignar profesor si ya están cargados
      if (profesoresTemp.length > 0) {
        const profesorAsociado = profesoresTemp.find(
          (prof) => String(prof.id) === String(actividad.teacherId)
        );
        setProfesorSeleccionado(
          profesorAsociado ? String(profesorAsociado.id) : "none"
        );
      } else {
        setProfesorSeleccionado("none");
      }

      setRecursos(
        actividad.resources.length > 0
          ? actividad.resources.map((r: Recurso) => ({
              name: r.name,
              amount: Number(r.amount),
            }))
          : [{ name: "", amount: 0 }]
      );

      setYearSeleccionado(String(actividad.year));
      setSemestreSeleccionado(String(actividad.semester));

      setDays(
        actividad.days.length > 0
          ? actividad.days.map((d: Day) => ({
              dayWeek: d.dayWeek,
              startHour: d.startHour,
              endHour: d.endHour,
            }))
          : [{ dayWeek: "none", startHour: "", endHour: "" }]
      );
    } else {
      // Resetear todos los campos cuando no hay actividad seleccionada
      setNombreActividadSeleccionada("none");
      setUbicacion("");
      setCapacidad(0);
      setProfesorSeleccionado("none");
      setRecursos([{ name: "", amount: 0 }]);
      setYearSeleccionado("none");
      setSemestreSeleccionado("none");
      setDays([{ dayWeek: "none", startHour: "", endHour: "" }]);
    }
  }, [actividadSeleccionada, actividadesTemp, profesoresTemp]);


  //PARA ENVIAR PETICIONES
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (nombreActividadSeleccionada === "none") {
      alert("Tiene que seleccionar una actividad");
      return;
    }

    if (ubicacion.trim() == "") {
      alert("Tiene que establecer una ubicacion para continuar");
      return;
    }

    if (capacidad <= 0) {
      alert("Tiene que tener una capacidad mayor a 0");
      return;
    } else if (capacidad >= 50) {
      alert("Tiene que seleccionar una capacidad menor a 50 estudiantes");
      return;
    }

    if (profesorSeleccionado === "none") {
      alert("Debe seleccionar un profesor valido para continuar");
      return;
    }

    //Esto es uan manera de revisar que no esten mal los recursos
    const recursoInvalido = recursos.some(
      (r: Recurso) => r.name.trim() === "" || r.amount <= 0
    );

    //Igualmente valido para evitar problemas por si se envia
    const recursosFiltrados = recursos.filter(
      (r: Recurso) => r.name.trim() !== "" && r.amount > 0
    );
    setRecursos(recursosFiltrados);

    if (recursoInvalido) {
      alert("Hay recursos con nombre vacío o cantidad menor o igual a cero.");
      return;
    }

    if (yearSeleccionado === "none") {
      alert("Tiene que seleccionar un año valido para continuar");
      return;
    }

    if (semestreSeleccionado === "none") {
      alert("Tiene que seleccionar un semestre valido para continuar");
      return;
    }

    //Revisar que no esten mal los datos
    const diaInvalido = days.some((d: Day) => {
      return (
        d.dayWeek === "none" ||
        d.startHour === "" ||
        d.endHour === "" ||
        d.startHour < "07:00" ||
        d.startHour >= d.endHour ||
        d.endHour > "19:00"
      );
    });

    //Validacion de datos
    const daysFiltrados = days.filter(
      (d) => d.dayWeek !== "none" && d.startHour && d.endHour
    );
    setDays(daysFiltrados);

    if (diaInvalido) {
      alert(
        " el día debe estar seleccionado, la hora de inicio debe ser después de las 07:00AM y antes de la hora de fin, y la hora de fin no debe superar las 7:00pm."
      );
      return;
    }

    const profesorLabel =
      profesores.find((p) => p.id === profesorSeleccionado)?.fullName ||
      "No encontrado";

    //Este para crear
    if (actividadSeleccionada === "none") {
      const actividadNueva: ActividadNueva = {
        year: Number(yearSeleccionado),
        semester: Number(semestreSeleccionado),
        activityType: nombreActividadSeleccionada,
        teacher: profesorLabel,
        teacherId: Number(profesorSeleccionado),
        location: ubicacion,
        capacityMaximum: capacidad,
        schedules: [],
        days: days,
        resources: recursos,
      };
      CrearActividades(actividadNueva);
    } else {
      //Este para actualizar
      const actividad: Actividad = {
        id: actividadSeleccionada,
        year: Number(yearSeleccionado),
        semester: Number(semestreSeleccionado),
        activityType: nombreActividadSeleccionada,
        teacher: profesorLabel,
        teacherId: Number(profesorSeleccionado),
        location: ubicacion,
        capacityMaximum: capacidad,
        schedules: [],
        days: days,
        resources: recursos,
      };
      ActualizarActividades(actividad);
    }

    //Reset
    fetchActividades();
    setActividadSeleccionada("none");
    
  };

  const CrearActividades = async (actividad: ActividadNueva) => {
    try {
      await axios.post(
        `${linkAPI}/api/activity`,
        actividad,
        {
          headers: {
            Authorization: tokenJWT,
          },
        }
      );
    } catch (error) {
      console.error("Error al crear las actividades:", error);
    }
  };

  const ActualizarActividades = async (actividad: Actividad) => {
    try {
      await axios.put(
        `${linkAPI}/api/activity/update`,
        actividad,
        {
          headers: {
            Authorization: tokenJWT,
          },
        }
      );
    } catch (error) {
      console.error("Error al actualizar las actividades:", error);
    }
  };

  

  // Después de fetchActividades y estados:

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
            <select
              value={nombreActividadSeleccionada}
              onChange={(e) => setNombreActividadSeleccionada(e.target.value)}
              className={inputStyle}
            >
              <option value="none" disabled>
                Selecciona una actividad
              </option>
              {nombresActividades.map((actividad) => (
                <option key={actividad.value} value={actividad.value}>
                  {actividad.label}
                </option>
              ))}
            </select>
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
              <select
                value={profesorSeleccionado}
                onChange={(e) => setProfesorSeleccionado(e.target.value)}
                className={inputStyle}
              >
                <option value="none" disabled>
                  Selecciona un profesor
                </option>
                {profesores.map(({ id, fullName }) => (
                  <option key={id} value={fullName}>
                    {fullName}
                  </option>
                ))}
              </select>
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
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[200px]">
              <h3 className={h3Style}>Año</h3>
              <select
                value={yearSeleccionado}
                onChange={(e) => setYearSeleccionado(e.target.value)}
                className={inputStyle}
              >
                <option value="none" disabled>
                  Selecciona un año
                </option>
                {years.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <h3 className={h3Style}>Semestre</h3>
              <select
                value={semestreSeleccionado}
                onChange={(e) => setSemestreSeleccionado(e.target.value)}
                className={inputStyle}
              >
                <option value="none" disabled>
                  Seleccione Semestre
                </option>
                {semestres.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {days.map((horario, index) => (
            <div key={index} className="mb-6">
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
                    <option value="none" disabled>
                      Seleccione Día
                    </option>
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
                    min="07:00"
                    max="19:00"
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
                    min="07:00"
                    max="19:00"
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
