import { localizedMessages } from '../feature-language';

// UI copy only. Runtime identifiers, source text and arguments retain their original values.
const en = {
    Start_here_0_457e98c: (value0: unknown) => `Start here: ${value0}`,
    Hop_0_1_f2b3b22: (value0: unknown, value1: unknown) => `Hop ${value0}: ${value1}`,
    Forward_from_0_0750bae: (value0: unknown) => `Forward from ${value0}`,
    Getting_started_76e7a3a: "Getting started",
};

const zh: typeof en = {
    Start_here_0_457e98c: (value0: unknown) => `从这里开始: ${value0}`,
    Hop_0_1_f2b3b22: (value0: unknown, value1: unknown) => `跳跃 ${value0}: ${value1}`,
    Forward_from_0_0750bae: (value0: unknown) => `${value0}号前方`,
    Getting_started_76e7a3a: "开始",
};

export const featureCopy = localizedMessages(en, zh);
