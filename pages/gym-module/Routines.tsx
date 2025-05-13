import { Return } from "@/components/Return"
import { withRoleProtection } from "@/hoc/withRoleProtection";

const Routines = () => {
    //const role = typeof window !== 'undefined' ? sessionStorage.getItem("role") : null;
    const role: string = "TRAINER";

    return (
        <div>
            <Return 
                className="!self-stretch !flex-[0_0_auto] !w-full"
                text="Rutinas"
                returnPoint="/Module5"
            />
        </div>
    )
}


export default withRoleProtection(["USER", "TRAINER"], "/Module5")(Routines);