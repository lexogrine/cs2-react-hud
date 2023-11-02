import * as I from "csgogsi";
import "./matchbar.scss";
import TeamScore from "./TeamScore";
import Bomb from "./../Timers/BombTimer";
import { useBombTimer } from "./../Timers/Countdown";
import { Match } from './../../API/types';


function stringToClock(time: string | number, pad = true) {
  if (typeof time === "string") {
    time = parseFloat(time);
  }
  const countdown = Math.abs(Math.ceil(time));
  const minutes = Math.floor(countdown / 60);
  const seconds = countdown - minutes * 60;
  if (pad && seconds < 10) {
    return `${minutes}:0${seconds}`;
  }
  return `${minutes}:${seconds}`;
}

interface IProps {
  match: Match | null;
  map: I.Map;
  phase: I.PhaseRaw,
  bomb: I.Bomb | null,
}

export interface Timer {
  time: number;
  active: boolean;
  side: "left"|"right";
  type: "defusing" | "planting";
  player: I.Player | null;
}
const getRoundLabel = (mapRound: number) => {
  const round = mapRound + 1;
  if (round <= 30) {
    return `Round ${round}/30`;
  }
  const additionalRounds = round - 30;
  const OT = Math.ceil(additionalRounds/6);
  return `OT ${OT} (${additionalRounds - (OT - 1)*6}/6)`;
}

const Matchbar = (props: IProps) => {
    const { bomb, match, map, phase } = props;
    const time = stringToClock(phase.phase_ends_in);
    const left = map.team_ct.orientation === "left" ? map.team_ct : map.team_t;
    const right = map.team_ct.orientation === "left" ? map.team_t : map.team_ct;
    const isPlanted = bomb && (bomb.state === "defusing" || bomb.state === "planted");
    const bo = (match && Number(match.matchType.substr(-1))) || 0;

    const bombData = useBombTimer();
    const plantTimer: Timer | null = bombData.state === "planting" ? { time:bombData.plantTime, active: true, side: bombData.player?.team.orientation || "right", player: bombData.player, type: "planting"} : null;
    const defuseTimer: Timer | null = bombData.state === "defusing" ? { time:bombData.defuseTime, active: true, side: bombData.player?.team.orientation || "left", player: bombData.player, type: "defusing"} : null;

    return (
      <>
        <div id={`matchbar`}>
          <TeamScore team={left} orientation={"left"} timer={left.side === "CT" ? defuseTimer : plantTimer}/>
          <div className={`score left ${left.side}`}>{left.score}</div>
          <div id="timer" className={bo === 0 ? 'no-bo' : ''}>
            <div id={`round_timer_text`} className={isPlanted ? "hide":""}>{time}</div>
            <div id="round_now" className={isPlanted ? "hide":""}>{getRoundLabel(map.round)}</div>
            <Bomb />
          </div>
          <div className={`score right ${right.side}`}>{right.score}</div>
          <TeamScore team={right} orientation={"right"} timer={right.side === "CT" ? defuseTimer : plantTimer} />
        </div>
      </>
    );
}

export default Matchbar;
