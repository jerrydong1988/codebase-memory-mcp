import { localizedMessages } from '../feature-language';

// UI copy only. Runtime identifiers, source text and arguments retain their original values.
const en = {
    Up_to_date_at_0_no_changes_since_the_last_load_1ef1046: (value0: unknown) => `Up to date at ${value0}: no changes since the last load`,
    Refresh_failed_at_0_1_20ba519: (value0: unknown, value1: unknown) => `Refresh failed at ${value0}: ${value1}`,
    Refresh_failed_at_0_64f5c19: (value0: unknown) => `Refresh failed at ${value0}`,
    Regler_und_Eingabefelder_Genau_der_Fall_aus_dem_Screenshot_vom_20_04e622b: "Regler und Eingabefelder. Genau der Fall aus dem Screenshot vom 2026-08-29: ein Tooltip lag ueber dem Detail-Regler des Twin.",
    Die_Beschriftungen_und_Schalter_der_Sektion_in_der_der_Ausloeser__5be8b99: "Die Beschriftungen und Schalter der Sektion, in der der Ausloeser steht. Wer einen Knopf beruehrt, um zu erfahren was er tut, schaut danach auf seine Nachbarn.",
};

const zh: typeof en = {
    Up_to_date_at_0_no_changes_since_the_last_load_1ef1046: (value0: unknown) => `最新时间为${value0}:自上次负载以来无变化`,
    Refresh_failed_at_0_1_20ba519: (value0: unknown, value1: unknown) => `刷新失败, 时间为 ${value0} : ${value1}`,
    Refresh_failed_at_0_64f5c19: (value0: unknown) => `${value0} 刷新失败`,
    Regler_und_Eingabefelder_Genau_der_Fall_aus_dem_Screenshot_vom_20_04e622b: "滑块与输入框。2026-08-29 的截图中，提示框遮住了代码孪生视图的详细程度滑块。",
    Die_Beschriftungen_und_Schalter_der_Sektion_in_der_der_Ausloeser__5be8b99: "触发控件所在区域的标签和开关。悬停查看按钮提示后，还可以查看相邻控件。",
};

export const featureCopy = localizedMessages(en, zh);
