// src/pages/worlds/SkillCircusWorld.jsx

import KidsWorldLayout from "../../components/KidsWorldLayout.jsx";

import bgVideo from "../../assets/videos/skill.mp4";
import skillMusic from "../../assets/sfx/skill.mp3";

import pantherIdle from "../../assets/mascots/panther-idle.png";
import pantherWin from "../../assets/mascots/panther-win.png";
import pantherJump from "../../assets/mascots/panther-jump.png";
import pantherSad from "../../assets/mascots/panther-sad.png";

export default function SkillCircusWorld() {
  return (
    <KidsWorldLayout
      title="🎯 Skill Circus"
      subtitle="Precision, Speed & Pink Panther Style!"
      mascotIdle={pantherIdle}
      mascotJump={pantherJump}
      mascotWin={pantherWin}
      mascotSad={pantherSad}
      bgVideo={bgVideo}
      music={skillMusic}
      filterArena="skillcircus"
      backPath="/kids"
    />
  );
}
