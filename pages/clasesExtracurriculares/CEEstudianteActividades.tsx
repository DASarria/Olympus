import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import ActividadTarjeta from '../../components/clasesExtracurriculares/ActividadTarjeta';



const borderRadius = "rounded-2xl";
const divGeneral = " w-[75vw] h-[75vh] flex flex-col  mt-[4vh] items-center justify-center";
const titulo = "w-full h-[10%] flex items-center justify-start p-4 box-border";
const h1 = "text-[#990000] text-4xl font-semibold text-left";
const divComponentes = "w-full h-full overflow-x-auto overflow-y-hidden px-4 py-2 flex flex-row gap-4 items-center scrollbar-custom";










const CEEstudianteActividades = () => {

    return(
        <div className={divGeneral}>
            <div className={titulo}>
                <h1 className={h1}>Actividades</h1>
            </div>
            <div className={divComponentes}>
                <ActividadTarjeta
  activityType="VOLEIBOL"
  fecha="20/05/2025"
  startHour="01:00 p.m."
  endHour="03:00 p.m."
  asiste="SI / NO"
/>

                <ActividadTarjeta
  activityType="VOLEIBOL"
  fecha="20/05/2025"
  startHour="01:00 p.m."
  endHour="03:00 p.m."
  asiste="SI / NO"
/>
                <ActividadTarjeta
  activityType="VOLEIBOL"
  fecha="20/05/2025"
  startHour="01:00 p.m."
  endHour="03:00 p.m."
  asiste="SI / NO"
/>
                <ActividadTarjeta
  activityType="VOLEIBOL"
  fecha="20/05/2025"
  startHour="01:00 p.m."
  endHour="03:00 p.m."
  asiste="SI / NO"
/>
                <ActividadTarjeta
  activityType="VOLEIBOL"
  fecha="20/05/2025"
  startHour="01:00 p.m."
  endHour="03:00 p.m."
  asiste="SI / NO"
/>
                <ActividadTarjeta
  activityType="VOLEIBOL"
  fecha="20/05/2025"
  startHour="01:00 p.m."
  endHour="03:00 p.m."
  asiste="SI / NO"
/>
                <ActividadTarjeta
  activityType="VOLEIBOL"
  fecha="20/05/2025"
  startHour="01:00 p.m."
  endHour="03:00 p.m."
  asiste="SI / NO"
/>
                <ActividadTarjeta
  activityType="VOLEIBOL"
  fecha="20/05/2025"
  startHour="01:00 p.m."
  endHour="03:00 p.m."
  asiste="SI / NO"
/>
                <ActividadTarjeta
  activityType="VOLEIBOL"
  fecha="20/05/2025"
  startHour="01:00 p.m."
  endHour="03:00 p.m."
  asiste="SI / NO"
/>
                <ActividadTarjeta
  activityType="VOLEIBOL"
  fecha="20/05/2025"
  startHour="01:00 p.m."
  endHour="03:00 p.m."
  asiste="SI / NO"
/>
                <ActividadTarjeta
  activityType="VOLEIBOL"
  fecha="20/05/2025"
  startHour="01:00 p.m."
  endHour="03:00 p.m."
  asiste="SI / NO"
/>

                

            </div>
        </div>
    );
};

export default CEEstudianteActividades;