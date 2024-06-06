import { Bomb, Events, Player } from "csgogsi";
import { useEffect, useRef, useState } from "react";
import { GSI } from "../../API/HUD";

export const MAX_TIMER = {
    planting: 3,
    defuse_kit: 5,
    defuse_nokit: 10,
    bomb: 40
}
const findNewTime = (current: number, newTime: number) => Math.abs(current - newTime) > 2 ? newTime : current;

export const useBombTimer = () => {
    const [ player, setPlayerSteamId ] = useState<Player | null>(null);
    const [ bombState, setBombState ] = useState<Bomb["state"] | null>(null);
    const [ site, setBombSite ] = useState<string | null>(null);

    const [ plantTime, setPlantTime ] = useState(0);
    const [ bombTime, setBombTime ] = useState(0);
    const [ defuseTime, setDefuseTime ] = useState(0);

    // Inner loop logic
    const previousTimeRef = useRef(0);
    const rAFRef = useRef<number>();

    useEffect(() => {
        const onData: Events["data"] = data => {
            const { bomb } = data;

            const bombPlayer = bomb?.player || null;
            const state = bomb?.state || null;
            const site = bomb?.site || null;

            const countdown = bomb?.countdown || 0;

            setPlayerSteamId(bombPlayer);
            setBombState(state);
            setBombSite(site);

            const plantNewTime = state === "planting" ? countdown : 0;
            const defuseNewTime = state === "defusing" ? countdown : 0;


            setPlantTime(curr => findNewTime(curr, plantNewTime));
            setDefuseTime(curr => findNewTime(curr, defuseNewTime));
            setBombTime(p => state === "planted" ? findNewTime(p, countdown) : p);      
        }

        GSI.on("data", onData);

        const animationFrame = (time: number) => {
            if(previousTimeRef.current){
                const deltaTime = time - previousTimeRef.current;
                const dTs = deltaTime/1000;
          
                setPlantTime(p => p <= 0 ? 0 : p - dTs);
                setDefuseTime(p => p <= 0 ? 0 : p - dTs);
                setBombTime(p => p <= 0 ? 0 : p - dTs);
            }
            previousTimeRef.current = time;
            rAFRef.current = requestAnimationFrame(animationFrame);
        }

        rAFRef.current = requestAnimationFrame(animationFrame);

        return () => {
            GSI.off("data", onData);
            if(rAFRef.current) cancelAnimationFrame(rAFRef.current);
        }


    }, []);


    return ({
        state: bombState,
        player,
        site,
        defuseTime,
        bombTime,
        plantTime
    })
}
