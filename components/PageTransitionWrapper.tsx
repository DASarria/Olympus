import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
}

export const PageTransitionWrapper = ({ children }: Props) => {
  const router = useRouter();
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [firstLoad, setFirstLoad] = useState(true);

  const [prevPath, setPrevPath] = useState<string>("");

  useEffect(() => {
    if (firstLoad) {
      setDirection("left");
      setFirstLoad(false);
    } else {
      if (router.asPath !== prevPath) {
        setDirection("right");
      }
    }
    setPrevPath(router.asPath);
  }, [prevPath, router, firstLoad]);

  return (
    <motion.div
      initial={{ x: direction === "right" ? "100%" : "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: direction === "right" ? "-100%" : "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      key={router.asPath}
    >
      {children}
    </motion.div>
  );
};