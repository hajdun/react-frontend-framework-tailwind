import type React from "react";

type CardProps = {
    children: React.ReactNode;
    className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
    return (
        <div
            className={`
        rounded-[22px]
        bg-white
        border border-white/60
        p-5
        shadow-[0_8px_30px_rgba(29,22,23,0.06)]
        ${className}
      `}
        >
            {children}
        </div>
    );
}