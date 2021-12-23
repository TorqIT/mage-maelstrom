import { createContext, useContext, useMemo, useState } from "react";
import {
  CombatantDefinition,
  CombatantSubclass,
  IdentifiedTeam,
} from "../Combatant";
import { GameSpecs } from "./gameSpecs";
import { useGameSpecs } from "./GameSpecsProvider";

interface TeamSelection {
  left: IdentifiedTeam;
  right: IdentifiedTeam;
}

export interface TeamSelectionData {
  selection?: TeamSelection;
  combatants: CombatantDefinition[];
  setSelection: React.Dispatch<React.SetStateAction<TeamSelection | undefined>>;
}

const TeamSelectionContext = createContext<TeamSelectionData | null>(null);

export interface TeamSelectionProviderProps {}

export const TeamSelectionProvider: React.FC<TeamSelectionProviderProps> = ({
  children,
}) => {
  const specs = useGameSpecs();

  const [selection, setSelection] = useState<TeamSelection>();

  const combatants = useMemo(
    () =>
      selection
        ? selection.left.CombatantSubclasses.map((C) =>
            new C(specs).getDef()
          ).concat(
            selection.right.CombatantSubclasses.map((C) =>
              new C(specs).getDef()
            )
          )
        : [],
    [selection, specs]
  );

  return (
    <TeamSelectionContext.Provider
      value={{ selection, setSelection, combatants }}
    >
      {children}
    </TeamSelectionContext.Provider>
  );
};

export function useTeamSelection() {
  const result = useContext(TeamSelectionContext);

  if (result === null) {
    throw new Error(
      "useTeamSelection() cannot be used without being wrapped by a TeamSelectionProvider"
    );
  }

  return result;
}
