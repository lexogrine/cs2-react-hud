import type { Bomb, Side } from 'csgogsi';
import maps, { MapConfig, ZoomAreas } from './maps';
import './index.scss';
import { RadarPlayerObject, RadarGrenadeObject } from './interface';
import config from './config';
import { parsePosition } from './utils';
interface IProps {
  players: RadarPlayerObject[];
  grenades: RadarGrenadeObject[];
  bomb?: Bomb | null;
  mapName: string;
  zoom?: ZoomAreas;
  mapConfig: MapConfig,
  reverseZoom: string,
}
const isShooting = (lastShoot: number) => (new Date()).getTime() - lastShoot <= 250;

type Explosion = {
  position: number[],
  grenadeId: string
}

/*
const SMOKE_PARTICLE_BASE_AMOUNT = 10;
//const PARTICLE_MAP_SOURCE = Array(SMOKE_PARTICLE_BASE_AMOUNT**2).fill(0);

const SMOKE_PARTICLE_SIZE_ABSOLUT = config.smokeSize/SMOKE_PARTICLE_BASE_AMOUNT;

const PARTICLE_SIDE = `${SMOKE_PARTICLE_SIZE_ABSOLUT}px`;




const FRAG_RADIUS = 40;
//const MAX_DISTANCE_BETWEEN_FRAG_AND_SMOKE = config.smokeSize + FRAG_RADIUS;

const getDistance = (X: number[], Y: number[]) => {
  const a = X[0] - Y[0];
  const b = X[1] - Y[1];
  
  return Math.sqrt( a*a + b*b );
}

const getPosOfIndex = (index: number, origin: number[]) => {
  const leftI = index%10;
  const topI = Math.floor(index/10);
  return ([origin[0] - config.smokeSize/2 + (leftI + 0.5) * SMOKE_PARTICLE_SIZE_ABSOLUT, origin[1] - config.smokeSize/2 + (topI + 0.5)*SMOKE_PARTICLE_SIZE_ABSOLUT]);
}

const Particle = ({ index, explosions, origin }: { index: number, origin: number[], explosions: Explosion[] }) => {
  const PARTICLE_POSITION = getPosOfIndex(index, origin);
  const isHidden = getDistance(PARTICLE_POSITION, origin) > config.smokeSize/2 || explosions.some(expl => getDistance(expl.position, PARTICLE_POSITION) <= FRAG_RADIUS);
  return (<div className={`particle ${isHidden ? 'hide':''}`} style={{ width: PARTICLE_SIDE, height: PARTICLE_SIDE}}/>);
}
*/

const Grenade = ({ reverseZoom, type, state, visible, position, flames, side }: { explosions: Explosion[], reverseZoom: string, side: Side | null, flames: boolean, type: RadarGrenadeObject["type"], state: RadarGrenadeObject["state"], visible: boolean, position: number[] }) => {
  if (flames) {
    return null;
  }

  if(type === "smoke" && (state === "landed" || state === "exploded")){
    return (
      <div className={`grenade ${type} ${state} ${side || ''} ${visible ? 'visible':'hidden'}`}
        style={{
          transform: `translateX(${position[0]}px) translateY(${position[1]}px) translateZ(10px) scale(${reverseZoom})`,
        }}>
        <div className="content" style={{ width: config.smokeSize, height: config.smokeSize }}>
          <div className="explode-point"></div>
          <div className="background">
          </div>
      </div>
      </div>
    )
  }
  return (
    <div className={`grenade ${type} ${state} ${side || ''} ${visible ? 'visible':'hidden'}`}
      style={{
        transform: `translateX(${position[0]}px) translateY(${position[1]}px) translateZ(10px) scale(${reverseZoom})`,
      }}>
      <div className="content">
        <div className="explode-point"></div>
        <div className="background"></div>
      </div>
    </div>
  )
}

const Bomb = ({ bomb, mapConfig, reverseZoom }: { reverseZoom: string, bomb?: Bomb | null, mapConfig: MapConfig }) => {
  if(!bomb) return null;
  if(bomb.state === "carried" || bomb.state === "planting") return null;
  if("config" in mapConfig){
    const position = parsePosition(bomb.position, mapConfig.config);
    if(!position) return null;
    
    return (
      <div className={`bomb ${bomb.state} visible`}
        style={{
          transform: `translateX(${position[0].toFixed(2)}px) translateY(${position[1].toFixed(2)}px) translateZ(10px) scale(${reverseZoom})`
        }}>
        <div className="content">
          <div className="explode-point"></div>
          <div className="background"></div>
        </div>
      </div>
    )
  }
  return mapConfig.configs.map(config => {
    const position = parsePosition(bomb.position, config.config);
    if(!position) return null;
    return (
      <div key={`bomb_${config.id}`} className={`bomb ${bomb.state} ${config.isVisible(bomb.position[2]) ? 'visible':'hidden'}`}
        style={{
          transform: `translateX(${position[0].toFixed(2)}px) translateY(${position[1].toFixed(2)}px) translateZ(10px) scale(${reverseZoom})`
        }}>
          <div className="content">
            <div className="explode-point"></div>
            <div className="background"></div>
          </div>
      </div>
    )
  });
}

const PlayerDot = ({ player, reverseZoom }: { reverseZoom: string, player: RadarPlayerObject }) => {
  const isShootingNow = isShooting(player.lastShoot);
  //console.log('x',isShooting(player.lastShoot), player.steamid);
  return (
    <div
      className={`player ${player.shooting? 'shooting':''} ${player.flashed ? 'flashed':''} ${player.side} ${player.hasBomb ? 'hasBomb':''} ${player.isActive ? 'active' : ''} ${!player.isAlive ? 'dead' : ''} ${player.visible ? 'visible':'hidden'}`}
      style={{
        transform: `translateX(${player.position[0].toFixed(2)}px) translateY(${player.position[1].toFixed(2)}px) translateZ(10px) scale(${reverseZoom})`,
        
      }}>
        <div className="content" style={{
          width: config.playerSize * player.scale,
          height: config.playerSize * player.scale
        }}>
          <div className="background-fire" style={{ transform: `rotate(${-90 + player.position[2]}deg)`, opacity: isShootingNow ? 1 : 0 }} ><div className="bg"/></div>
          <div className="background" style={{ transform: `rotate(${45 + player.position[2]}deg)` }}></div>
          <div className="label">{player.label}</div>
        </div>
    </div>
  )
}


const Radar = ({ players, grenades, mapConfig, bomb, mapName, zoom, reverseZoom }: IProps) => {
    //if(players.length === 0) return null;
    
    const style: React.CSSProperties = { backgroundImage: `url(${maps[mapName].file})` }

    if(zoom){
      style.transform = `scale(${zoom.zoom})`;
      style.transformOrigin = `${zoom.origin[0]}px ${zoom.origin[1]}px`;
    }
    const explosions = grenades.filter(grenade => grenade.type === "frag" && grenade.state === "exploded");
    return <div className="map" style={style}>
        {players.map(player => <PlayerDot reverseZoom={reverseZoom} key={player.id} player={player} />)}
        {grenades.map(grenade => <Grenade explosions={explosions.map(g => ({ position: g.position, grenadeId: g.id }))} reverseZoom={reverseZoom} side={grenade.side} key={grenade.id} type={grenade.type} state={grenade.state} visible={grenade.visible} position={grenade.position} flames={"flames" in grenade} />)}
        <Bomb reverseZoom={reverseZoom} bomb={bomb} mapConfig={mapConfig} />
      </div>;
}

export default Radar;
