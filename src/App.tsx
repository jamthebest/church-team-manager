import { useEffect, useState } from 'react';
import TeamTab from './components/TeamTab';
import CompetitionsTab from './components/CompetitionsTab';
import ResultTab from './components/ResultTab';
import TableStandings from './components/TableStandings';
import useData from './hooks/useData';

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
    } = useData();
    const [activeTab, setActiveTab] = useState<TabEnum>(TabEnum.TEAMS);

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">
                Mini campamento SET 2024
            </h1>
            <div className="mb-4">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex">
                        {[
                            TabEnum.TEAMS,
                            TabEnum.COMPETITIONS,
                            TabEnum.RESULTS,
                            TabEnum.POSITIONS,
                        ].map((tab) => (
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
            {activeTab === TabEnum.TEAMS && (
                <TeamTab
                    teams={teams}
                    loading={loading}
                    onAddTeam={addTeam}
                    onEditTeam={updateTeam}
                    onDeleteTeam={deleteTeam}
                />
            )}
            {activeTab === TabEnum.COMPETITIONS && (
                <CompetitionsTab
                    teams={teams}
                    loading={loading}
                    onAddCompetition={addResult}
                />
            )}
            {activeTab === TabEnum.RESULTS && (
                <ResultTab competitions={results} teams={teams} />
            )}
            {activeTab === TabEnum.POSITIONS && (
                <TableStandings teams={teams} competitions={results} />
            )}
        </div>
    );
}

export default App;
