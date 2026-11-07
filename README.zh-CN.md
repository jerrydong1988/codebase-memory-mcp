# Codebase Memory 简体中文社区分支

本分支基于 [DeusData/codebase-memory-mcp 的 v0.12.1](https://github.com/DeusData/codebase-memory-mcp/releases/tag/v0.12.1)，为 CBM Lens 提供简体中文界面，由社区独立维护。翻译使用 AI 辅助，结合界面和代码语境校订，未经专业译者复核。

## 当前范围

欢迎页、工作区导航、搜索框提示、文件标签以及部分按钮和辅助功能标签已支持简体中文。工作区内部仍有英文内容。源码、文件路径、符号名及项目标识保留原文。

界面沿用后台的 `ui-lang` 设置。中文浏览器在自动模式下即可使用简体中文。也可以在使用本分支构建的程序上执行以下命令，随后刷新页面：

```shell
codebase-memory-mcp config set ui-lang zh
```

要恢复自动选择，请运行 `codebase-memory-mcp config set ui-lang auto`。开发与构建说明见 [前端 README](graph-ui/README.md)。上游安装脚本默认下载官方版本。

## 版本维护

- `main` 跟踪上游主分支，`zh-CN` 维护基于上游稳定标签的中文改动。
- 集成新稳定版时，先核对新增或变更的界面词条，再验证中英文显示、工作区导航和现有前端测试。发布说明应标注对应的上游版本。
- 反馈翻译问题时，请附上所在页面、当前文案和预期含义。截图中可以遮盖私人项目名和路径。

上游的中文化讨论见 [#553](https://github.com/DeusData/codebase-memory-mcp/issues/553) 和 [#1668](https://github.com/DeusData/codebase-memory-mcp/issues/1668)。
