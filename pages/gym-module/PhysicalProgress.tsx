import { Return } from "@/components/Return"

const PhysicalProgress = () => {
    const role = typeof window !== 'undefined' ? sessionStorage.getItem("role") : null;

    return (
        <div>
            <Return 
                className="!self-stretch !flex-[0_0_auto] !w-full"
                text="Progreso fisico"
                returnPoint="/Module5"
            />
            <div className="flex flex-col w-[1140px] items-center gap-5 pt-0 pb-20 px-0 relative flex-[0_0_auto]">
                <div className="flex items-start gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
                    <div className="inline-flex h-8 items-center justify-center relative flex-[0_0_auto] rounded-[36px] overflow-hidden border border-solid border-[#00000080]">
                        <div className="">
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}


export default PhysicalProgress;