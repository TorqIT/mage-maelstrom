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
import meteor from "./meteor-impact.svg";
import healthPotion from "./heart-bottle.svg";
import barrier from "./stone-sphere.svg";
import teleportitis from "./misdirection.svg";
import doubleTap from "./doubled.svg";
import visible from "./eye-target.svg";
import hidden from "./sight-disabled.svg";
import flash from "./sunbeams.svg";
import evasion from "./dodge.svg";
import swift from "./crossed-slashes.svg";
import dispel from "./embrassed-energy.svg";
import frost from "./icicles-aura.svg";
import teleport from "./teleport.svg";
import clock from "./clockwork.svg";
import haste from "./fire-dash.svg";
import burst from "./mighty-force.svg";
import mind from "./psychic-waves.svg";
import ranged from "./arrow-scope.svg";
import sentry from "./sentry-gun.svg";
import skull from "./skull-crack.svg";

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

export const mmMeteor: IconDef = {
  file: meteor,
};

export const mmHealthPotion: IconDef = {
  file: healthPotion,
  filter:
    "invert(27%) sepia(100%) saturate(2563%) hue-rotate(334deg) brightness(101%) contrast(94%)",
};

export const mmBarrier: IconDef = {
  file: barrier,
  filter:
    "invert(50%) sepia(62%) saturate(2058%) hue-rotate(217deg) brightness(100%) contrast(103%)",
};

export const mmTeleportitis: IconDef = {
  file: teleportitis,
};

export const mmDoubleTap: IconDef = {
  file: doubleTap,
};

export const mmVisible: IconDef = {
  file: visible,
};

export const mmHidden: IconDef = {
  file: hidden,
};

export const mmFlash: IconDef = {
  file: flash,
  filter:
    "invert(100%) sepia(0%) saturate(2%) hue-rotate(206deg) brightness(108%) contrast(101%)",
};

export const mmEvasion: IconDef = {
  file: evasion,
  filter:
    "invert(79%) sepia(14%) saturate(1780%) hue-rotate(86deg) brightness(101%) contrast(115%)",
};

export const mmSwift: IconDef = {
  file: swift,
};

export const mmDispel: IconDef = {
  file: dispel,
  filter:
    "invert(73%) sepia(13%) saturate(5776%) hue-rotate(165deg) brightness(104%) contrast(97%)",
};

export const mmFrost: IconDef = {
  file: frost,
  filter:
    "invert(73%) sepia(13%) saturate(5776%) hue-rotate(165deg) brightness(104%) contrast(97%)",
};

export const mmTeleport: IconDef = {
  file: teleport,
};

export const mmClock: IconDef = {
  file: clock,
};

export const mmHaste: IconDef = {
  file: haste,
  filter:
    "invert(50%) sepia(62%) saturate(2058%) hue-rotate(217deg) brightness(100%) contrast(103%)",
};

export const mmBurst: IconDef = {
  file: burst,
};

export const mmMind: IconDef = {
  file: mind,
  filter:
    "invert(73%) sepia(13%) saturate(5776%) hue-rotate(165deg) brightness(104%) contrast(97%)",
};

export const mmRanged: IconDef = {
  file: ranged,
};

export const mmSentry: IconDef = {
  file: sentry,
};

export const mmSkull: IconDef = {
  file: skull,
  filter:
    "invert(100%) sepia(0%) saturate(2%) hue-rotate(206deg) brightness(108%) contrast(101%)",
};
