import { PhaseRaw } from "csgogsi";

interface IProps {
  phase: PhaseRaw | null;
}

const Pause = ({ phase }: IProps) => {
  return (
    <div
      id={`pause`}
      className={phase && phase.phase === "paused" ? "show" : ""}
    >
      PAUSE
    </div>
  );
};
export default Pause;
