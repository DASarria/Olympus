import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";


/**
 * Props interface for the PageTransitionWrapper component.
 * 
 * @interface
 */
interface Props {
  children: React.ReactNode;
}

/**
 * Transition variants for the page animation.
 * These define the initial, animate, and exit states of the page content.
 * 
 * @constant
 * @type {object}
 * @property {object} initial - The initial state with opacity 0 and a downward vertical offset.
 * @property {object} animate - The animated state with full opacity and normal vertical position.
 * @property {object} exit - The exit state with opacity 0 and an upward vertical offset.
 */
const transitionVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

/**
 * PageTransitionWrapper component wraps the content of the page and applies transition animations.
 * The animation effect fades in the content and moves it vertically during the page transition.
 * 
 * @param {Props} props - The props for the PageTransitionWrapper component.
 * @returns {JSX.Element} A `motion.div` that wraps the page content with animated transitions.
 */
export const PageTransitionWrapper = ({ children }: Props) => {
  const router = useRouter();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={router.asPath}
        variants={transitionVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
