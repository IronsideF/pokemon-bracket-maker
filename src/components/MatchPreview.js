import React from 'react'

export default function MatchPreview ({matchArray}) {
    let pokemonOneSprite;
    let pokemonTwoSprite;
    if (matchArray.length >= 2) {
        pokemonTwoSprite = matchArray[1].get('Pokemon').sprites.front_default;
    }
    if (matchArray.length != 0) {
        pokemonOneSprite= matchArray[0].get('Pokemon').sprites.front_default;
    }

        return (
            <div className='match_preview'>{pokemonOneSprite ? <img src={pokemonOneSprite}/> : <p>?</p>} <p>VS</p>{pokemonTwoSprite ?<img src={pokemonTwoSprite}/> : <p>?</p>}</div>
        )
}
