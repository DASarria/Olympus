import { useState } from "react";
// import useRouter removed as it wasn't being used
import { saveAs } from "file-saver";
import { Return } from "@/components/Return";
import Button from "@/components/gym-module/Button";
import { ReportFormat, getGymUsageReport, getAttendanceReport, getUserProgressReport } from "@/api/gymServicesIndex";
import { PageTransitionWrapper } from "@/components/PageTransitionWrapper";

const ExportReports = () => {
    // router removed as it wasn't being used

    const [reportType, setReportType] = useState<"gymUsage" | "attendance" | "userProgress">("gymUsage");
    const [format, setFormat] = useState<ReportFormat>(ReportFormat.PDF);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [userId, setUserId] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    async function handleDownload() {
        setLoading(true);
        setMessage(null);
        try {
        let blob: Blob;

        if (reportType === "gymUsage") {
            if (!startDate || !endDate) throw new Error("Debes seleccionar fechas");
            blob = await getGymUsageReport(startDate, endDate, format);
        } else if (reportType === "attendance") {
            if (!startDate || !endDate) throw new Error("Debes seleccionar fechas");
            blob = await getAttendanceReport(startDate, endDate, format);
        } else {
            if (!userId) throw new Error("Debes ingresar un ID de usuario");
            blob = await getUserProgressReport(userId, format);
        }

        // Descargar el archivo usando file-saver
        const fileName = `reporte-${reportType}-${new Date().toISOString().slice(0,10)}.${format.toLowerCase()}`;
        saveAs(blob, fileName);

        setMessage("Reporte descargado con éxito");        } catch (e: Error | unknown) {
        const errorMessage = e instanceof Error ? e.message : "No se puede obtener la información en estos momentos.";
        setMessage(`Error: ${errorMessage}`);
        }
        setLoading(false);
    }

    return (
        <PageTransitionWrapper>
            <div className="flex flex-col p-4 gap-6 w-full">
                <Return 
                    className="!self-stretch !flex-[0_0_auto] !w-full"
                    text="Analisis"
                    returnPoint="/gym-module/analysis"
                />
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold mb-4">Exportar Reporte</h1>
                    <label className="block mb-2 font-semibold">Tipo de reporte:</label>
                    <select
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value as "gymUsage" | "attendance" | "userProgress")}
                        className="w-full mb-4 p-2 border rounded"
                    >
                        <option value="gymUsage">Uso del Gimnasio</option>
                        <option value="attendance">Asistencia</option>
                        <option value="userProgress">Progreso de Usuario</option>
                    </select>

                    {(reportType === "gymUsage" || reportType === "attendance") && (
                        <>
                        <label className="block mb-1 font-semibold">Fecha inicio:</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full mb-2 p-2 border rounded"
                        />
                        <label className="block mb-1 font-semibold">Fecha fin:</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full mb-4 p-2 border rounded"
                        />
                        </>
                    )}

                    {reportType === "userProgress" && (
                        <>
                        <label className="block mb-2 font-semibold">ID Usuario:</label>
                        <input
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="w-full mb-4 p-2 border rounded"
                            placeholder="Ingrese ID del usuario"
                        />
                        </>
                    )}

                    <label className="block mb-2 font-semibold">Formato:</label>
                    <select
                        value={format}
                        onChange={(e) => setFormat(e.target.value as ReportFormat)}
                        className="w-full mb-4 p-2 border rounded"
                    >
                        {Object.values(ReportFormat).map((f) => (
                        <option key={f} value={f}>
                            {f}
                        </option>
                        ))}
                    </select>
                    
                    <Button 
                        className="inline-flex w-fit items-center gap-2.5 px-10 py-2.5 relative bg-[var(--lavender)] rounded-[15px] overflow-hidden border-box"
                        disabled={loading}
                        onClick={handleDownload}
                    >
                        <span className="relative w-fit mt-[-1.00px] [font-family: 'Montserrat-Regular',Helvetica] text-white tracking-[0] leading-[16px] whitespace-nowrap">
                            {loading ? "Descargando..." : "Descargar Reporte"}
                        </span>
                    </Button>

                    {message && <p className="mt-4 text-center">{message}</p>}
                </div>
            </div>
        </PageTransitionWrapper>
    );
};

export default ExportReports;
