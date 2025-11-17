
interface InputProps {
    type: string;
    name: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
    error?: boolean;
}

export default function Input({ type, name, placeholder, value, onChange, label, error }: InputProps) {

    return (
        <>
            <div className="flex flex-col gap-2 w-full">
                <label className="px-2 text-[12px]">{label}</label>
                <input
                    className={`w-full h-10 rounded-md bg-black-bg p-2 outline-0 ${error ? "border-warning border-1" : "border-white-bg border-1"}`}
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    autoComplete="off"
                />
            </div>
        </>
    )
}