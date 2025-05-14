import React, { useState } from "react";


interface Props {
  etiqueta: string;
  marcador: string;
  opciones: string[];
}

const CampoSelect: React.FC<Props> = ({ etiqueta, opciones, marcador }) => {
  const [valorSeleccionado, setValorSeleccionado] = useState("");

  const manejarCambio = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setValorSeleccionado(event.target.value);
  };

  return (
    <div
      style={{ marginBottom: "1rem", fontFamily: "'Open Sans', sans-serif" }}
    >
      <label
        style={{
          display: "block",
          marginBottom: "4px",
          color: "#2d2d2d",
          fontSize: "20px",
        }}
      >
        {etiqueta}
      </label>

      <select
        style={{
          width: "100%",
          padding: "10px 14px",
          border: "1px solid #8595C9",
          borderRadius: "16px",
          fontSize: "20px",
          color: "#4a4a4a",
          backgroundColor: "#FFFFFF",
          outline: "none",
          fontFamily: "'Open Sans', sans-serif",
        }}
        value={valorSeleccionado}
        onChange={manejarCambio}
      >
        <option value="" disabled>
          {marcador}
        </option>

        {opciones.map((opcion, idx) => (
          <option key={idx} value={opcion}>
            {opcion}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CampoSelect;
