import React from "react";

type ActividadTarjetaProps = {
  activityType: string;
  fecha: string;
  startHour: string;
  endHour: string;
  asiste: string;
};

const componenteActividad = "shrink-0 bg-white border border-[#3358A1] w-[25vw] h-[25vh] rounded-2xl flex flex-col shadow-[0_-5px_2px_0px_#3358A1] box-border";


const divActividadNombre = "bg-[#3358A1]/30 backdrop-blur-md text-left w-full rounded-t-2xl box-border p-1 flex items-center justify-center";
const actividadNombre = "text-white text-[1.25rem] font-bold flex items-center justify-center m-2";

const divActividadContenido = "bg-white flex flex-col justify-between p-2 rounded-b-2xl flex-grow";


const actividadContenidoSeccion = "text-[#3358A1] font-bold text-[0.94rem]";
const actividadContenido = "text-[#3358A1] text-[0.94rem] font-semibold pl-4";

const ActividadTarjeta: React.FC<ActividadTarjetaProps> = ({ activityType, fecha, startHour, endHour, asiste }) => {
  return (
    <div className={componenteActividad}>
      <div className={divActividadNombre}>
        <h2 className={actividadNombre}>{activityType}</h2>
      </div>

      <div className={divActividadContenido}>
        <h3 className={actividadContenidoSeccion}>Fecha:</h3>
        <h3 className={actividadContenido}>{fecha}</h3>

        <h3 className={actividadContenidoSeccion}>Horario:</h3>
        <h3 className={actividadContenido}>{startHour} - {endHour}</h3>

        <h3 className={actividadContenidoSeccion}>Asiste:</h3>
        <h3 className={actividadContenido}>{asiste}</h3>
      </div>
    </div>
  );
};

export default ActividadTarjeta;
