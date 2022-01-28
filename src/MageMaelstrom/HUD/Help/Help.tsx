import React, { useState } from "react";
import { Modal, Stack } from "../../Common";
import { NiceButton } from "../NiceButton";
import { AbilityGuide } from "./AbilityGuide";
import { RulesGuide } from "./RulesGuide";

export interface HelpProps {
  vertical?: boolean;
  size?: number;
}

export const Help: React.FC<HelpProps> = ({ size, vertical }) => {
  const [open, setOpen] = useState(false);
  const [spellOpen, setSpellOpen] = useState(false);

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
          Stats and Rules
        </NiceButton>
        <NiceButton onClick={() => setSpellOpen(true)} style={{ flex: 1 }}>
          Abilities
        </NiceButton>
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
        width="90vw"
      >
        <AbilityGuide />
      </Modal>
    </div>
  );
};
