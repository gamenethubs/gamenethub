// src/pages/worlds/RacingCityWorld.jsx

import KidsWorldLayout from "../../components/KidsWorldLayout.jsx";

import bgVideo from "../../assets/videos/racing.mp4";
import racingMusic from "../../assets/sfx/racing.mp3";

import motuIdle from "../../assets/mascots/motu-idle.png";
import motuWin from "../../assets/mascots/motu-win.png";
import motuJump from "../../assets/mascots/motu-jump.png";
import motuSad from "../../assets/mascots/motu-sad.png";

export default function RacingCityWorld() {
  return (
    <KidsWorldLayout
      title="🏁 Racing City"
      subtitle="Speed, Fun & Motu Patlu Madness!"
      mascotIdle={motuIdle}
      mascotJump={motuJump}
      mascotWin={motuWin}
      mascotSad={motuSad}
      bgVideo={bgVideo}
      music={racingMusic}
      filterArena="racingcity"
      backPath="/kids"
    />
  );
}
