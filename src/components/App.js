import React, { useEffect, useState } from 'react';
import './App.css';
import Layout from './Reusable/Layout';
import Intro from './Intro/Intro';
import GameboardSetup from './GameboardSetup/GameboardSetup';
import Game from './Game/Game';

const App = () => {

    const [name, setName] = useState('');
    const [phase, setPhase] = useState(0);
    const [playerSetupGameboard, setPlayerSetupGameboard] = useState({});

    useEffect(() => {
        console.log(playerSetupGameboard)
    }, [playerSetupGameboard]);

    const setPlayerName = (name) => {
        setName(name);
    };

    const handleNextStepChange = () => {
        if (phase < 2) {
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
                    handleNextStepChange={handleNextStepChange}
                />
            );
        } else if (phase === 2) {
            return (
                <Game 
                    playerSetupGameboard={playerSetupGameboard}
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