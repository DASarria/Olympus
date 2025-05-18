import { Return } from "@/components/Return"
import { withRoleProtection } from "@/hoc/withRoleProtection";
import { FilterBtn } from "@/components/gym-module/FilterBtn";
import UserIcon from '@/assets/icons/user-filter.svg';
import { useState } from "react";
import { PageTransitionWrapper } from "@/components/PageTransitionWrapper";

const PhysicalProgress = () => {
    //const role = typeof window !== 'undefined' ? sessionStorage.getItem("role") : null;
    const role: string = "TRAINER";

    const [openSearch, setOpenSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Dummy list
    const students = [
        "Ana González",
        "Carlos Pérez",
        "María Rodríguez",
        "Juan Martínez"
    ];

    const filteredStudents = students.filter(student =>
        student.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <PageTransitionWrapper>
            <div className="flex flex-col w-full items-center gap-5 pt-0 pb-20 px-0 relative">
                <Return 
                    className="!self-stretch !flex-[0_0_auto] !w-full"
                    text="Progreso fisico"
                    returnPoint="/gym-module"
                />
                {/* Load filters */}
                <div className="flex flex-col w-fit items-center gap-5 pt-0 pb-20 px-0 relative flex-[0_0_auto]">
                    <div className="flex items-start gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
                        <FilterBtn
                            icon={UserIcon}
                            text="Estudiante"
                            type="search"
                            action={(term: string) => setSearchTerm(term)}
                        />
                    </div>

                    <div className="flex items-start gap-5 relative">
                        <div className="inline-flex flex-col h-[232px] items-start justify-center gap-5 px-20 py-[30px] relative flex-[0_0_auto] bg-[#eaeaea] rounded-[20px] overflow-hidden">
                            <div className="relative w-fit mt-[-1.00px] font-subtitulo-font-size font-[number:var(--titulo-font-weight)] text-black text-[length:var(--subtitulo-font-size)] tracking-[var:(--titulo-letter-spacing)] leading-[var(--titulo-line-heihgt)]">
                                Peso
                            </div>
                            <div className="inline-flex items-end gap-2.5 relative flex-[0_0_auto]">
                                <div className="relative w-fit mt-[-1.00px] [font-family: 'Montserrat-Bold', Helvetica] font-bold text-black text-[42px] tracking-[0] leading-[normal]">
                                    63.2
                                </div>
                                <div className="relative w-fit [font-family: 'Montserrat-Bold', Helvetica] font-bold text-black text-lg tracking-[0] leading-[normal]">
                                    kg
                                </div>
                            </div>
                            <div className="relative w-fit [font-family: 'Montserrat-Bold', Helvetica] font-bold text-black text-base tracking-[0] leading-[normal]">
                                Últimos 30 días
                            </div>
                        </div>
                        <div className="inline-flex flex-col h-[232px] items-start justify-center gap-5 px-20 py-[30px] relative flex-[0_0_auto] bg-[#eaeaea] rounded-[20px] overflow-hidden">
                            <div className="relative w-fit mt-[-1.00px] font-subtitulo-font-size font-[number:var(--titulo-font-weight)] text-black text-[length:var(--subtitulo-font-size)] tracking-[var:(--titulo-letter-spacing)] leading-[var(--titulo-line-heihgt)]">
                                Altura
                            </div>
                            <div className="inline-flex items-end gap-2.5 relative flex-[0_0_auto]">
                                <div className="relative w-fit mt-[-1.00px] [font-family: 'Montserrat-Bold', Helvetica] font-bold text-black text-[42px] tracking-[0] leading-[normal]">
                                    173
                                </div>
                                <div className="relative w-fit [font-family: 'Montserrat-Bold', Helvetica] font-bold text-black text-lg tracking-[0] leading-[normal]">
                                    cm
                                </div>
                            </div>
                        </div>
                        <div className="inline-flex flex-col h-[232px] items-start justify-center gap-5 px-20 py-[30px] relative flex-[0_0_auto] bg-[#eaeaea] rounded-[20px] overflow-hidden">
                            <div className="inline-flex items-center gap-5 relative flex-[0_0_auto]">
                                <div className="relative w-fit mt-[-1.00px] font-subtitulo-font-size font-[number:var(--titulo-font-weight)] text-black text-[length:var(--subtitulo-font-size)] tracking-[var:(--titulo-letter-spacing)] leading-[var(--titulo-line-heihgt)]">
                                    IMC
                                </div>
                                <div className="relative w-fit mt-[-1.00px] [font-family: 'Montserrat-Bold', Helvetica] font-bold text-black text-[42px] tracking-[0] leading-[normal]">
                                    20.6
                                </div>
                                <div className="inline-flex items-center gap-2.5 p-2.5 relative flex-[0_0_auto]">
                                    <div className="relative w-3.5 h-3.5 bg-[#008000] rounded-[var(--size-radius-full)]"/>
                                    <div className="relative w-fit [font-family: 'Montserrat-Bold', Helvetica] font-bold text-black text-lg tracking-[0] leading-[normal]">
                                        Peso saludable
                                    </div>
                                </div>
                            </div>
                            <div className="relative self-stretch w-full h-0.5 bg-[#dadada] rounded-[50px]"/>
                            <div className="relative w-fit [font-family: 'Montserrat-Bold', Helvetica] font-bold text-black text-base tracking-[0] leading-[normal]">
                                Últimos 30 días
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col w-full items-start gap-2.5 px-20 py-[30px] relative bg-[#eaeaea] rounded-[20px] overflow-hidden">
                        <div className="relative w-fit mt-[-1.00px] mb-[1.00px] font-subtitulo-font-size font-[number:var(--titulo-font-weight)] text-black text-[length:var(--subtitulo-font-size)] tracking-[var:(--titulo-letter-spacing)] leading-[var(--titulo-line-heihgt)]">
                            Metas personales
                        </div>
                        <div className="flex flex-col items-start gap-5 relative self-stretch w-full flex-[0_0_auto]">
                            <div className="relative self-stretch [font-family: 'Montserrat-Medium',Helvetica] font-medium text-black text-lg tracking-[0] leading-[normal]">
                                Reducir 1 cm de cintura en dos semanas
                            </div>
                            <div className="relative self-stretch [font-family: 'Montserrat-Medium',Helvetica] font-medium text-black text-lg tracking-[0] leading-[normal]">
                                Aumentar 0.5 cm de brazo (bíceps) en un mes
                            </div>
                            <div className="relative self-stretch [font-family: 'Montserrat-Medium',Helvetica] font-medium text-black text-lg tracking-[0] leading-[normal]">
                                Bajar 1% de grasa corporal en un mes
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </PageTransitionWrapper>
    )
}


export default withRoleProtection(["USER", "TRAINER"], "/gym-module")(PhysicalProgress);