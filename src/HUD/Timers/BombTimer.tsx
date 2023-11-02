import { MAX_TIMER, useBombTimer } from "./Countdown";
import { C4 } from "./../../assets/Icons";

const Bomb = () => {
  const bombData = useBombTimer();
  const show = bombData.state === "planted" || bombData.state === "defusing";
  
  return (
    <div id={`bomb_container`}>
      <div className={`bomb_timer ${show ? "show" : "hide"}`} style={{ height: `${bombData.bombTime*100/MAX_TIMER.bomb}%` }}></div>
      <div className={`bomb_icon ${show ? "show" : "hide"}`}>
        <C4 fill="white" />
      </div>
    </div>
  );
}

export default Bomb;