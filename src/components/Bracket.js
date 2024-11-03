import React, {Component, useEffect, useState} from 'react';
import MatchPreview from './MatchPreview';
import MatchView from './MatchView';
import Podium from './Podium';
import './Bracket.css'
import BracketTree from './BracketTree';
import { SingleEliminationBracket, DoubleEliminationBracket, Match, MATCH_STATES, SVGViewer } from '@g-loot/react-tournament-brackets';
import { standardiseText } from '../utils/TextUtils';

export default function Bracket ({pokemonList}) {

    const [bracket, setBracket] = useState(new Map());
    const [bracketReady, setBracketReady] = useState(false);
    const [matchNumber, setMatchNumber] = useState(0);
    const [currentRound, setCurrentRound] = useState(1);
    const [winner, setWinner] = useState(null);
    const [secondPlace, setSecondPlace] = useState(null);
    const [thirdPlace, setThirdPlace] = useState(null);
    const [bracketOver, setBracketOver] = useState(false);
    const [displayFull, setDisplayFull] = useState(true);
    const [matchList, setMatchList] = useState([]);

    let preRoundPresent = false;

    function buildBracket() {
        setBracketOver(false);
        const pokemonListCopy = [...pokemonList];
        const bracketMap = new Map();
        const numOfRounds = Math.floor(Math.log2(Math.ceil(pokemonList.length/2)))
        const log2Goal = Math.pow(2, numOfRounds);

        const preRoundMatchCount = pokemonList.length - log2Goal*2;
        const preRoundMatches = [];
        for (let i=0;i<preRoundMatchCount;i++){
            const matchArray = [pokemonListCopy.pop(), pokemonListCopy.pop()];
            preRoundMatches.push(matchArray);
        }
    
        for (let i=0;i<=numOfRounds;i++){
            bracketMap.set(`Round ${i+1}`, []);
        }

        let movingLog2Goal = log2Goal;
        bracketMap.forEach(round => {
            for (let i = 0;i<movingLog2Goal;i++){
                round[i] = [];
            }
            movingLog2Goal = movingLog2Goal/2;
        })

        if (preRoundMatches.length) {
            bracketMap.set('Round 0', preRoundMatches);
            setCurrentRound(0);
            preRoundPresent = true;
        }

        for (let i=0;i<log2Goal;i++){
            if (pokemonListCopy.length == 0) {
                continue;
            }
            if (i<preRoundMatchCount){
                const matchArray = [pokemonListCopy.pop()];
                bracketMap.get('Round 1')[i] = matchArray;
            } else {
                const matchArray = [pokemonListCopy.pop(), pokemonListCopy.pop()];
                bracketMap.get('Round 1')[i] = matchArray;
            }
        }
        // bracketMap.set('3rd Place Faceoff', [[]]);
        const matchList = constructMatches(bracketMap, numOfRounds);
        setBracket(bracketMap);
        setMatchList(matchList);
        setBracketReady(true);
    }

    function constructMatches(bracketMap, numOfRounds) {
        console.log(numOfRounds);
        console.log(bracketMap);
        const matchList = [];
        let roundNumber = numOfRounds+1;
        let matchID = 1;
        for (roundNumber; roundNumber>=0; roundNumber--){
            if (bracketMap.get(`Round ${roundNumber}`)==undefined){
                continue;
            }
            const roundMatches = bracketMap.get(`Round ${roundNumber}`);
            for (let i = 0; i<roundMatches.length; i++) {
                
                // console.log(roundMatches.length);
                // console.log(roundMatches);
                const matchFromMap = roundMatches[i];
                let matchName;
                if (roundNumber == numOfRounds+1) {
                    matchName = "Finals";
                } else if (roundNumber == numOfRounds) {
                    matchName = "Semi-Finals";
                } else if (roundNumber == numOfRounds-1) {
                    matchName = "QuarterFinals";
                } else {
                    matchName = null;
                }
                let nextMatchID;
                if (matchID == 1) {
                    nextMatchID = null;
                } else {
                    nextMatchID = Math.floor(matchID/2)
                }
                const participants = [];
                for (let j = 0; j<matchFromMap.length; j++){
                    const pokemon = matchFromMap[j].get('Pokemon');
                    const participant = {
                        id: pokemon.id,
                        resultText: null,
                        isWinner: false,
                        status: null,
                        name: standardiseText(pokemon.name),
                        picture: pokemon.sprites.front_default,
                    }
                    participants.push(participant);
                }
                // console.log(roundNumber);
                // console.log(matchName);
                const match = {
                    id: matchID,
                    name: matchName,
                    nextMatchId: nextMatchID,
                    nextLooserMatchId: null,
                    tournamentRoundText: roundNumber,
                    startTime: null,
                    state: 'SCHEDULED',
                    participants: participants,
                }
                matchList.push(match);
                matchID++;
            }
        }
        return matchList;
    }

    function getCurrentMatch() {
        if (currentRound == '3rd Place Faceoff'){
            return bracket.get(currentRound)[0];
        }
        return bracket.get(`Round ${currentRound}`)[matchNumber];
    }

    function getNextMatch() {
        if (currentRound == '3rd Place Faceoff') {
            return null;
        }
        if (isCurrentRoundFinal() && isCurrentMatchLastInRound()) {
            return bracket.get('3rd Place Faceoff')[0];
        }
        if (isCurrentMatchLastInRound()) {
            return bracket.get(`Round ${currentRound+1}`)[0];
        }
        return bracket.get(`Round ${currentRound}`)[matchNumber+1];
    }

    function isCurrentMatchLastInRound() {
        return bracket.get(`Round ${currentRound}`).length <= matchNumber+1;
    }

    function isCurrentRoundFinal() {
        return bracket.get(`Round ${currentRound+1}`) == undefined;
    }

    function assignWinnerToNextMatch(winner, loser) {
        if (currentRound == '3rd Place Faceoff') {
            setThirdPlace(winner);
            return;
        }
        if (isCurrentRoundFinal()){
            setWinner(winner);
            setSecondPlace(loser);
            return;
        }
        const bracketCopy = new Map(bracket);
        const nextRound = bracketCopy.get(`Round ${currentRound+1}`);
        for (let i = 0; i<nextRound.length;i++) {
            if (nextRound[i].length >= 2) {
                continue;
            }
            nextRound[i].push(winner);
            break;
        }
        if (bracket.get(`Round ${currentRound+2}`) == undefined) {
            bracketCopy.get('3rd Place Faceoff')[0].push(loser);
        }
        setBracket(bracketCopy);
    }

    function advanceCurrentMatch() {
        if (currentRound == '3rd Place Faceoff') {
            setBracketOver(true);
            return;
        }
        if (isCurrentMatchLastInRound() && isCurrentRoundFinal()) {
            setCurrentRound('3rd Place Faceoff');
            setMatchNumber(0);
            return;
        }
        if (isCurrentMatchLastInRound()) {
            setCurrentRound(currentRound+1);
            setMatchNumber(0);
            return;
        }
        setMatchNumber(matchNumber+1);
    }

    function handleWinnerSelected(winner, loser) {
        assignWinnerToNextMatch(winner, loser);
        advanceCurrentMatch();
    }

    useEffect( () => {
        buildBracket();
    }, [])

    
    return (
        <div>
        {bracketOver ?
            <Podium winner={winner} second={secondPlace} third={thirdPlace} /> : 
            <div>
            {bracketReady ?  <>
                {displayFull ? <BracketTree matchList={matchList} preRoundPresent={preRoundPresent} /> : <>
                        <p>Current Round: {currentRound} Current Match: {matchNumber+1}</p>
                        <div className='bracket_holder'>
                            <MatchView matchArray={getCurrentMatch()} handleWinnerSelected={handleWinnerSelected} /> {getNextMatch() == (null || undefined) || getNextMatch().length == 0 ? null : <MatchPreview matchArray={getNextMatch()}/>}
                        </div> </>} </>
                    : 
                    <h1>Loading!</h1>
            } </div>
        } </div>
    )
}