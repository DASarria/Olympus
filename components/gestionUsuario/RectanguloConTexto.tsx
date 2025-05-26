import React, { ReactNode } from "react";

interface Props {
  texto: string;
  ancho?: string;
  alto?: string;
  children?: ReactNode;
  style?: React.CSSProperties;
}

const RectanguloConTexto: React.FC<Props> = ({
  texto,

  children,
  style,
}) => {
  return (
    <div
      style={{
        backgroundColor: "#F7F7F9",
        borderRadius: "16px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        position: "relative",
        padding: "20px",
        width: "90%",
        height: "auto",
        boxSizing: "border-box",
        margin: "0 auto",
        ...style, // <- aquí debes aplicar el style
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "12px",
          left: "16px",
          color: "#990000",
          fontWeight: "bold",
          fontSize: "clamp(20px, 2vw, 26px)"
        }}
      >
        {texto}
      </div>

      <div
        style={{
          marginTop: "40px",
          marginBottom: "1rem",
          fontFamily: "'Open Sans', sans-serif",
        }}
      >
        {children}
      </div>
    </div>
  );
};


export default RectanguloConTexto;
