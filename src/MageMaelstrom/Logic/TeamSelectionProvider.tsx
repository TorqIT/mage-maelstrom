import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { validate, warn } from ".";
import { CombatantDefinition, IdentifiedTeam, Team } from "../Combatant";
import { nextId } from "../Common";
import { GameSpecs } from "./gameSpecs";
import { useGameSpecs } from "./GameSpecsProvider";

interface ValidatedTeam {
  team: IdentifiedTeam;
  warnings: string[];
  errors: string[];
}

interface Selection<T> {
  left: T;
  right: T;
}

type TeamIndices = Selection<number>;
type TeamSelection = Selection<IdentifiedTeam>;
type ValidatedSelection = Selection<ValidatedTeam>;

export interface TeamSelectionData {
  validatedSelection?: ValidatedSelection;
  selection?: TeamSelection;
  teams: ValidatedTeam[];
  combatants: CombatantDefinition[];
  startGame: (leftIndex: number, rightIndex: number) => void;
  resetGame: () => void;
  clearGame: () => void;
}

const TeamSelectionContext = createContext<TeamSelectionData | null>(null);

export interface TeamSelectionProviderProps {
  teams: Team[];
}

export const TeamSelectionProvider: React.FC<TeamSelectionProviderProps> = ({
  teams,
  children,
}) => {
  const specs = useGameSpecs();

  const identifiedTeams = useMemo(
    () =>
      teams.map((t) => {
        const team: IdentifiedTeam = {
          ...t,
          id: nextId(),
        };

        return {
          team,
          errors: validate(t, specs),
          warnings: warn(t, specs),
        };
      }),
    [teams, specs]
  );

  const [selection, setSelection] = useState<TeamIndices>();

  useEffect(() => {
    setSelection(undefined);
  }, [teams.length]);

  const validatedSelection = useMemo(
    (): ValidatedSelection | undefined =>
      selection
        ? {
            left: identifiedTeams[selection.left],
            right: identifiedTeams[selection.right],
          }
        : undefined,
    [identifiedTeams, selection]
  );

  const teamSelection = useMemo(
    (): TeamSelection | undefined =>
      validatedSelection
        ? {
            left: validatedSelection.left.team,
            right: validatedSelection.right.team,
          }
        : undefined,
    [validatedSelection]
  );

  const combatants = useMemo(
    () =>
      teamSelection
        ? teamSelection.left.CombatantSubclasses.map((C) =>
            new C().getDef()
          ).concat(
            teamSelection.right.CombatantSubclasses.map((C) => new C().getDef())
          )
        : [],
    [teamSelection]
  );

  const startGame = useCallback(
    (leftIndex: number, rightIndex: number) =>
      setSelection({ left: leftIndex, right: rightIndex }),
    []
  );

  const resetGame = useCallback(
    () => setSelection(selection ? { ...selection } : undefined),
    [selection]
  );

  const clearGame = useCallback(() => setSelection(undefined), []);

  return (
    <TeamSelectionContext.Provider
      value={{
        selection: teamSelection,
        validatedSelection,
        teams: identifiedTeams,
        combatants,
        startGame,
        resetGame,
        clearGame,
      }}
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
