import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  texto: string;
  ancho?: string;
  alto?: string;
  children?: ReactNode;
}

const RectanguloConTextoConfiguration: React.FC<Props> = ({
  texto,
  ancho = "100%",
  alto = "100%",
  children,
}) => {
  return (
    <motion.div
            whileHover={{
                scale: 1,
                transition: { duration: 0.15 },
            }}
    >
        <div
        style={{
            backgroundColor: "#F7F7F9",
            borderRadius: "16px",
            boxShadow: "0 4px 8px rgba(0, 44, 238, 0.1)",
            position: "relative",
            padding: "20px",
            width: ancho,
            height: alto,
            boxSizing: "border-box",
        }}
        >
        <div
            style={{
            position: "absolute",
            top: "12px",
            left: "16px",
            color: "#990000",
            fontWeight: "bold",
            fontSize: "26px",
            }}
        >
            {texto}
        </div>

        {/* Contenido interno con estilos generales */}
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
    </motion.div>
  );
};

export default RectanguloConTextoConfiguration;