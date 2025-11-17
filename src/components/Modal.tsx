
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {

    if (!isOpen) {
        return;
    }
    return (
        <>
            <div
                className="absolute inset-0 z-10 w-full h-screen bg-black/70 p-5 flex items-center justify-center"
                onClick={onClose}
            >
                <div
                    className="relative bg-white rounded-xl p-6 shadow-lg h-full w-full max-h-132 max-w-122"
                    onClick={(e) => { e.stopPropagation() }}
                >
                    {children}
                </div>
            </div>
        </>
    );
}
