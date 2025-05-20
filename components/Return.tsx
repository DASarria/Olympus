import Link from "next/link";
import arrowLeft from "@/assets/icons/ArrowLeft.svg";

interface Props {
  className?: string;
  text: string;
  returnPoint: string;
}

export const Return = ({ className = "", text = "Título", returnPoint }: Props) => {
  return (
    <div className={`flex items-center w-full gap-4 sm:gap-6 md:gap-10 ${className}`}>
      <Link href={returnPoint}>
        <img
          src={arrowLeft.src}
          alt="Flecha de regreso"
          className="w-8 sm:w-10 md:w-[55px] h-auto cursor-pointer"
        />
      </Link>
      <div
        className="text-xl sm:text-2xl md:text-3xl font-bold whitespace-nowrap"
        style={{
          fontFamily: "'Open Sans', sans-serif",
          fontSize: "clamp(1.8rem, 2vw, 3rem)",
        }}
      >
        {text}
      </div>
    </div>
  );
};
