import React from "react";
import { motion } from "framer-motion";

interface Props {
  etiqueta: string;
  marcador: string;
  value:string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CampoTextoConfiguration: React.FC<Props> = ({ etiqueta, marcador,value,onChange }) => {
  return (
    <motion.div 
            whileHover={{
                scale: 1.005,
                transition: { duration: 0.15 },
            }}
    >
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
            value={value}
            onChange={onChange}
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
    </motion.div>
  );
};

export default CampoTextoConfiguration;