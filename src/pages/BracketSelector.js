import React, {Component, useEffect, useState} from 'react';
import TypeButton from "../components/TypeButton";
import Bracket from '../components/Bracket';
import { Link } from 'react-router-dom';

const BracketSelector = () => {
    const [typeInfo, setTypeInfo] = useState([]);

    useEffect(() => {
        fetch('https://pokeapi.co/api/v2/type')
        .then(response => response.json())
        .then(json => setTypeInfo(json.results))
    }, [])

    function constructTypeButtons(){
        let buttonList = [];
        typeInfo.forEach(element => {
            if (element.name !== 'stellar' && element.name != 'unknown'){
                const nameCap = element.name[0].toUpperCase() + element.name.substr(1);
            buttonList.push(
                <Link to={'/BracketView'} state={element.url}>{nameCap}</Link>
                /* <TypeButton buttonText={nameCap} buttonLink={element.url} onClick={handleClick} /> */
            );
            }
        })
        return buttonList;
    }

    const buttonList = constructTypeButtons()

    
    return (<>
        <div className='buttonHolder'>
        {buttonList}
        </div>
        </>
    )
}

export default BracketSelector;