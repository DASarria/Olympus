import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { PageTransitionWrapper } from "@/components/PageTransitionWrapper";
import { Return } from "@/components/Return";
import RectanguloConTexto from "@/components/gestionUsuario/RectanguloConTexto";

interface Schedule {
  id: string;
  serviceSpaceType: string;
  idConfiguration: string;
}

interface Interval {
  startTime: string;
  endTime: string;
  reason: string | null;
}

interface Configuration {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  breakIntervals: Interval[];
  attentionIntervals: Interval[];
}

const daysOfWeek = [
  "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"
];

const removeAccents = (text: string) => {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const ScheduleViewer = () => {
  const router = useRouter();
  const { serviceName } = router.query;

  const [dayOfWeek, setDayOfWeek] = useState("");
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [configMap, setConfigMap] = useState<Record<string, Configuration>>({});
  const [allConfigs, setAllConfigs] = useState<Configuration[]>([]);
  const [loading, setLoading] = useState(false);

  const [isChangingConfig, setIsChangingConfig] = useState(false);
  const [selectedConfigId, setSelectedConfigId] = useState<string>("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const rawToken = sessionStorage.getItem("token") || "";
  const token = rawToken.startsWith("Bearer ") ? rawToken : `Bearer ${rawToken}`;

  const fetchData = async () => {
    if (!router.isReady || typeof serviceName !== "string" || !dayOfWeek) return;

    setLoading(true);

    try {
      // Traer horarios para ese día
      const res = await axios.get("https://scheculeproduction-fpgeb8c4b8abddfx.eastus-01.azurewebsites.net/schedule", {
        params: {
          serviceName,
          dayOfWeek: removeAccents(dayOfWeek.toLowerCase()),
        },
        headers: { Authorization: token }
      });

      const scheduleList: Schedule[] = res.data.data;
      setSchedules(scheduleList);

      // Traer configuraciones para cada horario (cache)
      const newConfigMap: Record<string, Configuration> = {};
      await Promise.all(scheduleList.map(async (schedule) => {
        if (!newConfigMap[schedule.idConfiguration]) {
          try {
            const configRes = await axios.get("https://scheculeproduction-fpgeb8c4b8abddfx.eastus-01.azurewebsites.net/configuration/id", {
              params: { id: schedule.idConfiguration },
              headers: { Authorization: token }
            });
            newConfigMap[schedule.idConfiguration] = configRes.data.data;
          } catch {
            newConfigMap[schedule.idConfiguration] = {
              id: schedule.idConfiguration,
              name: "Desconocida",
              startTime: "00:00",
              endTime: "00:00",
              breakIntervals: [],
              attentionIntervals: [],
            };
          }
        }
      }));

      setConfigMap(newConfigMap);

      // Traer todas las configuraciones para selección
      const allConfigRes = await axios.get("https://scheculeproduction-fpgeb8c4b8abddfx.eastus-01.azurewebsites.net/configuration", {
        headers: { Authorization: token }
      });
      setAllConfigs(allConfigRes.data.data);

      // Reiniciar selección
      setSelectedConfigId("");
      setSelectedDays([dayOfWeek]);
    } catch (error) {
      console.error("Error al obtener datos:", error);
      setSchedules([]);
      setConfigMap({});
      setAllConfigs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router.isReady, dayOfWeek, serviceName, token]);

  const toggleDaySelection = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleConfirmChange = async () => {
    if (!selectedConfigId) {
      alert("Por favor selecciona una configuración nueva");
      return;
    }
    if (selectedDays.length === 0) {
      alert("Selecciona al menos un día para aplicar la configuración");
      return;
    }
    setLoading(true);
    try {
      for (const day of selectedDays) {
        const res = await axios.get("https://scheculeproduction-fpgeb8c4b8abddfx.eastus-01.azurewebsites.net/schedule", {
          params: { serviceName, dayOfWeek: removeAccents(day.toLowerCase()) },
          headers: { Authorization: token }
        });

        const daySchedules: Schedule[] = res.data.data;

        for (let i = 0; i < daySchedules.length; i++) {
          const updateDTO = {
            serviceName,
            dayOfWeek: removeAccents(day.toLowerCase()),
            responsibleUser: "",
            configurationName: selectedConfigId,
          };

          await axios.put("https://scheculeproduction-fpgeb8c4b8abddfx.eastus-01.azurewebsites.net/schedule", updateDTO, {
            headers: { Authorization: token }
          });
        }
      }

      alert("Configuraciones actualizadas correctamente");
      setIsChangingConfig(false);

      // Recargar info actualizada para el día seleccionado
      await fetchData();

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error al actualizar configuraciones:", error.response ?? error.message);
        alert(`Error al actualizar configuraciones: ${error.response?.data?.message || error.message}`);
      } else if (error instanceof Error) {
        console.error("Error al actualizar configuraciones:", error.message);
        alert(`Error al actualizar configuraciones: ${error.message}`);
      } else {
        console.error("Error desconocido:", error);
        alert("Error desconocido al actualizar configuraciones");
      }
    }
  };

  return (
    <PageTransitionWrapper>
      <div className="mb-6">
        <Return
          text={`Horarios de ${serviceName ?? ""}`}
          returnPoint="/UserModule/ScheduleManagement/ServicePage"
        />
      </div>

      <RectanguloConTexto texto="Configuración del día">
        <div className="mb-4 flex items-center gap-4">
          <label className="font-semibold text-gray-700" htmlFor="day-select">
            Seleccione un día:
          </label>
          <select
            id="day-select"
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#990000]"
          >
            <option value="">-- Elija un día --</option>
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>
                {day.charAt(0) + day.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        {!dayOfWeek ? (
          <p className="text-center text-gray-500">Por favor seleccione un día para ver los horarios.</p>
        ) : loading ? (
          <p className="text-center text-gray-500">Cargando horarios...</p>
        ) : schedules.length === 0 ? (
          <p className="text-center text-gray-600">No hay horarios registrados para este día.</p>
        ) : (
          <>
            {schedules.map((schedule) => {
              const config = configMap[schedule.idConfiguration];
              return (
                <article
                  key={schedule.id}
                  className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300 mb-4"
                >
                  <h2 className="text-xl font-bold mb-3 text-[#990000]">{schedule.serviceSpaceType}</h2>

                  {config ? (
                    <>
                      <p className="text-gray-700 mb-1">
                        <span className="font-semibold">Configuración:</span> {config.name}
                      </p>
                      <p className="text-gray-700 mb-4">
                        <span className="font-semibold">Horario general:</span> {config.startTime} - {config.endTime}
                      </p>

                      <section className="mb-4">
                        <h3 className="text-red-600 font-semibold mb-2 flex items-center gap-2">
                          {/* Icono descanso */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m3-12a9 9 0 11-6 0 9 9 0 016 0z" />
                          </svg>
                          Intervalos de descanso
                        </h3>
                        {config.breakIntervals.length === 0 ? (
                          <p className="text-gray-600">No hay intervalos de descanso</p>
                        ) : (
                          <ul className="list-disc list-inside text-gray-700">
                            {config.breakIntervals.map((interval, idx) => (
                              <li key={idx}>
                                {interval.startTime} - {interval.endTime}
                                {interval.reason ? ` (${interval.reason})` : ""}
                              </li>
                            ))}
                          </ul>
                        )}
                      </section>

                      <section>
                        <h3 className="text-green-700 font-semibold mb-2 flex items-center gap-2">
                          {/* Icono atención */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3" />
                          </svg>
                          Intervalos de atención
                        </h3>
                        {config.attentionIntervals.length === 0 ? (
                          <p className="text-gray-600">No hay intervalos de atención</p>
                        ) : (
                          <ul className="list-disc list-inside text-gray-700">
                            {config.attentionIntervals.map((interval, idx) => (
                              <li key={idx}>
                                {interval.startTime} - {interval.endTime}
                                {interval.reason ? ` (${interval.reason})` : ""}
                              </li>
                            ))}
                          </ul>
                        )}
                      </section>
                    </>
                  ) : (
                    <p className="text-red-600 font-semibold">Configuración no encontrada</p>
                  )}
                </article>
              );
            })}

            {isChangingConfig ? (
              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Cambiar configuración</h3>

                <div className="mb-4">
                  
                  <select
                    id="config-select"
                    value={selectedConfigId}
                    onChange={(e) => setSelectedConfigId(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#990000]"
                  >
                    <option value="">-- Seleccione configuración --</option>
                    {allConfigs.map((conf) => (
                      <option key={conf.id} value={conf.id}>
                        {conf.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium">Días para aplicar configuración:</label>
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map((day) => (
                      <button
                        key={day}
                        type="button"
                        className={`px-3 py-1 rounded-md border ${
                          selectedDays.includes(day)
                            ? "bg-[#990000] text-white"
                            : "bg-white text-gray-700 border-gray-300"
                        } hover:bg-[#990000] hover:text-white transition`}
                        onClick={() => toggleDaySelection(day)}
                      >
                        {day.charAt(0) + day.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pb-16">
                  <button
                    onClick={handleConfirmChange}
                    disabled={loading}
                    className="bg-[#990000] text-white px-4 py-2 rounded-md hover:bg-[#7a0000] transition disabled:opacity-50"
                  >
                    Aplicar configuración
                  </button>
                  <button
                    onClick={() => setIsChangingConfig(false)}
                    disabled={loading}
                    className="ml-4 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => setIsChangingConfig(true)}
                  className="bg-[#990000] text-white px-4 py-2 rounded-md hover:bg-[#7a0000] transition"
                >
                  Cambiar configuración del día
                </button>
              </div>
            )}
          </>
        )}
      </RectanguloConTexto>
    </PageTransitionWrapper>
  );
};
    
export default ScheduleViewer;
