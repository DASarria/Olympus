import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PageTransitionWrapper } from "@/components/PageTransitionWrapper";
import servicio from "@/assets/images/UserModule/service.png"
import { Return } from "@/components/Return";
import { NavBtn } from "@/components/NavBtn";
import axios from "axios";

//https://usermanagement-bhe9cfg4b5b2hthj.eastus-01.azurewebsites.net

const ServicePage = () => {
  const router = useRouter();
  //const [role, setRole] = useState<string | null>(null);
  const [services, setServices] = useState<string[]>([]);

  useEffect(() => {
    
      axios
        .get("http://localhost:8080/schedule/service")
        .then((res) => {
          if (res.data?.data) {
            setServices(res.data.data);
          }
        })
        .catch((err) => {
          console.error("Error al obtener servicios:", err.message);
        });

  }, []);

  return (
    <PageTransitionWrapper>
      <div>
        <Return
          className="!self-stretch !flex-[0_0_auto] !w-full mb-6"
          text="Servicios"
          returnPoint="/UserModule/ScheduleManagement/SchedulePage"
        />
      </div>

      <div className="max-w-[40vw] max-h-[80vh] overflow-y-auto p-2 bg-gray-50 rounded-md shadow-md ml-0">
        <div className="flex flex-wrap items-start gap-2 relative">
          {
            services.map((serviceName) => (
              <NavBtn
                image={{src:servicio.src}}
                texto={serviceName}
                navigate={`/UserModule/ScheduleManagement/ScheduleViewer?serviceName=${encodeURIComponent(serviceName)}`}
              />
            ))}
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default ServicePage;
