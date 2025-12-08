// src/pages/worlds/MathLandWorld.jsx

import KidsWorldLayout from "../../components/KidsWorldLayout.jsx";

import bgVideo from "../../assets/videos/math.mp4";
import mathMusic from "../../assets/sfx/math.mp3";

import minnieIdle from "../../assets/mascots/minnie-idle.png";
import minnieWin from "../../assets/mascots/minnie-win.png";
import minnieJump from "../../assets/mascots/minnie-jump.png";
import minnieSad from "../../assets/mascots/minnie-sad.png";

export default function MathLandWorld() {
  return (
    <KidsWorldLayout
      title="🔢 Candy Math Land"
      subtitle="Sweet Numbers with Minnie!"
      mascotIdle={minnieIdle}
      mascotJump={minnieJump}
      mascotWin={minnieWin}
      mascotSad={minnieSad}
      bgVideo={bgVideo}
      music={mathMusic}
      filterArena="candymath"
      backPath="/kids"
    />
  );
}
