import React from 'react'
import './MatchPokemon.css'
import { standardiseText, getEnglishLanguageEntries, convertGenerationString } from '../utils/TextUtils';

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

export default function InMatchPokemon({pokemon, species, handleClick}) {
    const art = pokemon.sprites.other['official-artwork'].front_default;
    const name = standardiseText(pokemon.name);
    const types = pokemon.types;
    const flavorText = getEnglishLanguageEntries(species.flavor_text_entries);
    const genus = getEnglishLanguageEntries(species.genera)[0];
    const generation = convertGenerationString(species.generation.name);
    const flavorTextRandom = flavorText[getRandomInt(0, flavorText.length)];

    return (
        <div className='pokemon'>
            <img className='pokemon_art' src={art}/>
            <h1 className='pokemon_name'>{name}</h1>
            {genus.genus ? <h2 className='pokemon_genus'>The {genus.genus}</h2> : null} 
            <h3 className='pokemon_types'>{types.length == 1 ? `Mono ${standardiseText(types[0].type.name)} Type` : `${standardiseText(types[0].type.name)} and ${standardiseText(types[1].type.name)} Type`}</h3>
            <p className='pokemon_flavor'>{flavorTextRandom.flavor_text}</p>
            <p className='pokemon_generation'>Introduced in {generation}</p>
            <button onClick={() => handleClick(pokemon.name)}>{name} is the best!</button>
    </div>
    )
}
