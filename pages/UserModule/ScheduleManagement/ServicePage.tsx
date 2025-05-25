import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PageTransitionWrapper } from "@/components/PageTransitionWrapper";
import { Return } from "@/components/Return";
import CampoTexto from "@/components/gestionUsuario/CampoTexto";
import RectanguloConTexto from "@/components/gestionUsuario/RectanguloConTexto";
import axios from "axios";

const ServicePage = () => {
  const router = useRouter();
  //const [role, setRole] = useState<string | null>(null);
  const [services, setServices] = useState<string[]>([]);
  const [newServiceName, setNewServiceName] = useState('');
  const [responsibleUser, setResponsibleUser] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    axios
      .get("https://schedulemanagement-bqg2a7a3cgf8hfhc.eastus-01.azurewebsites.net/schedule/service")
      .then((res) => {
        if (res.data?.data) {
          setServices(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Error al obtener servicios:", err.message);
      });
  }, []);

  const addService = async () => {
    const confirmAdd = window.confirm("¿Seguro que desea añadir este servicio?");
    if (!confirmAdd) return;

    if (!newServiceName || !responsibleUser) {
      alert("Complete todos los campos.");
      return;
    }

    try {
      await axios.post("https://schedulemanagement-bqg2a7a3cgf8hfhc.eastus-01.azurewebsites.net/schedule", {
        serviceName: newServiceName,
        responsibleUser: responsibleUser,
      });

      alert("Servicio añadido correctamente");
      setNewServiceName('');
      setResponsibleUser('');
      setShowForm(false);

      axios
        .get("https://schedulemanagement-bqg2a7a3cgf8hfhc.eastus-01.azurewebsites.net/schedule/service")
        .then((res) => {
          if (res.data?.data) {
            setServices(res.data.data);
          }
        });
    } catch (error: any) {
      console.error("Error al añadir servicio:", error.message);
      alert("Error al añadir servicio");
    }
  };

  const deleteService = async (serviceName: string) => {
    const confirmDelete = window.confirm(`¿Está seguro de que desea eliminar el servicio "${serviceName}"?`);
    if (!confirmDelete) return;

    try {
      await axios.delete("https://schedulemanagement-bqg2a7a3cgf8hfhc.eastus-01.azurewebsites.net/schedule", {
        params: { serviceName },
      });

      alert("Servicio eliminado correctamente");
      setServices((prev) => prev.filter((s) => s !== serviceName));
    } catch (error: any) {
      console.error("Error al eliminar servicio:", error.message);
      alert("Error al eliminar servicio");
    }
  };

  return (
    <PageTransitionWrapper>
      <div style={{ padding: "20px", fontFamily: "'Open Sans', sans-serif" }}>
        <Return
          className="!self-stretch !flex-[0_0_auto] !w-full mb-6"
          text="Gestión de Servicios"
          returnPoint="/UserModule/ScheduleManagement/SchedulePage"
        />

        {/* Botón para mostrar formulario */}
        <div style={{ width: "90%", margin: "0 auto 20px" }}>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              width: "100%",
              backgroundColor: "#990000",
              color: "#FFFFFF",
              padding: "12px",
              borderRadius: "16px",
              border: "none",
              fontSize: "clamp(16px, 2vw, 20px)",
              cursor: "pointer",
            }}
          >
            {showForm ? "Cancelar" : "Añadir Servicio"}
          </button>
        </div>

        {/* Formulario de nuevo servicio */}
        {showForm && (
          <RectanguloConTexto texto="Nuevo servicio" style={{ marginBottom: "30px" }}>
            <CampoTexto
              etiqueta="Nombre del servicio"
              marcador="Ej. Salas Crea"
              valor={newServiceName}
              onChange={setNewServiceName}
            />
            <CampoTexto
              etiqueta="Usuario responsable"
              marcador="Ej. Juan Perez"
              valor={responsibleUser}
              onChange={setResponsibleUser}
            />
            <div style={{ textAlign: "center" }}>
              <button
                onClick={addService}
                style={{
                  backgroundColor: "#990000",
                  color: "#FFFFFF",
                  padding: "10px 20px",
                  borderRadius: "12px",
                  fontSize: "clamp(14px, 2vw, 18px)",
                  border: "none",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                Confirmar
              </button>
            </div>
          </RectanguloConTexto>
        )}

        {/* Lista de servicios */}
        {services.length > 0 && (
          <RectanguloConTexto texto="Servicios disponibles">
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {services.map((serviceName) => (
                <div
                  key={serviceName}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid #ccc",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flex: 1,
                      gap: "12px",
                      fontSize: "clamp(14px, 2vw, 18px)",
                    }}
                  >
                    {serviceName}
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() =>
                        router.push(`/UserModule/ScheduleManagement/ScheduleViewer?serviceName=${encodeURIComponent(serviceName)}`)
                      }
                      style={{
                        backgroundColor: "#990000",
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: "8px",
                        padding: "8px 14px",
                        cursor: "pointer",
                        fontSize: "clamp(14px, 2vw, 16px)",
                        minWidth: "70px",
                      }}
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => deleteService(serviceName)}
                      style={{
                        backgroundColor: "#990000",
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: "8px",
                        padding: "8px 14px",
                        cursor: "pointer",
                        fontSize: "clamp(14px, 2vw, 16px)",
                        minWidth: "70px",
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </RectanguloConTexto>
        )}
      </div>
    </PageTransitionWrapper>
  );
};

export default ServicePage;
