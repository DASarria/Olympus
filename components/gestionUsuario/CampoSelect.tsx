import React from "react";

interface Props {
  etiqueta: string;
  marcador: string;
  opciones: string[];
  valor: string;
  onChange: (valor: string) => void;
}

const CampoSelect: React.FC<Props> = ({ etiqueta, opciones, marcador, valor, onChange }) => {
  return (
    <div style={{ marginBottom: "1rem", fontFamily: "'Open Sans', sans-serif" }}>
      <label
        style={{
          display: "block",
          marginBottom: "4px",
          color: "#2d2d2d",
          fontSize: "clamp(14px, 2vw, 20px)",
        }}
      >
        {etiqueta}
      </label>

      <select
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 14px",
          border: "1px solid #8595C9",
          borderRadius: "16px",
          fontSize: "clamp(14px, 2vw, 20px)",
          color: "#4a4a4a",
          backgroundColor: "#FFFFFF",
          outline: "none",
          fontFamily: "'Open Sans', sans-serif",
        }}
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

