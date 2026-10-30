import { useReducedMotion } from "framer-motion";
import { MotionDiv, fadeUp } from "@/lib/motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "header" | "footer";
};

export default function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const Component = MotionDiv as typeof MotionDiv;

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-8% 0px" }}
      variants={fadeUp}
      custom={delay}
    >
      {children}
    </Component>
  );
}
