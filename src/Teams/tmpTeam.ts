import {
  Action,
  ActParams,
  Combatant,
  CombatantDefinition,
  Team,
} from "../MageMaelstrom";
import { Coordinate, ReadonlyCoordinate } from "../MageMaelstrom/Arena";
import {
  InitParams,
  OnTakeDamageParams,
  OnStatusEffectAppliedParams,
  ReadonlyEntrant,
  ReadonlyEntrantStatus,
} from "../MageMaelstrom/Combatant";

class TmpTeamAttackCombatant extends Combatant {
  public define(): CombatantDefinition {
    return {
      name: "Garth",
      icon: "/default.svg",
      strength: 21,
      agility: 5,
      intelligence: 14,
      abilities: ['meteor', 'manasteal', 'thorns', 'evasion'],
    };
  }

  public init(params: InitParams): void {}

  public act({actions, allies, helpers, spells, tick, visibleEnemies, you}: ActParams): Action {
    var localthis = this;
    var location = you.coords;
    if(location.getX() != 1 || location.getY() != 1){
        let tmp = actions.moveTo({x:1, y:1});
        if(tmp && helpers.canPerform(tmp)){
            return tmp;
        }
    }
    let action = actions.cast(spells[0], {x:3, y:3});
    if(helpers.canPerform(action)){
        return action;
    }
    localthis.shout(helpers.getActionResult(action))
    return actions.dance();
  }

  public onTakeDamage(params: OnTakeDamageParams): void {

  }

  public onStatusEffectApplied(params: OnStatusEffectAppliedParams): void {

  }
}

class TmpTeamSupportCombatant extends Combatant {
    public define(): CombatantDefinition {
      return {
        name: "Barbie",
        icon: "/chess-knight.svg",
        strength: 5,
        agility: 20,
        intelligence: 15,
        abilities: ['regen', 'heal', 'doubletap', 'force'],
      };
    }
  
    public init(params: InitParams): void {}
  
    public act({actions, allies, helpers, spells, tick, visibleEnemies, you}: ActParams): Action {
        var localthis = this;
        let location = you.coords;
        //get to 0,0 then heal garth
        if(location.getX() != 0 || location.getY() != 0){
            let tmp = actions.moveTo({x:0, y:0});
            if(tmp && helpers.canPerform(tmp)){
                return tmp;
            }
        }
        //getGarth
        var garth:ReadonlyEntrantStatus = you;
        allies.forEach(function (ally){
            if(ally.id != you.id){
                garth = ally;
                localthis.shout("THERES GARTH");
            }
        });
        var alreadyHealing = false;
        garth.statusesEffects.forEach(function (status){
            if(status == 'regen') alreadyHealing = true;
        })
        if(!alreadyHealing){
            let action = actions.cast(spells[0], garth.id);
            if(helpers.canPerform(action)){
                return action;
            }
        }
        let action = actions.cast(spells[1], garth.id);
        if(helpers.canPerform(action)){
            return action;
        }
        return actions.dance();
    }
   
    public onTakeDamage(params: OnTakeDamageParams): void {}
  
    public onStatusEffectApplied(params: OnStatusEffectAppliedParams): void {}
  }

export const tmpTeam: Team = {
  name: "TmpTeam",
  color: "#000",
  author: "Cam",
  CombatantSubclasses: [TmpTeamAttackCombatant, TmpTeamSupportCombatant],
};
