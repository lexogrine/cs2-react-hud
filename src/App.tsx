import { useEffect, useState } from 'react'
import './App.css'
import { CSGO } from 'csgogsi'
import { onGSI } from './API/contexts/actions'
import Layout from './HUD/Layout/Layout';
import './API/socket';
import { Match } from './API/types';
import api from './API';
import { GSI } from './API/HUD';
import { socket } from './API/socket';

function App() {
  const [ game, setGame ] = useState<CSGO | null>(null);
  const [ match, setMatch ] = useState<Match | null>(null);

  useEffect(() => {
    const onMatchPing = () => {
      api.match.getCurrent().then(match => {
          if (!match) {
              GSI.teams.left = null;
              GSI.teams.right = null;
              setMatch(null);
              return;
          }
          setMatch(match);
  
          let isReversed = false;
          if (GSI.last) {
              const mapName = GSI.last.map.name.substring(GSI.last.map.name.lastIndexOf('/') + 1);
              const current = match.vetos.filter(veto => veto.mapName === mapName)[0];
              if (current && current.reverseSide) {
                  isReversed = true;
              }
          }
          if (match.left.id) {
              api.teams.getOne(match.left.id).then(left => {
                  const gsiTeamData = { id: left._id, name: left.name, country: left.country, logo: left.logo, map_score: match.left.wins, extra: left.extra };
  
                  if (!isReversed) {
                      GSI.teams.left = gsiTeamData;
                  }
                  else GSI.teams.right = gsiTeamData;
              });
          }
          if (match.right.id) {
              api.teams.getOne(match.right.id).then(right => {
                  const gsiTeamData = { id: right._id, name: right.name, country: right.country, logo: right.logo, map_score: match.right.wins, extra: right.extra };
  
                  if (!isReversed) GSI.teams.right = gsiTeamData;
                  else GSI.teams.left = gsiTeamData;
              });
          }
  
  
  
      }).catch(() => {
        GSI.teams.left = null;
        GSI.teams.right = null;
        setMatch(null);
      });
    }
    socket.on("match", onMatchPing);
    onMatchPing();

    return () => {
      socket.off("match", onMatchPing);
    }
  }, [])

  onGSI('data', game => {

    setGame(game);
  }, []);

  if (!game) return null;
  return (
    <Layout game={game} match={match} />
  );
}

export default App
