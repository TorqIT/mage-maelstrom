import attack from "./quick-slash.svg";
import fireball from "./lucifer-cannon.svg";
import talented from "./upgrade.svg";
import cooldownTimer from "./stopwatch.svg";
import manaCost from "./overmind.svg";
import poison from "./poison-gas.svg";
import crit from "./claw-slashes.svg";
import bear from "./bear-face.svg";
import heal from "./heart-plus.svg";
import regen from "./healing.svg";
import force from "./push.svg";
import thorns from "./heavy-thorny-triskelion.svg";
import music from "./musical-notes.svg";
import slow from "./snail.svg";
import stun from "./knockout.svg";
import play from "./play-button.svg";
import pause from "./pause-button.svg";
import snipe from "./dead-eye.svg";
import warning from "./hazard-sign.svg";
import range from "./lob-arrow.svg";
import vision from "./star-pupil.svg";
import dash from "./sprint.svg";
import manaSteal from "./smoking-orb.svg";

export interface IconDef {
  file: string;
  filter?: string;
}

export const mmAttack: IconDef = {
  file: attack,
};

export const mmFireball: IconDef = {
  file: fireball,
};

export const mmTalented: IconDef = {
  file: talented,
};

export const mmCooldownTimer: IconDef = {
  file: cooldownTimer,
};

export const mmManaCost: IconDef = {
  file: manaCost,
  filter:
    "invert(32%) sepia(37%) saturate(3162%) hue-rotate(230deg) brightness(101%) contrast(113%)",
};

export const mmPoison: IconDef = {
  file: poison,
  filter:
    "invert(59%) sepia(95%) saturate(430%) hue-rotate(53deg) brightness(96%) contrast(84%)",
};

export const mmCrit: IconDef = {
  file: crit,
  filter:
    "invert(61%) sepia(87%) saturate(4045%) hue-rotate(332deg) brightness(101%) contrast(100%)",
};

export const mmBear: IconDef = {
  file: bear,
};

export const mmHeal: IconDef = {
  file: heal,
  filter:
    "invert(78%) sepia(98%) saturate(1225%) hue-rotate(55deg) brightness(104%) contrast(98%)",
};

export const mmRegen: IconDef = {
  file: regen,
  filter:
    "invert(78%) sepia(98%) saturate(1225%) hue-rotate(55deg) brightness(104%) contrast(98%)",
};

export const mmForce: IconDef = {
  file: force,
};

export const mmThorns: IconDef = {
  file: thorns,
};

export const mmMusic: IconDef = {
  file: music,
};

export const mmSlow: IconDef = {
  file: slow,
};

export const mmStun: IconDef = {
  file: stun,
};

export const mmPlay: IconDef = {
  file: play,
};

export const mmPause: IconDef = {
  file: pause,
  filter:
    "invert(4%) sepia(15%) saturate(3116%) hue-rotate(182deg) brightness(92%) contrast(99%)",
};

export const mmSnipe: IconDef = {
  file: snipe,
};

export const mmWarning: IconDef = {
  file: warning,
};

export const mmRange: IconDef = {
  file: range,
};

export const mmVision: IconDef = {
  file: vision,
};

export const mmDash: IconDef = {
  file: dash,
};

export const mmManaSteal: IconDef = {
  file: manaSteal,
  filter:
    "invert(50%) sepia(62%) saturate(2058%) hue-rotate(217deg) brightness(100%) contrast(103%)",
};
