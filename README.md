
<p align="center">
	<p align="center" style="font-weight:600; letter-spacing:1pt; font-size:20pt;">LEXOGRINE HUD</p>
	<p align="center"><img src="icon.png" alt="Logo" width="80" height="80"></p>
	<p align="center" style="font-weight:400;">Powered by <a href='https://github.com/lexogrine/hud-manager'><strong>« Lexogrine HUD Manager »</strong></a></p>
</p>

# Lexogrine HUD

  

Fullfledged example of the React HUD made for HUD Manager. It has:

- Custom actions
- Keybinds
- Player cam feed
- Custom Radar

## Keybinds:
### **Left Alt + B**
>Makes radar smaller by 20px;
### **Left Alt + V**
>Makes radar bigger by 20px;
### **Left Alt + C**
>Toggles camera feed

## **Panel**
## Trivia settings

|  Field|Description  |
|--|--|
|  Trivia title| `Text` |
|  Trivia content| `Text` |


## Display settings


|  Field|Description  |
|--|--|
|  Left/right box's title| `Text` |
|  Left/right box's title| `Text` |
|  Left/right box's image logo| `Image file` |

## Example settings

![Preview of HUDs settings](settings.png)

## Preview

![Preview of HUDs panel in action](preview.png)

# Download

To download it just click here: [DOWNLOAD HUD](https://github.com/lexogrine/cs2-react-hud/releases/latest)

# Instruction
## Setting up
Fork this repo, clone it, and then run `npm install` and `npm start`. HUD should start on the 3500 port. For this to work have HUD Manager opened so it will pass CS2 data to the HUD.

## Identifying HUD
In `/public` directory edit hud.json so it fits you - fill HUD's name, author, version, specify the radar and killfeed functionalities. At the end replace the thumb.png with your icon :)

## Building & distributing
To build version to distribute and move around, in the root directory run `npm run pack`. It will create the zip file for distribution. Now you can just drag and drop this file into the HUD Managers upload area.

## Signing

To create Signed HUD to prevent at least from modyfing compiled Javascript files run `npm run sign`. It's the same as `npm run pack` command but with additional step of signing .js and .css files and hud.json.

  
 ## File structure
 The HUD is seperated into two parts - the API part, that connects to the HUD Manager API and communicate with it: `src/App.tsx` file and `src/api` directory. Usually, you don't want to play with it, so the whole runs without a problem.
 The second part is the render part - `src/HUD`, `src/fonts` and `src/assets` are the directories you want to modify. In the `src/HUD` each element of the HUD is seperated into its own folder. Styles are kept in the `src/HUD/styles`. Names are quite self-explanatory, and to modify style of the element you should just find  the styling by the file and class name.


## `panel.json` API
To get the incoming data from the HUD Manager, let's take a look at the `src/HUD/SideBoxes/SideBox.tsx` component:
```typescript
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
```

You can just read data from the HUDs settings by using `useConfig` hook. Everything is now strictly typed. If you make a change to panel or keybinds JSON files, Vite server will automatically generate types for you, so useConfig should always be up to date.

If you want to listen for a change in settings, you can use `useOnConfigChange`. In this case we are using this to force refresh `src` attribute of the img element.

If you want to listen for action input, you can just use `useAction` hook, like here in Trivia.tsx:
```typescript
useAction('triviaState', (state) => {
   setShow(state === "show");
});
```
For the action input we need to import the `actions` object and create listener with the parameter on it.
## `keybinds.json` API
Keybinds API works in very similiar to `panel.json` action API. This time the example will be from `RadarMaps.tsx`:
```typescript
useAction('radarBigger', () => {
   setRadarSize(p => p+10);
}, []);

useAction('radarSmaller', () => {
   setRadarSize(p => p-10);
}, []);
```


## Killfeed
Because our  `csgogsi` has the ability to process input from HLAE's MIRV, listening for kills is very easy. We can see than in `src/HUD/Killfeed/Killfeed.tsx`:
```javascript
componentDidMount() {
	GSI.on("kill", kill  => {
		this.addKill(kill);
	});
}
```
The Killfeed component basically just keeps kills in the state during the round, and after the round it cleans the state. Kills have CSS animation, that makes them gently show, and after a few seconds disappear, the experience is very smooth. You can fiddle with the styling in the `killfeed.css`
This killfeed detects who killed whom, if there was an assist (flash assist as well), used weapon, headshot and wallbang.

## Radar
Radar is custom React-based component, made by Hubert Walczak, and is easily editable from css.
