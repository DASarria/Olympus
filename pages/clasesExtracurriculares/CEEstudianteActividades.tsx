import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import ActividadTarjeta from "../../components/clasesExtracurriculares/ActividadTarjeta";

const borderRadius = "rounded-2xl";
const divGeneral = " w-[75vw] h-[75vh] flex flex-col  mt-[4vh] items-center justify-center";
const titulo = "w-full h-[10%] flex items-center justify-start p-4 box-border";
const h1 = "text-[#990000] text-4xl font-semibold text-left";
const divComponentes = "w-full h-full overflow-x-auto overflow-y-auto px-4 py-2 flex flex-col sm:flex-row gap-4 items-center scrollbar-custom";


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

interface Tarjeta {
    id: string;
    activityType: string;
    date: string;
    startHour: string;
    endHour: string;
    asiste: string;
}

interface Day {
    dayWeek: string;
    startHour: string;
    endHour: string;
}

interface Recurso {
    name: string;
    amount: number;
}

const dayWeekMap: Record<string, string> = {
    MONDAY: "Lunes",
    TUESDAY: "Martes",
    WEDNESDAY: "Miércoles",
    THURSDAY: "Jueves",
    FRIDAY: "Viernes",
    SATURDAY: "Sábado",
    SUNDAY: "Domingo",
};

const CEEstudianteActividades = () => {
    const [actividadesTemp, setActividadesTemp] = useState<Actividad[]>([]);
    const [actividades, setActividades] = useState<Tarjeta[]>([]);


    const tokenJWT =
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMTMyMTQxIiwidXNlck5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AZXNjdWVsYWluZy5lZHUuY28iLCJuYW1lIjoiZWwgYWRtaW4iLCJyb2xlIjoiQURNSU4iLCJzcGVjaWFsdHkiOiJudWxsIiwiZXhwIjoxNzQ4MDQzMzcwfQ.qRQ638qL8IGyG2OxPO3I3ygPrX0c1u2QZhUwdwyq7_o";

    const linkAPI =
        "https://hadesback-app-c5fwbybjd0gnf0fx.canadacentral-01.azurewebsites.net";



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



    useEffect(() => {
        fetchActividades();
    }, []);

    //Para llenar las tarjetas
    useEffect(() => {
        if (actividadesTemp.length > 0) {

            const tarjetas: Tarjeta[] = [];

            actividadesTemp.forEach((act:Actividad) => {
                act.days.forEach((day:Day)=>{
                    tarjetas.push({
                        id: act.id,
                        activityType: act.activityType,
                        date: dayWeekMap[day.dayWeek] || day.dayWeek,
                        startHour:  day.startHour.slice(0, 5),
                        endHour: day.endHour.slice(0,5),
                        asiste: "SI / NO"
                    });
                });
            });
            setActividades(tarjetas);
        }
    }, [actividadesTemp]);



    return (
        <div className={divGeneral}>
            <div className={titulo}>
                <h1 className={h1}>Actividades</h1>
            </div>
            <div className={divComponentes}>
                {actividades.map((actividad:Tarjeta) => (
                    <ActividadTarjeta
                    key={actividad.id}
                    activityType={actividad.activityType}
                    fecha={actividad.date}
                    startHour={actividad.startHour}
                    endHour={actividad.endHour}
                    asiste={actividad.asiste}
                    />
                    ))}
            </div>
        </div>
    );
};

export default CEEstudianteActividades;
