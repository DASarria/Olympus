import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Return } from "@/components/Return";

interface Schedule {
  day: string;       
  startTime: string;   
  endTime: string;     
  available: boolean;  // true = verde, false = rojo
}

const diasOrdenados = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO"];

const ScheduleViewer = () => {
  const router = useRouter();
  const { serviceName } = router.query;

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!serviceName) return;

    const fetchScheduleData = async () => {
      try {
        const response = await fetch("/schedule", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            serviceName: serviceName,
            dayOfWeek: "" 
          }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json(); 
        setSchedules(data.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener horarios:", error);
        setLoading(false);
      }
    };

    fetchScheduleData();
  }, [serviceName]);

  const horariosPorDia = diasOrdenados.map((dia) => ({
    dia,
    bloques: schedules.filter((s) => s.day === dia),
  }));

  return (
    <div className="p-6">
      
      <Return
        className="mb-6"
        text={`Horarios para: ${serviceName}`}
        returnPoint="/UserModule/ScheduleManagement/ServicePage"
      />

      {loading ? (
        <p>Cargando horarios...</p>
      ) : (
        <div className="space-y-6">
          {horariosPorDia.map(({ dia, bloques }) => (
            <div key={dia}>
              <h2 className="text-lg font-semibold">{dia}</h2>

              {bloques.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {bloques.map((bloque, idx) => (
                    <div
                      key={idx}
                      className={`px-4 py-2 rounded text-sm shadow ${
                        bloque.available ? "bg-green-200" : "bg-red-200"
                      }`}
                    >
                      {bloque.startTime} - {bloque.endTime}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Sin horarios configurados</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduleViewer;
