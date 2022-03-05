import React, { useState } from "react";
import { Modal, Stack } from "../../Common";
import { NiceButton } from "../NiceButton";
import { AbilityGuide } from "./AbilityGuide";
import { CodingTips } from "./CodingTips";
import { RulesGuide } from "./RulesGuide";

export interface HelpProps {
  vertical?: boolean;
  size?: number;
}

export const Help: React.FC<HelpProps> = ({ size, vertical }) => {
  const [open, setOpen] = useState(false);
  const [spellOpen, setSpellOpen] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);
  const [creditOpen, setCreditOpen] = useState(false);

  return (
    <div>
      <Stack
        direction={vertical ? "vertical" : "horizontal"}
        style={vertical ? { width: size } : { height: size }}
        stretch
        gap={20}
        fill
      >
        <NiceButton onClick={() => setOpen(true)} style={{ flex: 1 }}>
          Stats & Rules
        </NiceButton>
        <NiceButton onClick={() => setSpellOpen(true)} style={{ flex: 1 }}>
          Abilities
        </NiceButton>
        <NiceButton onClick={() => setCodeOpen(true)} style={{ flex: 1 }}>
          Documentation & Tips
        </NiceButton>
        <NiceButton onClick={() => setCreditOpen(true)}>Credits</NiceButton>
      </Stack>
      <Modal
        visible={open}
        onCloseRequested={() => setOpen(false)}
        width="70vw"
      >
        <RulesGuide />
      </Modal>
      <Modal
        visible={spellOpen}
        onCloseRequested={() => setSpellOpen(false)}
        width="85vw"
      >
        <AbilityGuide />
      </Modal>
      <Modal
        visible={codeOpen}
        onCloseRequested={() => setCodeOpen(false)}
        width="80vw"
      >
        <CodingTips />
      </Modal>
      <Modal
        visible={creditOpen}
        onCloseRequested={() => setCreditOpen(false)}
        width={500}
      >
        <ul style={{ fontSize: 20 }}>
          <li>Implementation by Nicholas MacDonald</li>
          <li>
            Inspired by{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://codegolf.stackexchange.com/questions/99744/battle-of-the-fellowships-koth"
            >
              Battle of the Fellowships
            </a>
          </li>
          <li>
            Icons sourced from{" "}
            <a target="_blank" rel="noreferrer" href="https://game-icons.net/">
              Game-icons.net
            </a>
          </li>
        </ul>
      </Modal>
    </div>
  );
};
