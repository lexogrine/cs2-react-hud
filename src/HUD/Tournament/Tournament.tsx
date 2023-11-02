import React from 'react';
import './tournament.scss';
import * as I from './../../API/types';
import api from './../../API';
import Ladder from './Ladder';
import { useAction } from '../../API/contexts/actions';
import { useEffect, useState } from 'react';

const Tournament = () => {
    const [ show, setShow ] = useState(false);
    const [ teams, setTeams ] = useState<I.Team[]>([]);
    const [ matches, setMatches ] = useState<I.Match[]>([]);
    const [ tournament, setTournament ] = useState<I.Tournament | null>(null);
    
    useAction("showTournament", (data) => {
        setShow(data === "show");
    });

    useEffect(() => {
        api.tournaments.get().then(({ tournament }) => {
            if(tournament){
                setTournament(tournament);

                Promise.allSettled([api.match.get(), api.teams.get()]).then(([matches, teams]) =>{
                    setTeams(teams.status === "fulfilled" ? teams.value : []);
                    setMatches(matches.status === "fulfilled" ? matches.value : []);
                });
            }
        })
    }, []);

    if(!tournament) return null;
    return (
        <div className={`ladder-container ${show ? 'show':''}`}>
            <div className="tournament-data">
                { tournament.logo ? <img src={`data:image/jpeg;base64,${tournament.logo}`} alt={tournament.name} /> : null }
                <div className="tournament-name">
                    {tournament.name}
                </div>
            </div>
            <Ladder
                tournament={tournament}
                matches={matches}
                teams={teams}
            />

        </div>
    );
}

export default React.memo(Tournament);