import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Player, SortAlgorithm, AlgorithmInfo, AnimationStep } from './types';
import { getQuickSortAnimations, getMergeSortAnimations, getBubbleSortAnimations } from './services/sortingService';

const ANIMATION_SPEED_MS = 50;

const initialPlayers: Player[] = [
  { id: 1, name: 'Beatriz', score: 88 },
  { id: 2, name: 'Carlos', score: 95 },
  { id: 3, name: 'Ana', score: 72 },
  { id: 4, name: 'Daniel', score: 100 },
  { id: 5, name: 'Fernanda', score: 64 },
  { id: 6, name: 'Eduardo', score: 81 },
  { id: 7, name: 'Gabriela', score: 91 },
  { id: 8, name: 'Heitor', score: 77 },
];

const ALGORITHM_DETAILS: Record<SortAlgorithm, AlgorithmInfo> = {
  [SortAlgorithm.QuickSort]: {
    name: "QuickSort",
    description: "QuickSort é um algoritmo de ordenação eficiente do tipo 'dividir para conquistar'. Ele funciona escolhendo um elemento 'pivô' e particionando os outros elementos do array em dois sub-arrays, de acordo com se eles são menores ou maiores que o pivô.",
    complexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n²)",
      space: "O(log n)",
    },
  },
  [SortAlgorithm.MergeSort]: {
    name: "MergeSort",
    description: "MergeSort também é um algoritmo 'dividir para conquistar'. Ele divide o array em duas metades, ordena cada metade recursivamente e, em seguida, mescla as duas metades ordenadas. É conhecido por sua estabilidade e desempenho garantido.",
    complexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
      space: "O(n)",
    },
  },
  [SortAlgorithm.BubbleSort]: {
    name: "BubbleSort",
    description: "BubbleSort é um algoritmo de ordenação simples que percorre repetidamente a lista, compara elementos adjacentes e os troca se estiverem na ordem errada. As passagens pela lista são repetidas até que a lista esteja ordenada. É mais usado para fins educacionais devido à sua ineficiência.",
    complexity: {
      best: "O(n)",
      average: "O(n²)",
      worst: "O(n²)",
      space: "O(1)",
    },
  },
};

const Header: React.FC = () => (
  <header className="bg-neutral-dark text-white p-4 shadow-lg">
    <div className="container mx-auto flex justify-between items-center">
      <h1 className="text-2xl md:text-3xl font-bold tracking-wider">
        <span className="text-accent">Algo</span>Ranker
      </h1>
      <p className="text-sm text-neutral-light hidden md:block">Visualizador de Algoritmos de Ordenação</p>
    </div>
  </header>
);

const PlayerCard: React.FC<{ player: Player; rank: number; isHighlighted: boolean; isSorted: boolean; onDelete: (id: number) => void; maxScore: number; }> = ({ player, rank, isHighlighted, isSorted, onDelete, maxScore }) => {
  const widthPercentage = maxScore > 0 ? (player.score / maxScore) * 100 : 0;

  return (
    <div className={`relative flex items-center bg-white p-3 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 ${isHighlighted ? 'ring-2 ring-secondary' : ''} ${isSorted ? 'bg-emerald-50' : ''}`}>
      <span className={`flex items-center justify-center h-10 w-10 rounded-full font-bold text-lg mr-4 ${rank <= 3 ? 'bg-amber-300 text-amber-800' : 'bg-gray-200 text-gray-600'}`}>
        {rank}
      </span>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <p className="font-bold text-neutral-dark text-lg">{player.name}</p>
          <p className="font-semibold text-primary text-lg">{player.score}</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-gradient-to-r from-blue-400 to-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${widthPercentage}%` }}></div>
        </div>
      </div>
      <button onClick={() => onDelete(player.id)} className="ml-4 text-gray-400 hover:text-red-500 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
      </button>
    </div>
  );
};

const StatsPanel: React.FC<{ players: Player[] }> = ({ players }) => {
  const stats = useMemo(() => {
    if (players.length === 0) return { count: 0, max: 0, min: 0, avg: 0 };
    const scores = players.map(p => p.score);
    const max = Math.max(...scores);
    const min = Math.min(...scores);
    const avg = scores.reduce((a, b) => a + b, 0) / players.length;
    return {
      count: players.length,
      max,
      min,
      avg: parseFloat(avg.toFixed(1)),
    };
  }, [players]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-neutral-dark mb-4 border-b pb-2">Estatísticas</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-primary">{stats.count}</p>
          <p className="text-sm text-neutral">Jogadores</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-accent">{stats.max}</p>
          <p className="text-sm text-neutral">Pont. Máxima</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-red-500">{stats.min}</p>
          <p className="text-sm text-neutral">Pont. Mínima</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-purple-500">{stats.avg}</p>
          <p className="text-sm text-neutral">Média</p>
        </div>
      </div>
    </div>
  );
};

const AlgorithmInfoModal: React.FC<{ info: AlgorithmInfo | null; onClose: () => void; }> = ({ info, onClose }) => {
  if (!info) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 max-w-2xl w-full transform transition-transform duration-300" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-bold text-primary">{info.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <p className="text-neutral mb-6 text-justify">{info.description}</p>
        <h3 className="text-lg font-semibold text-neutral-dark mb-3">Complexidade Assintótica</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-100 p-3 rounded-lg"><strong>Melhor Caso:</strong> <span className="font-mono text-black-600">{info.complexity.best}</span></div>
          <div className="bg-gray-100 p-3 rounded-lg"><strong>Caso Médio:</strong> <span className="font-mono text-yellow-600">{info.complexity.average}</span></div>
          <div className="bg-gray-100 p-3 rounded-lg"><strong>Pior Caso:</strong> <span className="font-mono text-red-600">{info.complexity.worst}</span></div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [isSorting, setIsSorting] = useState(false);
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerScore, setNewPlayerScore] = useState('');
  const [modalInfo, setModalInfo] = useState<AlgorithmInfo | null>(null);

  const maxScore = useMemo(() => Math.max(...players.map(p => p.score), 100), [players]);

  const ranks = useMemo(() => {
    if (players.length === 0) return [];

    const calculatedRanks: number[] = [1];
    for (let i = 1; i < players.length; i++) {
      if (players[i].score === players[i - 1].score) {
        calculatedRanks[i] = calculatedRanks[i - 1];
      } else {
        calculatedRanks[i] = i + 1;
      }
    }
    return calculatedRanks;
  }, [players]);

  const resetPlayers = useCallback(() => {
    setPlayers(initialPlayers);
    setSortedIndices([]);
    setHighlightedIndices([]);
  }, []);

  const handleSort = (algorithm: SortAlgorithm) => {
    if (isSorting) return;
    setIsSorting(true);
    setModalInfo(ALGORITHM_DETAILS[algorithm]);

    const getAnimations: (p: Player[]) => AnimationStep[] = {
      [SortAlgorithm.QuickSort]: getQuickSortAnimations,
      [SortAlgorithm.MergeSort]: getMergeSortAnimations,
      [SortAlgorithm.BubbleSort]: getBubbleSortAnimations,
    }[algorithm];

    const animations = getAnimations([...players]);

    animations.forEach((step, i) => {
      setTimeout(() => {
        setPlayers(step.array);
        setHighlightedIndices(step.highlight);
        setSortedIndices(step.sorted);
        if (i === animations.length - 1) {
          setIsSorting(false);
          setHighlightedIndices([]);
        }
      }, i * ANIMATION_SPEED_MS);
    });
  };

  const addPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    const score = parseInt(newPlayerScore, 10);
    if (newPlayerName && !isNaN(score) && score >= 0 && score <= 1000) {
      const newPlayer: Player = {
        id: Date.now(),
        name: newPlayerName,
        score: score,
      };
      setPlayers(prev => [...prev, newPlayer]);
      setNewPlayerName('');
      setNewPlayerScore('');
      setShowAddForm(false);
      setSortedIndices([]);
    }
  };

  const deletePlayer = (id: number) => {
    if (isSorting) return;
    setPlayers(players.filter(p => p.id !== id));
    setSortedIndices([]);
  };

  return (
    <div className="min-h-screen bg-neutral-light font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-6">
        <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
            <span className="font-semibold text-neutral-dark mr-2">Ordenar por:</span>
            {(Object.keys(SortAlgorithm) as Array<keyof typeof SortAlgorithm>).map((key) => (
              <button key={key} onClick={() => handleSort(SortAlgorithm[key])} disabled={isSorting} className="px-4 py-2 bg-primary text-white font-semibold rounded-md shadow-sm hover:bg-secondary disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300">
                {SortAlgorithm[key]}
              </button>
            ))}
            <div className="border-l border-gray-300 h-8 mx-2 hidden md:block"></div>
            <button onClick={() => setShowAddForm(true)} disabled={isSorting} className="px-4 py-2 bg-accent text-white font-semibold rounded-md shadow-sm hover:bg-green-500 disabled:bg-gray-400 transition-colors duration-300">
              Adicionar Jogador
            </button>
            <button onClick={resetPlayers} disabled={isSorting} className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-md shadow-sm hover:bg-gray-600 disabled:bg-gray-400 transition-colors duration-300">
              Resetar
            </button>
          </div>
        </div>

        <StatsPanel players={players} />

        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.map((player, index) => (
              <PlayerCard
                key={player.id}
                player={player}
                rank={ranks[index]}
                isHighlighted={highlightedIndices.includes(index)}
                isSorted={sortedIndices.includes(index)}
                onDelete={deletePlayer}
                maxScore={maxScore}
              />
            ))}
          </div>
          {players.length === 0 && (
            <div className="text-center py-10 bg-white rounded-lg shadow-md">
              <p className="text-neutral text-lg">Nenhum jogador na lista. Adicione um para começar!</p>
            </div>
          )}
        </div>
      </main>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Adicionar Novo Jogador</h3>
            <form onSubmit={addPlayer}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
                <input type="text" id="name" value={newPlayerName} onChange={e => setNewPlayerName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
              </div>
              <div className="mb-4">
                <label htmlFor="score" className="block text-sm font-medium text-gray-700">Pontuação</label>
                <input type="number" id="score" value={newPlayerScore} onChange={e => setNewPlayerScore(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" min="0" max="1000" required />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AlgorithmInfoModal info={modalInfo} onClose={() => setModalInfo(null)} />
    </div>
  );
}
