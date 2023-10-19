import React from 'react';
import CameraContainer from '../Camera/Container';
import PlayerCamera from "./../Camera/Camera";

import { avatars } from './../../api/avatars';

import { Skull } from './../../assets/Icons';
import { configs } from '../../App';
import { apiUrl } from '../../api/api';

interface IProps {
  steamid: string,
  teamId?: string | null,
  slot?: number,
  height?: number,
  width?: number,
  showSkull?: boolean,
  showCam?: boolean,
  sidePlayer?: boolean
}
export default class Avatar extends React.Component<IProps, { replaceAvatar: 'never' | 'if_missing' | 'always' }> {
  constructor(props: IProps){
    super(props);
    this.state = {
      replaceAvatar: 'never'
    }
  }
  componentDidMount() {
    const onDataChange = (data:any) => {
      if(!data) return;
      const display = data.display_settings;
      if(!display) return;
      this.setState({
        replaceAvatar: display.replace_avatars || 'never'
      })
  };
    configs.onChange(onDataChange);
    onDataChange(configs.data);
  }
  getAvatarUrl = () => {
    const avatarData = avatars[this.props.steamid] && avatars[this.props.steamid].url ? avatars[this.props.steamid].url : null;

    if(this.state.replaceAvatar === 'always' || (this.state.replaceAvatar === 'if_missing' && !avatarData)){
      return this.props.teamId ? `${apiUrl}api/teams/logo/${this.props.teamId}` : avatarData || null;
    }
    return avatarData || null;

  }
  render() {
    const { showCam, steamid, width, height, showSkull, sidePlayer } = this.props;
    //const url = avatars.filter(avatar => avatar.steamid === this.props.steamid)[0];
    const avatarUrl = this.getAvatarUrl();
    if (!avatarUrl) {
      return null;
    }

    return (
      <div className={`avatar`}>
        {
          showCam ? ( sidePlayer ? <div className="videofeed"><PlayerCamera steamid={steamid} visible={true} /></div> : <CameraContainer observedSteamid={steamid} />) : null
        }
        {
          showSkull ? <Skull height={height} width={width} /> : <img src={avatarUrl} height={height} width={width} alt={'Avatar'} />
        }

      </div>
    );
  }

}
