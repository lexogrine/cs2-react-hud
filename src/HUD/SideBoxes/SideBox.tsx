import { useState } from 'react';
import './sideboxes.scss'
import { apiUrl } from './../../API';
import { useConfig, useOnConfigChange } from '../../API/contexts/actions';
import { hudIdentity } from '../../API/HUD';

const Sidebox = ({side, hide} : { side: 'left' | 'right', hide: boolean}) => {
    const [ image, setImage ] = useState<string | null>(null);
    const data = useConfig('display_settings');

    useOnConfigChange('display_settings', data => {
        if(data && `${side}_image` in data){
            const imageUrl = `${apiUrl}api/huds/${hudIdentity.name || 'dev'}/display_settings/${side}_image?isDev=${hudIdentity.isDev}&cache=${(new Date()).getTime()}`;
            setImage(imageUrl);
        }
    }, []);

    if(!data || !data[`${side}_title`]) return null;
    return (
        <div className={`sidebox ${side} ${hide ? 'hide':''}`}>
            <div className="title_container">
                <div className="title">{data[`${side}_title`]}</div>
                <div className="subtitle">{data[`${side}_subtitle`]}</div>
            </div>
            <div className="image_container">
                {image ? <img src={image} id={`image_left`} alt={'Left'}/>:null}
            </div>
        </div>
    );
}

export default Sidebox;