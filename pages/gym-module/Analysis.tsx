import { Return } from "@/components/Return"
import { withRoleProtection } from "@/hoc/withRoleProtection";

const Analysis = () => {
    //const role = typeof window !== 'undefined' ? sessionStorage.getItem("role") : null;
    const role: string = "TRAINER";

    return (
        <div>
            {role !== "ADMIN" && (
                <Return 
                    className="!self-stretch !flex-[0_0_auto] !w-full"
                    text="Analisis"
                    returnPoint="/gym-module"
                />
            )}
        </div>
    )
}


export default withRoleProtection(["TRAINER", "ADMIN"], "/gym-module")(Analysis);