import { Team } from "../MageMaelstrom";
import { brutishBarbarians } from "./brutishBarbarians";
import { dashingRogues } from "./dashingRogues";
import { torqTrolls } from "./eduardo";
import { GutsTeam } from "./Guts";
import { JankyJesters } from "./JankyJesters";
import { knightAndBishop } from "./knightAndBishop";
import { pimconauts } from "./pimconauts";
import { sentryBears } from "./SentryBears";
import { spellslingers } from "./spellslingers";
import { testDummies } from "./testDummies";
import { summoners } from "./theSummoners";
import { tmpTeam } from "./tmpTeam";

const teams = [
  testDummies,
  dashingRogues as Team,
  spellslingers as Team,
  brutishBarbarians as Team,
  knightAndBishop as Team,
  summoners as Team,
  GutsTeam,
  pimconauts,
  sentryBears,
  torqTrolls,
  tmpTeam,
  JankyJesters,
];

export { teams };
