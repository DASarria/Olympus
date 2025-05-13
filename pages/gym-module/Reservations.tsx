import { Return } from "@/components/Return"
import { withRoleProtection } from "@/hoc/withRoleProtection";

const Reservations = () => {
    //const role = typeof window !== 'undefined' ? sessionStorage.getItem("role") : null;
    const role: string = "TRAINER";

    return (
        <div>
            <Return 
                className="!self-stretch !flex-[0_0_auto] !w-full"
                text="Reserva de salon"
                returnPoint="/Module5"
            />
        </div>
    )
}


export default withRoleProtection(["USER", "TRAINER"], "/Module5")(Reservations);