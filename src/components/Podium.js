import React from 'react'
import './Podium.css'

export default function Podium({winner, second, third}) {
    const firstArt = winner.get('Pokemon').sprites.other['official-artwork'].front_default;
    const secondArt = second.get('Pokemon').sprites.other['official-artwork'].front_default;
    const thirdArt = third.get('Pokemon').sprites.other['official-artwork'].front_default;

    return (
        <div className='podium'>
            <div className='position'>
                <img src={secondArt}/>
                <p>Second</p>
            </div>
            <div className='position'>
                <img src={firstArt}/>
                <p>First</p>
            </div>
            <div className='position'>
                <img src={thirdArt}/>
                <p>Third</p>
            </div>
        </div>
    )
}
