import React, { ReactNode } from "react";
import RectanguloConTexto from "./RectanguloConTextoConfiguration";

interface Interval{
        startTime: string;        
        endTime: string; 
        reason:string;
    }
interface ConfigurationProps{              
        name: string;             
        startTime: string;        
        endTime: string;
        breakIntervals: Interval[];
        attentionIntervals: Interval[];
    }


const ConfigurationContainer: React.FC<ConfigurationProps> =({
        name,
        startTime,
        endTime,
        breakIntervals,
        attentionIntervals
    }) => {
        return(
            <>
                <RectanguloConTexto texto={name}>
                    <div className="text-sm text-gray-800 mt-3 space-y-4">

                        <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-100 p-2 rounded-md">
                            <span className="font-semibold text-gray-600">🕒 Inicio:</span><br />
                            {startTime}
                        </div>
                        <div className="bg-gray-100 p-2 rounded-md">
                            <span className="font-semibold text-gray-600">🕒 Fin:</span><br />
                            {endTime}
                        </div>
                        </div>

                        <div>
                        <h3 className="font-semibold text-red-700 text-md mb-1"> Pausas</h3>
                        <ul className="space-y-1 pl-4 border-l-2 border-red-300">
                            {breakIntervals.map((interval, index) => (
                            <li key={`break-${index}`} className="text-gray-700">
                                <span className="font-medium">{interval.startTime} - {interval.endTime}</span><br />
                                <span className="text-xs italic text-gray-500">Motivo: {interval.reason}</span>
                            </li>
                            ))}
                        </ul>
                        </div>

                        <div>
                        <h3 className="font-semibold text-green-700 text-md mb-1"> Intervalos de Atención</h3>
                        <ul className="space-y-1 pl-4 border-l-2 border-green-300">
                            {attentionIntervals.map((interval, index) => (
                            <li key={`attention-${index}`} className="text-gray-700">
                                <span className="font-medium">{interval.startTime} - {interval.endTime}</span><br />
                                <span className="text-xs italic text-gray-500">Motivo: {interval.reason}</span>
                            </li>
                            ))}
                        </ul>
                        </div>
                    </div>
                </RectanguloConTexto>
            </>
        )
    }

export default ConfigurationContainer;