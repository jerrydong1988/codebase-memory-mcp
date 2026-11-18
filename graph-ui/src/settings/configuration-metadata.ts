import type { UiLanguage } from '../i18n/ui-language';
import type { ConfigSetting } from './config-model';

// Presentation only: stable daemon setting keys, never translated values or identifiers.
const zh: Record<string, Pick<ConfigSetting, 'label' | 'description'> & { sourceDescription: string }> = {
    "auto_index": {
        sourceDescription: "Index a project when an MCP session connects.",
        "label": "自动索引",
        "description": "MCP 会话连接时为项目建立索引。"
    },
    "auto_index_limit": {
        sourceDescription: "Maximum discovered files for automatic indexing of a new project.",
        "label": "自动索引文件数上限",
        "description": "新项目自动索引时允许发现的最大文件数。"
    },
    "auto_watch": {
        sourceDescription: "Register a background Git watcher when an MCP session connects.",
        "label": "自动监视文件变更",
        "description": "MCP 会话连接时注册后台 Git 文件监视器。"
    },
    "doc_candidates": {
        sourceDescription: "Score documentation sections against code for doc-code candidates. Automatic: on for full indexes, off for moderate and fast; on or off applies to every mode. Costly on very large repositories; off stores none.",
        "label": "文档与代码的候选关联",
        "description": "比较文档段落与代码，生成候选关联。自动模式仅在完整索引时启用，中等和快速模式下关闭。显式开关适用于所有模式。大型仓库启用时开销较高，关闭后不会存储候选关联。"
    },
    "watcher_enabled": {
        sourceDescription: "Enable the daemon's background watcher thread.",
        "label": "后台文件监视",
        "description": "启用后台服务的文件监视线程。"
    },
    "ui-lang": {
        sourceDescription: "Language preference used by subsequent HTTP requests.",
        "label": "界面语言",
        "description": "后续 HTTP 请求使用的界面语言偏好。"
    },
    "ui_enabled": {
        sourceDescription: "Enable the loopback HTTP interface. Without a legacy config file, a build with embedded assets enables it automatically.",
        "label": "HTTP 界面",
        "description": "启用本地回环 HTTP 界面。如果没有旧版配置文件，包含界面资源的构建会自动启用它。"
    },
    "ui_port": {
        sourceDescription: "Loopback listener port. The running listener remains on its current port until restart.",
        "label": "HTTP 端口",
        "description": "本地回环监听端口。更改后将在后台服务重启时生效。"
    },
    "CBM_MAX_FILE_BYTES": {
        sourceDescription: "Skip files larger than this limit.",
        "label": "单文件大小上限（字节）",
        "description": "跳过大于此限制的文件。"
    },
    "CBM_CYPHER_MAX_DEPTH": {
        sourceDescription: "Maximum variable-length Cypher traversal depth.",
        "label": "查询遍历深度",
        "description": "Cypher 变长路径遍历的最大深度。"
    },
    "CBM_MCP_MAX_DEPTH": {
        sourceDescription: "Maximum MCP graph traversal depth.",
        "label": "MCP 遍历深度",
        "description": "MCP 图遍历的最大深度。"
    },
    "CBM_WORKERS": {
        sourceDescription: "Automatic uses available CPU cores and foreground/background policy. Supervisor recovery can still force a single worker.",
        "label": "索引工作进程数",
        "description": "自动模式按可用 CPU 核心及前后台策略分配工作进程。监督进程执行故障恢复时仍可能强制使用单个工作进程。"
    },
    "CBM_MEM_BUDGET_MB": {
        sourceDescription: "Automatic uses a RAM-dependent fraction; the result remains capped by physical RAM and the daemon hard limit.",
        "label": "内存预算（MiB）",
        "description": "自动模式按物理内存容量确定可用比例，最终仍受物理内存和后台服务硬上限约束。"
    },
    "CBM_SQLITE_MMAP_SIZE": {
        sourceDescription: "Memory mapping limit for new database connections; zero disables mapping.",
        "label": "SQLite 内存映射大小（字节）",
        "description": "新数据库连接使用的内存映射上限。设为 0 表示禁用映射。"
    },
    "CBM_RETAIN_TOTAL_MB": {
        sourceDescription: "Automatic is the smaller of one eighth of the memory budget and 1024 MiB. Explicit indexing options retain precedence.",
        "label": "提取数据总保留预算（MiB）",
        "description": "自动值取内存预算的八分之一和 1024 MiB 中的较小值。显式指定的索引选项优先。"
    },
    "CBM_RETAIN_PER_FILE_MB": {
        sourceDescription: "Automatic is the smaller of 32 MiB and the total retention budget. Explicit indexing options retain precedence.",
        "label": "每个文件的数据保留预算（MiB）",
        "description": "自动值取 32 MiB 和总保留预算中的较小值。显式指定的索引选项优先。"
    },
    "CBM_SEMANTIC_ENABLED": {
        sourceDescription: "Enable optional semantic embedding generation.",
        "label": "语义索引",
        "description": "启用可选的语义向量生成。"
    },
    "CBM_SEMANTIC_THRESHOLD": {
        sourceDescription: "Minimum similarity score, greater than zero and at most one.",
        "label": "语义相似度阈值",
        "description": "最低相似度分数，取值大于 0 且不超过 1。"
    },
    "CBM_DUMP_VERIFY_MIN_RATIO": {
        sourceDescription: "Minimum ratio accepted when verifying an index dump.",
        "label": "索引转储校验比例",
        "description": "验证索引转储时接受的最低比例。"
    },
    "CBM_WATCHER_PRUNE_GRACE_S": {
        sourceDescription: "Grace period before removing stale watcher registrations.",
        "label": "移除失效监视项前的等待时间（秒）",
        "description": "移除失效的文件监视注册前的等待时间。"
    },
    "CBM_DISABLE_LSP_CROSS": {
        sourceDescription: "Disable cross-file LSP resolution. False masks an inherited presence flag, even if its inherited value is zero.",
        "label": "禁用跨文件解析",
        "description": "关闭跨文件 LSP 解析。设为 false 可屏蔽继承的标志，即使继承值为 0。"
    },
    "CBM_TS_TYPE_BUDGET": {
        sourceDescription: "Automatic is 1,000,000 plus 64 times source length; zero means unlimited.",
        "label": "TypeScript 解析器预算",
        "description": "自动值为 1,000,000 加上源码长度的 64 倍。设为 0 表示不设上限。"
    },
    "CBM_LSP_MAX_WALK_DEPTH": {
        sourceDescription: "Maximum recursive resolver walk depth.",
        "label": "解析器遍历深度",
        "description": "解析器递归遍历的最大深度。"
    },
    "CBM_INDEX_MAX_RESTARTS": {
        sourceDescription: "Maximum worker restarts. Values start at one to preserve the daemon and MCP consumers' shared behavior.",
        "label": "索引工作进程重启上限",
        "description": "工作进程允许重启的最大次数。最小值为 1，与后台服务及 MCP 客户端的既有行为一致。"
    },
    "CBM_INDEX_WORKER_TIMEOUT_S": {
        sourceDescription: "Terminate an index worker that has not reported progress within this period.",
        "label": "索引无进展超时（秒）",
        "description": "如果索引工作进程在此时限内没有报告进展，则将其终止。"
    },
    "CBM_STARTUP_TIMEOUT_MS": {
        sourceDescription: "Time allowed for daemon startup.",
        "label": "启动超时（毫秒）",
        "description": "允许后台服务完成启动的最长时间。"
    },
    "CBM_HOOK_DEADLINE_MS": {
        sourceDescription: "POSIX hook processing deadline; unavailable on Windows.",
        "label": "钩子处理时限（毫秒）",
        "description": "POSIX 钩子处理的时限。Windows 上不提供此功能。"
    },
    "CBM_UI_MAX_RENDER_NODES": {
        sourceDescription: "Maximum nodes the layout backend may return; frontend render budgets remain separate.",
        "label": "图布局节点数上限",
        "description": "布局后端最多可返回的节点数。前端渲染有单独的资源限制。"
    },
    "CBM_UI_LOG_ROTATE_BYTES": {
        sourceDescription: "Rotate the frontend compatibility log after this size.",
        "label": "前端日志轮转阈值（字节）",
        "description": "前端兼容性日志达到此大小后轮转。"
    },
    "CBM_LOG_LEVEL": {
        sourceDescription: "Daemon log level. Explicit command flags and required worker progress records retain their process-specific policies.",
        "label": "日志级别",
        "description": "后台服务的日志级别。显式启动参数和必需的索引进度日志仍遵循各自进程的策略。"
    },
    "CBM_LOG_FORMAT": {
        sourceDescription: "Choose plain text or structured JSON log records.",
        "label": "日志格式",
        "description": "选择纯文本或结构化 JSON 日志格式。"
    },
    "CBM_PROFILE": {
        sourceDescription: "Enable performance profiling; the explicit --profile launch flag also enables it.",
        "label": "性能分析",
        "description": "启用性能分析。启动时显式指定 --profile 也会启用。"
    },
    "CBM_DIAGNOSTICS": {
        sourceDescription: "Enable runtime diagnostics.",
        "label": "诊断",
        "description": "启用运行时诊断。"
    },
    "CBM_MEM_STATS": {
        sourceDescription: "Emit memory statistics in diagnostics.",
        "label": "内存统计",
        "description": "在诊断信息中输出内存统计。"
    },
    "CBM_MEM_PROFILE": {
        sourceDescription: "This profiler is not compiled into the shipped application; setting it has no effect in this build.",
        "label": "内存分析",
        "description": "此构建未包含该分析器，设置此项不会生效。"
    },
    "CBM_MEM_PROFILE_MIN": {
        sourceDescription: "This profiler is not compiled into the shipped application; setting it has no effect in this build.",
        "label": "内存分析最小字节数",
        "description": "此构建未包含该分析器，设置此项不会生效。"
    },
    "CBM_MEM_PHASES": {
        sourceDescription: "Emit indexing memory phase measurements.",
        "label": "索引阶段内存诊断",
        "description": "输出索引各阶段的内存测量值。"
    },
    "CBM_MEM_CENSUS": {
        sourceDescription: "Enable allocation census diagnostics; primarily useful on Windows.",
        "label": "内存分配统计",
        "description": "启用内存分配统计诊断，主要用于 Windows。"
    },
    "CBM_MI_THREAD_DONE": {
        sourceDescription: "Windows allocator thread cleanup; other platforms do not use this switch.",
        "label": "分配器线程清理",
        "description": "清理 Windows 内存分配器的线程资源。其他平台不使用此开关。"
    },
    "CBM_CACHE_DIR": {
        sourceDescription: "Bootstrap location of indexes and this configuration database. Change the launch environment, then restart.",
        "label": "缓存目录",
        "description": "索引和配置数据库的启动目录。在启动环境中修改后需重启。"
    },
    "CBM_RUNTIME_DIR": {
        sourceDescription: "Bootstrap location of local daemon coordination. Configure in the launch environment.",
        "label": "运行时目录",
        "description": "本地后台服务的协调目录。在启动环境中设置。"
    },
    "CBM_ALLOWED_ROOT": {
        sourceDescription: "Launch-time filesystem boundary. The Config dialog cannot widen permissions.",
        "label": "允许访问的根目录",
        "description": "启动时确定的文件系统访问范围。配置界面不能扩大访问权限。"
    },
    "CBM_INDEX_SUPERVISOR": {
        sourceDescription: "Process isolation is a safety boundary; disabling it is refused on physical hosts.",
        "label": "索引监督进程",
        "description": "进程隔离用于保护运行环境，在物理主机上无法禁用。"
    },
    "CBM_HOOK_TIMEOUT_LOG": {
        sourceDescription: "Launch-time diagnostic output path. Arbitrary write destinations are not editable here.",
        "label": "钩子超时日志路径",
        "description": "启动时设置的诊断输出路径。此界面不支持任意修改写入位置。"
    },
    "CBM_INDEX_LOG": {
        sourceDescription: "Launch-time diagnostic output path; automatic uses the project and current time.",
        "label": "索引工作进程日志路径",
        "description": "启动时设置的诊断输出路径。自动模式使用项目名和当前时间。"
    },
    "CBM_MEM_STATS_OUT": {
        sourceDescription: "Launch-time diagnostic output path. Arbitrary write destinations are not editable here.",
        "label": "内存统计输出路径",
        "description": "启动时设置的诊断输出路径。此界面不支持任意修改写入位置。"
    },
    "CBM_LSP_DISABLED": {
        sourceDescription: "Diagnostic resolver bypass, configured explicitly at launch.",
        "label": "禁用解析器诊断",
        "description": "在启动时显式配置的解析器诊断旁路。"
    },
    "CBM_LSP_DEBUG": {
        sourceDescription: "Diagnostic output may expose source information; configured explicitly at launch.",
        "label": "解析器调试输出",
        "description": "诊断输出可能包含源码信息，此项需在启动时显式设置。"
    },
    "CBM_LSP_KOTLIN_AST": {
        sourceDescription: "Source-dumping diagnostic, configured explicitly at launch.",
        "label": "Kotlin 语法树转储",
        "description": "输出源码的诊断选项，需在启动时显式配置。"
    }
};

// Keep an unknown backend reason verbatim instead of replacing it with a generic explanation.
const reasons: Record<string, string> = {
    "POSIX hook processing deadline; unavailable on Windows.": "POSIX 钩子处理的时限。Windows 上不提供此功能。",
    "This profiler is not compiled into the shipped application; setting it has no effect in this build.": "此构建未包含该分析器，设置此项不会生效。",
    "Bootstrap location of indexes and this configuration database. Change the launch environment, then restart.": "索引和配置数据库的启动目录。在启动环境中修改后需重启。",
    "Bootstrap location of local daemon coordination. Configure in the launch environment.": "本地后台服务的协调目录。在启动环境中设置。",
    "Launch-time filesystem boundary. The Config dialog cannot widen permissions.": "启动时确定的文件系统访问范围。配置界面不能扩大访问权限。",
    "Process isolation is a safety boundary; disabling it is refused on physical hosts.": "进程隔离用于保护运行环境，在物理主机上无法禁用。",
    "Launch-time diagnostic output path. Arbitrary write destinations are not editable here.": "启动时设置的诊断输出路径。此界面不支持任意修改写入位置。",
    "Launch-time diagnostic output path; automatic uses the project and current time.": "启动时设置的诊断输出路径。自动模式使用项目名和当前时间。",
    "Diagnostic resolver bypass, configured explicitly at launch.": "在启动时显式配置的解析器诊断旁路。",
    "Diagnostic output may expose source information; configured explicitly at launch.": "诊断输出可能包含源码信息，此项需在启动时显式设置。",
    "Source-dumping diagnostic, configured explicitly at launch.": "输出源码的诊断选项，需在启动时显式配置。"
};

export function localizedSetting(setting: ConfigSetting, language: UiLanguage) {
    return language === 'en' ? setting : {
        ...setting,
        label: Object.hasOwn(zh, setting.key) ? zh[setting.key]!.label : setting.label,
        description: Object.hasOwn(zh, setting.key) && zh[setting.key]!.sourceDescription === setting.description
            ? zh[setting.key]!.description : setting.description,
        readOnlyReason: setting.readOnlyReason && Object.hasOwn(reasons, setting.readOnlyReason)
            ? reasons[setting.readOnlyReason] : setting.readOnlyReason,
    };
}

const labels: Record<string, string> = {
    indexing: '索引', server: '服务', resources: '资源', diagnostics: '诊断',
    browser: '浏览器', reference: '外部配置', default: '默认值', environment: '环境变量',
    'saved override': '已保存的覆盖值', 'legacy config / default': '旧版配置或默认值', override: '已保存的覆盖值', saved: '已保存的配置', config: '配置文件', cli: '命令行',
};
export function configurationLabel(value: string, language: UiLanguage): string {
    const key = value.toLowerCase();
    return language === 'zh' && Object.hasOwn(labels, key) ? labels[key]!
        : value.replace(/[_-]/g, ' ').replace(/^./, char => char.toUpperCase());
}

export function languageOption(value: string, language: UiLanguage): string {
    if (language === 'en') return value;
    const options: Record<string, string> = { auto: '自动', en: '英语', zh: '简体中文' };
    return Object.hasOwn(options, value) ? options[value]! : value;
}
