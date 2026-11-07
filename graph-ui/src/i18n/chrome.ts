import { workspaceStrings, type Workspace } from '../app/workspace-strings';
import { messages } from './messages';
import { useUiLanguage, type UiLanguage } from './ui-language';

type AppMessages = {
    [K in keyof typeof messages.app]: (typeof messages.app)[K] extends string ? string : (typeof messages.app)[K];
};
interface ChromeMessages {
    app: AppMessages;
    workspace: typeof workspaceStrings;
}

const workspaceNames: Record<Workspace, string> = {
    explore: '代码浏览', galaxy: '图谱', architecture: '架构', adr: '架构决策',
    agents: '智能体', coverage: '索引覆盖', system: '系统',
};
const daemonStates: Record<string, string> = {
    connected: '已连接', disconnected: '连接已断开', checking: '正在检查',
};

const chinese: ChromeMessages = {
    app: {
        brand: messages.app.brand,
        releaseLabel: messages.app.releaseLabel,
        noFileOpen: '尚未打开文件',
        noProject: '未选择项目',
        closeTab: name => `关闭 ${name}`,
    },
    workspace: {
        navigation: '工作区',
        workspaces: workspaceStrings.workspaces.map(item => ({ ...item, label: workspaceNames[item.id] })),
        tools: '工具',
        search: '搜索',
        searchOpen: '打开搜索与命令',
        searchTitle: '搜索与命令',
        searchPlaceholder: '查找符号、按含义搜索，或运行命令',
        searchClose: '关闭搜索',
        loadedSearchHeadline: (query, count) => `已加载的内容中有 ${count} 项匹配“${query}”，索引中没有匹配结果。`,
        searchShortcut: workspaceStrings.searchShortcut,
        searchExamples: '试试搜索或图谱命令',
        chatGraphHeight: '对话下方的图谱高度',
        guidance: '说明详细程度',
        brief: '简要',
        briefValue: workspaceStrings.briefValue,
        explained: '详细',
        explainedValue: workspaceStrings.explainedValue,
        diagnostics: '连接详情',
        coverage: '索引详情',
        model: '模型详情',
        perspective: '阅读偏好',
        welcomeEyebrow: workspaceStrings.welcomeEyebrow,
        welcomeTitle: '了解你的代码',
        welcomeDescription: '浏览源码，了解项目的架构。',
        descriptions: {
            explore: '结合图谱阅读源码。',
            galaxy: '浏览整个图谱，了解索引的覆盖范围。',
            architecture: '查看模块、依赖和入口点。',
            adr: '阅读和编辑项目的架构决策记录。',
            agents: '查看已记录的活动及其涉及的代码。',
            coverage: '检查已索引的路径、排除项和未能解析的内容。',
            system: '查看后台服务、索引和日志。',
        },
        changeLater: '你可以随时切换工作区。',
        localAi: '设置浏览器 AI',
        browserAi: '对话',
        agentControls: '本地智能体',
        agentStatus: { off: '已关闭', loading: '正在加载', active: '已就绪', busy: '正在处理', error: '出错' },
        agentSettings: (status, model) => `本地智能体设置（${status}${model ? `，${model}` : ''}）`,
        agentSettingsTitle: (status, model) => `${status}${model ? ` · ${model}` : ''}。配置浏览器中的本地智能体。`,
        openChat: '打开对话',
        hideChat: '收起对话',
        daemon: '后台服务',
        daemonNavigation: state => `打开系统页面（后台服务状态：${daemonStates[state] ?? state}）`,
        chatWidth: '本地对话宽度',
        askSelection: '就选中内容提问',
        assessImpact: '分析影响',
        codeDetails: '代码详情',
        indexInventory: '索引清单与图例',
        selectionImpact: '分析变更影响',
        changeAnalysis: '变更分析',
        sourceOutsideSnapshot: '此文件不在当前加载的索引快照中。',
        selectionEvidence: '选中项的依据',
        graphContext: '图谱上下文',
        coverageShadowSelection: name => `索引覆盖盲区：${name}`,
        start: '开始浏览',
        aiOptional: '浏览器 AI 默认关闭，可按需启用。下载模型前会征求确认。',
    },
};

const catalogs: Record<UiLanguage, ChromeMessages> = {
    en: { app: messages.app, workspace: workspaceStrings },
    zh: chinese,
};

export function useChromeMessages(): ChromeMessages {
    return catalogs[useUiLanguage()];
}
