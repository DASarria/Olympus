import React from "react";

interface Props {
  etiqueta: string;
  marcador: string;
  valor: string;
  onChange: (valor: string) => void;
  soloLectura?: boolean;
}

const CampoTexto: React.FC<Props> = ({ etiqueta, marcador, valor, onChange, soloLectura }) => {
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
      <input
        type="text"
        placeholder={marcador}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        readOnly={soloLectura}
        style={{
          width: "100%",
          padding: "10px 14px",
          border: "1px solid #8595C9",
          borderRadius: "16px",
          fontSize: "clamp(14px, 2vw, 20px)",
          backgroundColor: "#FFFFFF",
          outline: "none",
          fontFamily: "'Open Sans', sans-serif",
        }}
      />
    </div>
  );
};

export default CampoTexto;
