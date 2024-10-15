import { useState } from 'react';
import { Team, Competition, State } from './types';
import TeamTab from './components/TeamTab';
import CompetitionsTab from './components/CompetitionsTab';
import ResultTab from './components/ResultTab';
import TableStandings from './components/TableStandings';


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
}

function App() {
  const [state, setState] = useState<State>({
    teams: [],
    competitions: [],
  });

  const [activeTab, setActiveTab] = useState<TabEnum>(TabEnum.TEAMS);

  const addTeam = (newTeam: Team) => {
    setState((previousState) => ({
      ...previousState,
      teams: [...previousState.teams, newTeam],
    }));
  };

  const updateTeam = (editedTeam: Team) => {
    setState((previousState) => ({
      ...previousState,
      teams: previousState.teams.map((currentTeam) =>
        currentTeam.id === editedTeam.id ? editedTeam : currentTeam
      ),
    }));
  };

  const deleteTeam = (id: string) => {
    setState((previousState) => ({
      ...previousState,
      teams: previousState.teams.filter((team) => team.id !== id),
      competitions: previousState.competitions.filter((competition) => 
        !competition.teams.includes(id)
      ),
    }));
  };

  const addCompetition = (newCompetition: Competition) => {
    setState((previousState) => ({
      ...previousState,
      competitions: [...previousState.competitions, newCompetition],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">Mini campamento SET 2024</h1>
      <div className="mb-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {[TabEnum.TEAMS, TabEnum.COMPETITIONS, TabEnum.RESULTS, TabEnum.POSITIONS].map((tab) => (
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
          teams={state.teams}
          onAddTeam={addTeam}
          onEditTeam={updateTeam}
          onDeleteTeam={deleteTeam}
        />
      )}
      {activeTab === TabEnum.COMPETITIONS && (
        <CompetitionsTab
          teams={state.teams}
          onAddCompetition={addCompetition}
        />
      )}
      {activeTab === TabEnum.RESULTS && (
        <ResultTab
          competitions={state.competitions}
          teams={state.teams}
        />
      )}
      {activeTab === TabEnum.POSITIONS && (
        <TableStandings
          teams={state.teams}
          competitions={state.competitions}
        />
      )}
    </div>
  );
}

export default App;