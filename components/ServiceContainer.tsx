interface Props {
    title: string;
    text: string;
}

export const ServiceContainer = ({
    title = "NOMBRE DEL SERVICIO",
    text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel hendrerit nisi. Duis congue est erat, feugiat commodo ipsum molestie sit amet."
}: Props) => {
    return (
        <div className="flex flex-col w-full items-start p-6 mb-4 bg-[#990000] rounded-2xl">
            <h2 className="text-white text-2xl font-semibold mb-2">
                {title}
            </h2>
            <p className="text-white text-base">
                {text}
            </p>
        </div>
    );
}
