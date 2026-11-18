import { localizedMessages } from '../feature-language';

// UI copy only. Runtime identifiers, source text and arguments retain their original values.
const en = {
    message_3D_graph_edge_colors_and_motion_08b9fc5: "3D graph edge colors and motion",
    Edges_dffa33c: "Edges",
    message_3D_edge_appearance_0d4c0e1: "3D edge appearance",
    Direction_pulse_4a4c94a: "Direction pulse",
    Motion_is_paused_by_your_reduced_motion_setting_6befd45: "Motion is paused by your reduced-motion setting.",
    A_subtle_pulse_shows_relationship_direction_across_all_3D_graphs_6eacb00: "A subtle pulse shows relationship direction across all 3D graphs.",
    Edge_color_key_6685d11: "Edge color key",
};

const zh: typeof en = {
    message_3D_graph_edge_colors_and_motion_08b9fc5: "3D 图形边颜色和运动",
    Edges_dffa33c: "边",
    message_3D_edge_appearance_0d4c0e1: "三维边外观",
    Direction_pulse_4a4c94a: "方向脉冲",
    Motion_is_paused_by_your_reduced_motion_setting_6befd45: "运动会因您的减动设置而暂停.",
    A_subtle_pulse_shows_relationship_direction_across_all_3D_graphs_6eacb00: "一个细微的脉冲显示所有3D图形间的关系方向.",
    Edge_color_key_6685d11: "边框颜色密钥",
};

export const featureCopy = localizedMessages(en, zh);
