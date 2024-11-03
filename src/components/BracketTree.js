import React, { useEffect, useState } from 'react'
import { useScript, useWindowSize } from '@uidotdev/usehooks';
import { SingleEliminationBracket, DoubleEliminationBracket, Match, MATCH_STATES, SVGViewer } from '@g-loot/react-tournament-brackets';

export default function BracketTree({matchList, preRoundPresent}) {

    const {width, height} = useWindowSize();
    const finalWidth = Math.max(width - 50, 500);
    const finalHeight = Math.max(height - 100, 500);
    


    return (<>
    <SingleEliminationBracket
        matches= {matchList}
        matchComponent = {Match}
        preRoundPresent = {preRoundPresent}
        svgWrapper = {({ children, ...props }) => (
            <SVGViewer width={500} height={500} {...props}>
            {children}
            </SVGViewer>
    )}
    />
    </>
  )
}