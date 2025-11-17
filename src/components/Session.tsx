import type { ReactNode } from "react"

interface SessionProps {
    children: ReactNode
}

export default function Session({ children }: SessionProps) {

    return (
        <>
         <div className="flex flex-col justify-between w-full h-screen gap-5">
            {children}
         </div>
        </>
    )
}