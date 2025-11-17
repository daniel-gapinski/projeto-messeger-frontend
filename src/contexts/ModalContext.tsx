import { createContext, useState } from "react";
import type { ReactNode } from "react";
import Modal from "../components/Modal";

interface ModalContextData {
    openModal: (content: ReactNode) => void;
    closeModal: () => void;
}

interface ModalProviderProps {
    children: ReactNode;
}

export const ModalContext = createContext({} as ModalContextData);

export function ModalProvider({ children }: ModalProviderProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState<ReactNode>(null);

    function openModal(content: ReactNode) {
        setModalContent(content);
        setIsOpen(true);
    };

    function closeModal() {
        setIsOpen(false);
        setModalContent(null);
    };

    return (
        <ModalContext.Provider value={{
            openModal,
            closeModal
        }}>
            {children}

            <Modal isOpen={isOpen} onClose={closeModal}>
                {modalContent}
            </Modal>
        </ModalContext.Provider>
    );
}
