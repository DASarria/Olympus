import { Return } from "@/components/Return"
import { withRoleProtection } from "@/hoc/withRoleProtection";
import CampoSelect from "@/components/gestionUsuario/CampoSelect";
import CampoTexto from "@/components/gestionUsuario/CampoTexto";
import RectanguloConTexto from "@/components/gestionUsuario/RectanguloConTexto";

const Routines = () => {
    //const role = typeof window !== 'undefined' ? sessionStorage.getItem("role") : null;
    const role: string = "TRAINER";

    return (
        <div
          style={{
            padding: "20px",
            //maxWidth: "300px",
            fontFamily: "'Open Sans', sans-serif",
          }}
        >
          <Return 
                className="!self-stretch !flex-[0_0_auto] !w-full mb-6"
                text="Gestión de Usuarios"
                returnPoint="/gym-module/Routines"
            />
    
          <RectanguloConTexto texto="Agregar Usuario" ancho="1500px" alto="250px">
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "5px 40px",
          width: "100%",
          boxSizing: "border-box",
          maxWidth: "1460px",
        }}
      >
        
        <div style={{ width: "100%" }}>
          <CampoSelect etiqueta="Tipo de usuario" marcador="Selecciona un tipo de usuario"
            opciones={["Usuario", "Administrador"]}/>
        </div>
    
        <div style={{ marginTop: "10px" }}>
      <button
        onClick={() => window.location.href = "/gym-module/Reservations"} // Ajusta esta ruta
        style={{
          backgroundColor: "#990000",
          color: "#ffffff",
          fontFamily: "'Open Sans', sans-serif",
          borderRadius: "16px",
          padding: "10px 20px",
          border: "none",
          cursor: "pointer",
          fontSize: "20px"
        }}
      >
        Crear Usuario
      </button>
    </div>

      </div>
    </RectanguloConTexto>
    
    <div style={{ marginTop: "30px" }}>
      <RectanguloConTexto texto="Editar usuario" ancho="1500px" alto="400px">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "5px 40px",
            width: "100%",
            boxSizing: "border-box",
            maxWidth: "1460px",
          }}
        >

    <div style={{ width: "calc(50% - 20px)" }}>
      <CampoTexto etiqueta="Nombre" marcador="Digite nombre completo" />
    </div>

    <div style={{ width: "calc(50% - 20px)" }}>
      <CampoSelect etiqueta="Programa académico" marcador="Seleccione programa académico"
        opciones={["Ingeniería de Sistemas","Ingeniería Electrónica","Ingeniería Mecánica","Ingeniería Eléctrica","Matemática","Estadística","Ingeniería Biomédica"]}/>
    </div>
    
    <div style={{ width: "calc(32.8% - 20px)" }}>
      <CampoTexto etiqueta="Número de documento" marcador="Digite número de documento" />
    </div>
    
    <div style={{ width: "calc(32.8% - 20px)" }}>
      <CampoTexto etiqueta="Carnet estudiantil" marcador="Digite numero de Carnet estudiantil" />
    </div>

        <div style={{ width: "calc(32.8% - 20px)" }}>
          <CampoSelect etiqueta="Tipo de usuario" marcador="Selecciona un tipo de usuario"
            opciones={["Usuario", "Administrador"]}/>
        </div>  
          
        <div style={{ marginTop: "40px" }}>
      <button
        onClick={() => window.location.href = "/gym-module/Routines"} // Ajusta esta ruta
        style={{
          backgroundColor: "#990000",
          color: "#ffffff",
          fontFamily: "'Open Sans', sans-serif",
          borderRadius: "16px",
          padding: "10px 20px",
          border: "none",
          cursor: "pointer",
          fontSize: "20px"
        }}
      >
        Buscar
      </button>
    </div>

        </div>
      </RectanguloConTexto>
    </div>
    
    
    
    
        </div>
      );
}


export default withRoleProtection(["USER", "TRAINER"], "/Module5")(Routines);