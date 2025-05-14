import React from "react";


interface Props {
  etiqueta: string;
  marcador: string;
}

const CampoTexto: React.FC<Props> = ({ etiqueta, marcador }) => {
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
      <input
        type="text"
        placeholder={marcador}
        style={{
          width: "100%",
          padding: "10px 14px",
          border: "1px solid #8595C9",
          borderRadius: "16px",
          fontSize: "20px",
          color: "",
          backgroundColor: "#FFFFFF",
          outline: "none",
          fontFamily: "'Open Sans', sans-serif",
        }}
      />
    </div>
  );
};

export default CampoTexto;
