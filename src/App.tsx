import { useCallback, useEffect, useState } from 'react';
import { Message, useToaster } from 'rsuite';
import TableStandings from './components/TableStandings';
import useData from './hooks/useData';
import 'rsuite/dist/rsuite.min.css';

enum TabEnum {
    TEAMS = 'teams',
    COMPETITIONS = 'competitions',
    RESULTS = 'results',
    POSITIONS = 'positions',
}

const tabText = {
    [TabEnum.TEAMS]: 'Equipos',
    [TabEnum.COMPETITIONS]: 'Competencias',
    [TabEnum.RESULTS]: 'Resultados',
    [TabEnum.POSITIONS]: 'Posiciones',
};

function App() {
    const {
        teams,
        results,
        addTeam,
        updateTeam,
        deleteTeam,
        addResult,
        loadData,
        loading,
        error,
        message,
        clearMessages,
    } = useData();
    const [activeTab, setActiveTab] = useState<TabEnum>(TabEnum.POSITIONS);
    const toaster = useToaster();

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (error) {
            toaster.push(Toast, { placement: 'topCenter', duration: 3000 });
            clean();
        }
        if (message) {
            toaster.push(Toast, { placement: 'topCenter', duration: 3000 });
            clean();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error, message]);

    const clean = useCallback(() => {
        setTimeout(() => {
            clearMessages();
        }, 6000);
    }, [clearMessages]);

    const Toast = (
        <Message showIcon type={error ? 'error' : 'success'} closable>
            <strong>{error ? 'Error' : 'Info'}!</strong> {error || message}.
        </Message>
    );

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">
                Culto de Jóvenes SET 2025
            </h1>
            <div className="mb-4">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex">
                        {[TabEnum.POSITIONS].map((tab) => (
                            <button
                                key={tab}
                                className={`py-2 px-2 sm:px-4 text-center border-b-2 font-medium text-sm sm:text-base whitespace-nowrap ${
                                    activeTab === tab
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                                onClick={() => setActiveTab(tab as TabEnum)}
                            >
                                {tabText[tab]}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>
            {activeTab === TabEnum.POSITIONS && (
                <TableStandings
                    loading={loading}
                    teams={teams}
                    competitions={results}
                    addResult={addResult}
                    onAddTeam={addTeam}
                    onDeleteTeam={deleteTeam}
                    onEditTeam={updateTeam}
                />
            )}
        </div>
    );
}

export default App;
