interface Props {
    title: string;
    text: string;
}

export const ServiceContainer = ({
    title = "NOMBRE DEL SERVICIO",
    text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel hendrerit nisi. Duis congue est erat, feugiat commodo ipsum molestie sit amet."
}: Props) => {
    return (
        <div className="flex flex-col w-full items-start p-[22px] relative bg-primary-red rounded-2xl">
            <div className="relative w-fit mt-[-1.00px]">
                {title}
            </div>
            <p className="relative self-stretch">
                {text}
            </p>
        </div>
    )
}