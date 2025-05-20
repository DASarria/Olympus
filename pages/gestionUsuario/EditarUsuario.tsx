import { Return } from "@/components/Return";
import { withRoleProtection } from "@/hoc/withRoleProtection";
import CampoSelect from "@/components/gestionUsuario/CampoSelect";
import CampoTexto from "@/components/gestionUsuario/CampoTexto";
import RectanguloConTexto from "@/components/gestionUsuario/RectanguloConTexto";

const Routines = () => {
  const role: string = "TRAINER";

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "'Open Sans', sans-serif",
      }}
    >
      <Return
        className="!self-stretch !flex-[0_0_auto] !w-full mb-6"
        text="Gestión de Usuarios"
        returnPoint="/gym-module/Routines"
      />

      <RectanguloConTexto texto="Agregar Usuario" ancho="100%" alto="auto">
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "5px 40px",
      width: "100%",
      boxSizing: "border-box",
    }}
  >
    {[
      {
        comp: (
          <CampoSelect
            etiqueta="Tipo de usuario"
            marcador="Selecciona un tipo de usuario"
            opciones={["Usuario", "Administrador"]}
          />
        ),
        ancho: "100%",
      },
    ].map(({ comp, ancho }, i) => (
      <div
        key={i}
        style={{
          flex: `1 1 ${ancho || "calc(50% - 20px)"}`,
          minWidth: "200px",
        }}
      >
        {comp}
      </div>
    ))}

    <div style={{ marginTop: "10px" }}>
      <button
        onClick={() => (window.location.href = "/gym-module/Reservations")}
        style={{
          backgroundColor: "#990000",
          color: "#ffffff",
          fontFamily: "'Open Sans', sans-serif",
          borderRadius: "16px",
          padding: "10px 20px",
          border: "none",
          cursor: "pointer",
          fontSize: "20px",
        }}
      >
        Crear Usuario
      </button>
    </div>
  </div>
</RectanguloConTexto>


      <div style={{ marginTop: "30px" }}>
        <RectanguloConTexto texto="Editar usuario" ancho="100%" alto="auto">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "5px 40px",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            {[
              {
                comp: <CampoTexto etiqueta="Nombre" marcador="Digite nombre completo" />,
              },
              {
                comp: (
                  <CampoSelect
                    etiqueta="Programa académico"
                    marcador="Seleccione programa académico"
                    opciones={[
                      "Ingeniería de Sistemas",
                      "Ingeniería Electrónica",
                      "Ingeniería Mecánica",
                      "Ingeniería Eléctrica",
                      "Matemática",
                      "Estadística",
                      "Ingeniería Biomédica",
                    ]}
                  />
                ),
              },
              {
                comp: (
                  <CampoTexto
                    etiqueta="Número de documento"
                    marcador="Digite número de documento"
                  />
                ),
                ancho: "32.8%",
              },
              {
                comp: (
                  <CampoTexto
                    etiqueta="Carnet estudiantil"
                    marcador="Digite número de Carnet estudiantil"
                  />
                ),
                ancho: "32.8%",
              },
              {
                comp: (
                  <CampoSelect
                    etiqueta="Tipo de usuario"
                    marcador="Selecciona un tipo de usuario"
                    opciones={["Usuario", "Administrador"]}
                  />
                ),
                ancho: "32.8%",
              },
            ].map(({ comp, ancho }, i) => (
              <div
                key={i}
                style={{
                  flex: `1 1 ${ancho || "calc(50% - 20px)"}`,
                  minWidth: "200px",
                }}
              >
                {comp}
              </div>
            ))}

            <div style={{ marginTop: "40px" }}>
              <button
                onClick={() => (window.location.href = "/gym-module/Routines")}
                style={{
                  backgroundColor: "#990000",
                  color: "#ffffff",
                  fontFamily: "'Open Sans', sans-serif",
                  borderRadius: "16px",
                  padding: "10px 20px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "20px",
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
};


export default withRoleProtection(["USER", "TRAINER"], "/Module5")(Routines);