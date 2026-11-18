import { featureLanguage, localizedMessages } from './feature-language';

const en = {
    operation: 'this operation', server: 'server', updating: 'Updating view…',
    memoryNote: '. Memory use is higher.', baseModel: '(base model)',
    showLegend: 'show legend', hideLegend: 'hide legend',
    baseline: 'Coding baseline · WebGPU with shader-f16 · 8K browser context',
    small: 'Small download · WebGPU with shader-f16 · non-thinking · 8K browser context',
    instruction: 'Instruction-following candidate · WebGPU with shader-f16 · 8K browser context · not benchmarked in CBM',
    textOnly: 'Text only · WebGPU with shader-f16 · non-thinking · 8K browser context · not benchmarked in CBM',
};
const zh: typeof en = {
    operation: '此操作', server: '服务', updating: '正在更新视图…',
    memoryNote: '。实际内存占用高于下载大小。', baseModel: '（基础模型）',
    showLegend: '显示图例', hideLegend: '隐藏图例',
    baseline: '编程基准模型 · 需要支持 shader-f16 的 WebGPU · 浏览器上下文 8K',
    small: '下载体积较小 · 需要支持 shader-f16 的 WebGPU · 非思考模式 · 浏览器上下文 8K',
    instruction: '指令遵循候选模型 · 需要支持 shader-f16 的 WebGPU · 浏览器上下文 8K · 未在 CBM 中进行基准测试',
    textOnly: '仅文本 · 需要支持 shader-f16 的 WebGPU · 非思考模式 · 浏览器上下文 8K · 未在 CBM 中进行基准测试',
};
export const presentation = localizedMessages(en, zh);

const labels: Record<string, string> = {
    calls: '调用', imports: '导入', usage: '引用', inherits: '继承', implements: '实现', data_flows: '数据流',
    overview: '概览', dependencies: '依赖', routes: '路由', hotspots: '热点', structure: '结构', behavior: '行为',
    Stopping: '正在停止', Loading: '正在加载', 'Checking context': '正在检查上下文', Answering: '正在回答',
    'Deleting cache': '正在删除缓存', Loaded: '已加载', Off: '关闭',
};
/** Called only at presentation boundaries; filter values keep their protocol identifiers. */
export function presentationLabel(value: string): string {
    return featureLanguage() === 'zh' && Object.hasOwn(labels, value) ? labels[value]! : value;
}
