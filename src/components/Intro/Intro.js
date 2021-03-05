import React, { useState } from 'react';
import './Intro.css';

// -----------------------------------------------
//
// Desc: Intro phase for game
//
// -----------------------------------------------

const Intro = (props) => {

    const [name, setName] = useState('');

    const handleChange = (e) => {
        setName(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        props.setPlayerName(name);
        props.handleNextStepChange();
    };

    return (
        <div className="intro-container">
            <form className="intro-container__form" onSubmit={handleSubmit}>
                <input
                    name="name" 
                    className="intro-container__input" 
                    placeholder="Enter your name!"
                    onChange={handleChange}
                    value={name}>
                </input>
                <button 
                    className="intro-container__button"
                    onSubmit={handleSubmit}
                >
                    Start
                </button>
            </form>
        </div>
    );
}

export default Intro;