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

const ScheduleViewer = () => {
  const router = useRouter();
  const { serviceName } = router.query;

  const [dayOfWeek, setDayOfWeek] = useState("");
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [configMap, setConfigMap] = useState<Record<string, Configuration>>({});
  const [loading, setLoading] = useState(false);

  const removeAccents = (text: string) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const fetchSchedules = async () => {
    if (!router.isReady || typeof serviceName !== "string" || !dayOfWeek) return;

    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/schedule", {
        params: {
          serviceName,
          dayOfWeek: removeAccents(dayOfWeek.toLowerCase()),
        },
      });

      const scheduleList: Schedule[] = res.data.data;
      setSchedules(scheduleList);

      const newConfigMap: Record<string, Configuration> = {};

      await Promise.all(scheduleList.map(async (schedule) => {
        if (!newConfigMap[schedule.idConfiguration]) {
          try {
            const configRes = await axios.get("http://localhost:8080/configuration/id", {
              params: { id: schedule.idConfiguration },
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
    } catch (error) {
      console.error("Error al obtener horarios:", error);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [router.isReady, dayOfWeek, serviceName]);

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
          className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
        <div className="space-y-6">
          {schedules.map((schedule) => {
            const config = configMap[schedule.idConfiguration];

            return (
              <article
                key={schedule.id}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
              >
                <h2 className="text-xl font-bold mb-3 text-indigo-700">{schedule.serviceSpaceType}</h2>

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
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M12 12h.01" />
                        </svg>
                        Intervalos de descanso
                      </h3>
                      {config.breakIntervals.length === 0 ? (
                        <p className="text-gray-500 text-sm">Ninguno</p>
                      ) : (
                        <ul className="list-disc list-inside text-red-600 text-sm space-y-1">
                          {config.breakIntervals.map((interval, index) => (
                            <li key={index}>
                              <span className="font-semibold">{interval.startTime} - {interval.endTime}</span>
                              {interval.reason && <span className="italic ml-1">({interval.reason})</span>}
                            </li>
                          ))}
                        </ul>
                      )}
                    </section>

                    <section>
                      <h3 className="text-green-600 font-semibold mb-2 flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-3-3v6" />
                        </svg>
                        Intervalos de atención
                      </h3>
                      {config.attentionIntervals.length === 0 ? (
                        <p className="text-gray-500 text-sm">Ninguno</p>
                      ) : (
                        <ul className="list-disc list-inside text-green-600 text-sm space-y-1">
                          {config.attentionIntervals.map((interval, index) => (
                            <li key={index}>
                              <span className="font-semibold">{interval.startTime} - {interval.endTime}</span>
                              {interval.reason && <span className="italic ml-1">({interval.reason})</span>}
                            </li>
                          ))}
                        </ul>
                      )}
                    </section>
                  </>
                ) : (
                  <p className="text-red-500">Configuración no disponible</p>
                )}
              </article>
            );
          })}
        </div>
      )}
      </RectanguloConTexto>
    </PageTransitionWrapper>
  );
};

export default ScheduleViewer;
