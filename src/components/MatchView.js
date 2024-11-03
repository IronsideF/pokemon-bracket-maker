import React from 'react'
import InMatchPokemon from './InMatchPokemon';
import './MatchView.css';

export default function MatchView({matchArray, handleWinnerSelected}) {

    const firstPokemon = matchArray[0].get('Pokemon');
    const secondPokemon = matchArray[1].get('Pokemon');
    const firstSpecies = matchArray[0].get('Species');
    const secondSpecies = matchArray[1].get('Species');

    function handleClick(name) {
        if (firstPokemon.name == name) {
            handleWinnerSelected(matchArray[0], matchArray[1]);
        } else {
            handleWinnerSelected(matchArray[1], matchArray[0]);
        }
    }
    


    return (
        <div className='matchbox'>
            <InMatchPokemon pokemon={firstPokemon} species={firstSpecies} handleClick={handleClick}/>
        <h1 className='vs'>VS</h1>
            <InMatchPokemon pokemon={secondPokemon} species={secondSpecies} handleClick={handleClick}/>
        </div>
    )
}
