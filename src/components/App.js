import React, { useEffect, useState } from 'react';
import './App.css';
import Layout from './Reusable/Layout';
import Intro from './Intro/Intro';
import GameboardSetup from './GameboardSetup/GameboardSetup';
import Game from './Game/Game';
import Results from './Results/Results';

const App = () => {

    const [name, setName] = useState('');
    const [phase, setPhase] = useState(0);
    const [playerSetupGameboard, setPlayerSetupGameboard] = useState({});
    const [aiSetupGameboard, setAiSetupGameboard] = useState({});
    const [winner, setWinner] = useState(null);

    const setPlayerName = (name) => {
        setName(name);
    };

    const handleNextStepChange = () => {
        if (phase < 3) {
            setPhase(phase + 1);
        } else {
            setPhase(0);
        }
    };

    const showNextComponent = () => {
		if (phase === 1) {
            return (
                <GameboardSetup 
                    setPlayerSetupGameboard={setPlayerSetupGameboard}
                    setAiSetupGameboard={setAiSetupGameboard}
                    handleNextStepChange={handleNextStepChange}
                />
            );
        } else if (phase === 2) {
            return (
                <Game 
                    playerSetupGameboard={playerSetupGameboard}
                    aiSetupGameboard={aiSetupGameboard}
                    handleNextStepChange={handleNextStepChange}
                    setWinner={setWinner}
                />
            );
        } else if (phase === 3) {
            return (
                <Results 
                    winner={winner}
                />
            );
        } else {
            return (
                <Intro
                    setPlayerName={setPlayerName}
                    handleNextStepChange={handleNextStepChange}
                />
            );
        };
    };
    
    return (
        <Layout>
            {showNextComponent()}
        </Layout>
    );
}

export default App;