import { Team } from "../MageMaelstrom";
import { brutishBarbarians } from "./brutishBarbarians";
import { dashingRogues } from "./dashingRogues";
import { knightAndBishop } from "./knightAndBishop";
import { spellslingers } from "./spellslingers";
import { testDummies } from "./testDummies";
import { summoners } from "./theSummoners";

const teams = [
  testDummies,
  dashingRogues as Team,
  spellslingers as Team,
  brutishBarbarians as Team,
  knightAndBishop as Team,
  summoners as Team,
];

export { teams };
