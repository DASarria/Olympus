import { Return } from "@/components/Return"
import { withRoleProtection } from "@/hoc/withRoleProtection";
import CampoSelect from "@/components/gestionUsuario/CampoSelect";
import CampoTexto from "@/components/gestionUsuario/CampoTexto";
import RectanguloConTexto from "@/components/gestionUsuario/RectanguloConTexto";

const Reservations = () => {
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
            text="Crear usuario"
            returnPoint="/gym-module/Routines"
        />

      <RectanguloConTexto texto="Informacion Personal" ancho="1500px" alto="500px">
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
      <CampoTexto etiqueta="Correo" marcador="Digite correo electronico del estudiante" />
    </div>
    <div style={{ width: "calc(50% - 20px)" }}>
      <CampoSelect etiqueta="Tipo de documento" marcador="Seleccione tipo de documento"
        opciones={["CC", "TI"]}/>
    </div>
    <div style={{ width: "calc(50% - 20px)" }}>
      <CampoTexto etiqueta="Número de documento" marcador="Digite número de documento" />
    </div>
    <div style={{ width: "calc(50% - 20px)" }}>
      <CampoSelect etiqueta="Programa académico" marcador="Seleccione programa académico"
        opciones={["Ingeniería de Sistemas","Ingeniería Electrónica","Ingeniería Mecánica","Ingeniería Eléctrica","Matemática","Estadística","Ingeniería Biomédica"]}/>
    </div>
    <div style={{ width: "calc(50% - 20px)" }}>
      <CampoTexto etiqueta="Carnet estudiantil" marcador="Digite numero de Carnet estudiantil" />
    </div>

    <div style={{ width: "calc(32.8% - 20px)" }}>
      <CampoTexto etiqueta="Numero telefónico" marcador="Digite numero telefónico" />
    </div>
    <div style={{ width: "calc(32.8% - 20px)" }}>
      <CampoTexto etiqueta="Cumpleaños" marcador="DD/MM" />
    </div>
    <div style={{ width: "calc(32.8% - 20px)" }}>
      <CampoTexto etiqueta="Dirección" marcador="Digite dirección" />
    </div>

  </div>
</RectanguloConTexto>

<div style={{ marginTop: "30px" }}>
  <RectanguloConTexto texto="Contacto de emergencia " ancho="1500px" alto="280px">
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
        <CampoTexto etiqueta="Relación" marcador="Digite relación con el estudiante" />
      </div>
      <div style={{ width: "calc(32.8% - 20px)" }}>
        <CampoSelect etiqueta="Tipo de documento" marcador="Seleccione tipo de documento"
          opciones={["CC", "TI"]}/>
      </div>
      <div style={{ width: "calc(32.8% - 20px)" }}>
        <CampoTexto etiqueta="Número de documento" marcador="Digite número de documento" />
      </div>
      <div style={{ width: "calc(32.8% - 20px)" }}>
        <CampoTexto etiqueta="Numero telefónico" marcador="Digite numero telefónico" />
      </div>
      
    </div>
  </RectanguloConTexto>
</div>

<div style={{ marginTop: "30px" }}>
  <RectanguloConTexto texto="Segundo Contacto de emergencia (Opcional)" ancho="1500px" alto="280px">
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
        <CampoTexto etiqueta="Relación" marcador="Digite relación con el estudiante" />
      </div>
      <div style={{ width: "calc(32.8% - 20px)" }}>
        <CampoSelect etiqueta="Tipo de documento" marcador="Seleccione tipo de documento"
          opciones={["CC", "TI"]}/>
      </div>
      <div style={{ width: "calc(32.8% - 20px)" }}>
        <CampoTexto etiqueta="Número de documento" marcador="Digite número de documento" />
      </div>
      <div style={{ width: "calc(32.8% - 20px)" }}>
        <CampoTexto etiqueta="Numero telefónico" marcador="Digite numero telefónico" />
      </div>
      
    </div>
  </RectanguloConTexto>
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
    Crear Usuario
  </button>
</div>

    </div>
  );
}


export default withRoleProtection(["USER", "TRAINER"], "/Module5")(Reservations);