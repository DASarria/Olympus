interface Props {
    title: string;
    text: string;
}

export const ServiceContainer = ({
    title = "NOMBRE DEL SERVICIO",
    text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel hendrerit nisi. Duis congue est erat, feugiat commodo ipsum molestie sit amet."
}: Props) => {
    return (
        <div className="flex flex-col w-full items-start p-[1.37rem] relative bg-[var(--primary-red)] rounded-2xl">
            <div className="relative w-fit mt-[-1.00px] font-titulo font-[number:var(--titulo-font-weight)] text-white text-[length:var(--titulo-font-size)] text-center tracking-[var(--titulo-letter-spacing)] leading-[var:(--titulo-line-height)]">
                {title}
            </div>
            <p className="relative self-stretch font-regular font-[number:var(--regular-font-weight)] text-white text-[length:var(--regular-font-size)] tracking-[var(--regular-letter-spacing)] leading-[var(--regular-line-height)]">
                {text}
            </p>
        </div>
    )
}