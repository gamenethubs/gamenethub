

///////////////////////////src/pages/worlds/BrainLabWorld.jsx///////

import KidsWorldLayout from "../../components/KidsWorldLayout.jsx";

import bgVideo from "../../assets/videos/puzzle.mp4";
import brainMusic from "../../assets/sfx/brain.mp3";

import tjIdle from "../../assets/mascots/tj-idle.png";
import tjWin from "../../assets/mascots/tj-win.png";
import tjJump from "../../assets/mascots/tj-jump.png";
import tjSad from "../../assets/mascots/tj-sad.png";

export default function BrainLabWorld() {
  return (
    <KidsWorldLayout
      title="🧠 Brain Lab"
      subtitle="Train your Brain with Fun!"
      mascotIdle={tjIdle}
      mascotJump={tjJump}
      mascotWin={tjWin}
      mascotSad={tjSad}
      bgVideo={bgVideo}
      music={brainMusic}
      filterArena="brainlab"
    />
  );
}
