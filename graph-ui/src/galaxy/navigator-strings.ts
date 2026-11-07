const en = {
    search: 'Galaxy exploration',
    find: 'Find a graph node',
    quickPlaceholder: 'Find node, file or folder…',
    placeholder: 'Symbol, file, or folder…',
    title: 'Find node or cluster',
    empty: 'No matching indexed nodes.',
    searching: 'Searching index…',
    top: 'Top matches · refine to narrow',
    unavailable: 'Index search unavailable · loaded matches shown',
    loaded: (count: number) => `${count.toLocaleString()} loaded nodes`,
    folder: 'Folder',
    file: 'File',
    indexedFile: 'Indexed file',
    indexedFolder: 'Indexed folder',
    symbol: 'Symbol',
};

const zh: typeof en = {
    search: '图谱搜索',
    find: '查找图谱节点',
    quickPlaceholder: '查找节点、文件或文件夹…',
    placeholder: '符号、文件或文件夹…',
    title: '查找节点或节点群',
    empty: '索引中没有匹配的节点。',
    searching: '正在搜索索引…',
    top: '显示最相关的匹配项，可输入更多文字缩小范围',
    unavailable: '索引搜索暂不可用，当前显示已加载的匹配项',
    loaded: count => `已加载 ${count.toLocaleString('zh-CN')} 个节点`,
    folder: '文件夹',
    file: '文件',
    indexedFile: '已索引的文件',
    indexedFolder: '已索引的文件夹',
    symbol: '符号',
};

export const navigatorStrings = { en, zh };
