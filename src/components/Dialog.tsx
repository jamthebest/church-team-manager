import { Modal } from 'rsuite';

export interface DialogProps {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    blendyData?: string;
}

const Dialog = ({
    title,
    children,
    isOpen,
    onClose,
    blendyData,
}: DialogProps) => {
    return (
        <Modal
            backdrop="static"
            keyboard={false}
            open={isOpen}
            onClose={onClose}
            data-blendy-to={blendyData}
        >
            <Modal.Header>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>{children}</Modal.Body>
        </Modal>
    );
};

export default Dialog;
