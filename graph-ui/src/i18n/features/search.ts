import { localizedMessages } from '../feature-language';

// UI copy only. Runtime identifiers, source text and arguments retain their original values.
const en = {
    find_by_meaning_8a361b0: "find by meaning",
    ask_about_one_symbol_8131e59: "ask about one symbol",
    ask_CBM_Lens_095da6c: "ask CBM Lens",
    this_line_does_two_things_56917fd: "this line does two things:",
};

const zh: typeof en = {
    find_by_meaning_8a361b0: "找到意义",
    ask_about_one_symbol_8131e59: "询问一个符号",
    ask_CBM_Lens_095da6c: "询问 CBM 个连",
    this_line_does_two_things_56917fd: "这条线有两件事:",
};

export const featureCopy = localizedMessages(en, zh);
