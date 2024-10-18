import PacmanLoader from 'react-spinners/PacmanLoader';

export interface LoaderProps {
    isOpen: boolean;
}

const Loader = ({ isOpen }: LoaderProps) => {
    return (
        <div
            className="loader justify-center fixed opacity-70 items-center"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.7)',
                zIndex: 1000,
                display: isOpen ? 'flex' : 'none',
            }}
        >
            <PacmanLoader color="#1ec2d2" loading={isOpen} />
        </div>
    );
};

export default Loader;
