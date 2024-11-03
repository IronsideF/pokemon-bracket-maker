import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Bracket from '../components/Bracket';

const BracketView = () => {

    const [apiUrl, setApiUrl] = useState(useLocation().state)

    const [pokemonList, setPokemonList] = useState([]);

    const [preparedPokemonSpecies, setPreparedPokemonSpecies] = useState([]);

    const [bracketReady, setBracketReady] = useState(false);

    useEffect(() => {
        console.log(apiUrl);
        fetch(apiUrl).then(response => response.json()).then(json => setPokemonList(json.pokemon));
        setBracketReady(false);
    }, [apiUrl])

    useEffect(() => {
        if (pokemonList.length){
            preparePokemonForBracket();
        }
    }, [pokemonList])
    
    useEffect(() => {
        // console.log(preparedPokemonSpecies);
        if (preparedPokemonSpecies.length){
        setBracketReady(true);
        }
    }, [preparedPokemonSpecies])
    
        function formValid(pokemonName){
        const blockedForms = ['-busted', '-totem', '-cap', '-star', '-belle', '-libre', '-phd', '-cosplay', '-battle-bond', '-ash', '-eternal', '-blade', '-small', '-large', '-super', '-power-construct', '-school', 'minior-red', '-orange', '-yellow', '-green', '-blue', '-indigo', '-violet', '-original', '-gulping', '-gorging', '-noice', '-hangry', '-eternamax', '-dada', '-family-of-three', '-white', '-hero', '-stretchy', '-droopy', '-three-segment', '-roaming', '-stellar', '-build'];
        if (blockedForms.some(v => pokemonName.includes(v))) {
            return false;
        }
        return true;
    }
    
    function shufflePokemon(pokemon){
        for (let i = pokemon.length -1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i+1));
            let k = pokemon[i];
            pokemon[i] = pokemon[j];
            pokemon[j] = k;
        }
    }

    async function preparePokemonForBracket(){
        const shuffledPokemonSpecies = [];
        if (pokemonList.length == 0){
            return;
        }
        const pokemonCopy = JSON.parse(JSON.stringify(pokemonList));
        const filteredPokemon = [];
        for (let i = 0;i<pokemonCopy.length;i++){
        if (formValid(pokemonCopy[i].pokemon.name))
            {
                filteredPokemon.push(pokemonCopy[i].pokemon);
            }
        }
        shufflePokemon(filteredPokemon);
        const pokemonPromises =[];
        const speciesPromises = [];
        for (let i =0;i<filteredPokemon.length;i++){
            pokemonPromises.push(fetch(filteredPokemon[i].url))
        }
        const pokemonResponses = await Promise.all(pokemonPromises);
        const returnedPokemon = await Promise.all(pokemonResponses.map((response => response.json())));
        for (let i = 0;i<returnedPokemon.length;i++){
            speciesPromises.push(fetch(returnedPokemon[i].species.url));
        }
        const speciesResponses = await Promise.all(speciesPromises);
        const returnedSpecies = await Promise.all(speciesResponses.map((response) => response.json()));
        for (let i=0;i<returnedPokemon.length;i++){
            const nameSpeciesMap = new Map();
            nameSpeciesMap.set('Pokemon', returnedPokemon[i]);
            nameSpeciesMap.set('Species', returnedSpecies[i]);
            shuffledPokemonSpecies.push(nameSpeciesMap);
        }
        setPreparedPokemonSpecies(shuffledPokemonSpecies)
        }



    return (
        <div>{bracketReady ? <Bracket pokemonList={preparedPokemonSpecies}/> : <h2>'Loading...'</h2>}</div>
    )
}

export default BracketView