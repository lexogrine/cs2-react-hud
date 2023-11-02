import CameraContainer from "../Camera/Container";
import PlayerCamera from "./../Camera/Camera";

import { Skull } from "./../../assets/Icons";
import { useConfig } from "../../API/contexts/actions";
import { apiUrl } from "../../API";

interface IProps {
  steamid: string;
  url: string | null;
  slot?: number;
  height?: number;
  width?: number;
  showSkull?: boolean;
  showCam?: boolean;
  sidePlayer?: boolean;
  teamId?: string | null
}
const Avatar = (
  { steamid, url, height, width, showCam, showSkull, sidePlayer, teamId }: IProps,
) => {
  const data = useConfig("display_settings");

  const avatarUrl = teamId && (data?.replace_avatars === "always" || (data?.replace_avatars === "if_missing" && !url)) ? `${apiUrl}api/teams/logo/${teamId}` : url;
  if(!avatarUrl && !showCam) return null;
  return (
    <div className={`avatar`}>
      {showCam
        ? (sidePlayer
          ? (
            <div className="videofeed">
              <PlayerCamera steamid={steamid} visible={true} />
            </div>
          )
          : <CameraContainer observedSteamid={steamid} />)
        : null}
      {showSkull
        ? <Skull height={height} width={width} />
        : (
          avatarUrl ? <img
            src={avatarUrl}
            height={height}
            width={width}
            alt={"Avatar"}
          /> : null
        )}
    </div>
  );
};
export default Avatar;