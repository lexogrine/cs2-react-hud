import React, { useState } from 'react';

import { KillEvent, Player } from 'csgogsi';
import Kill from './Kill';
import './killfeed.scss';
import { onGSI } from '../../API/contexts/actions';


export interface ExtendedKillEvent extends KillEvent {
    type: 'kill'
}

export interface BombEvent {
    player: Player,
    type: 'plant' | 'defuse'
}

const Killfeed = () => {
    const [ events, setEvents ] = useState<(BombEvent | ExtendedKillEvent)[]>([]);
    onGSI("kill", kill => {
        setEvents(ev => [...ev, {...kill, type: 'kill'}]);
    }, []);
    onGSI("data", data => {
        if(data.round && data.round.phase === "freezetime"){
            if(Number(data.phase_countdowns.phase_ends_in) < 10 && events.length > 0){
                setEvents([]);
            }
        }
    }, []);
    return (
        <div className="killfeed">
            {events.map(event => <Kill event={event}/>)}
        </div>
    );

}

export default React.memo(Killfeed);
