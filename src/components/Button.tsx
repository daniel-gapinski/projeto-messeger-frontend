import type { ReactNode } from "react";

interface ButtonProps {
    name: ReactNode;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    onClick: () => void;
}
export default function Button({ type, name, disabled, onClick }: ButtonProps) {

    return (
        <>
            <div className="w-full">
                <button
                    className={`flex items-center justify-center text-sm w-full rounded-md h-10 text-white
                ${disabled
                            ? 'bg-black-bg text-white cursor-not-allowed'
                            : 'bg-primary hover:bg-primary-hover cursor-pointer'}
            `}
                    onClick={disabled ? undefined : onClick}
                    disabled={disabled}
                    type={type}>{name}
                    </button>
            </div>
        </>
    )
}