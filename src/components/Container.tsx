import type { ReactNode } from "react";

interface ContainerProps {
    children: ReactNode;
}
export default function Container({children}: ContainerProps) {
    return (
        <>
            <div className="w-full max-w-7xl mx-auto h-full p-2">
                {children}
            </div>
        </>
    )
}