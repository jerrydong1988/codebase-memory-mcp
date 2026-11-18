import { useSettingsText } from './settings-strings';
/** Source-audited inputs whose owner is outside the running daemon. */
export default function ConfigReference() {
    const text = useSettingsText();
    const externalInputs = [
        { title: text.projectDiscovery, timing: text.nextIndex, description: text.repositoryConfig, items: [
            ['.codebase-memory.json', text.extensionMap],
            ['.cbmignore', text.ignoreRules],
            [text.gitPatterns, text.gitIgnore],
        ] },
        { title: text.globalMappings, timing: text.nextIndex, description: text.mappingDescription, items: [
            ['$XDG_CONFIG_HOME/codebase-memory-mcp/config.json', text.extensionFallback],
        ] },
        { title: text.launchAccess, timing: text.launchTiming, description: text.accessDescription, items: [
            ['CBM_CACHE_DIR · CBM_RUNTIME_DIR', text.directorySelection],
            ['--tool-profile=analysis|scout', text.toolProfile],
            ['allow-root · .cbmpathwhitelist · approved_manifests', text.authorization],
            ['cli --quiet · --progress · --verbose · --json', text.cliDisplay],
            ['--profile', text.profileDescription],
        ] },
        { title: text.installation, timing: text.installationTiming, description: text.installationDescription, items: [
            ['install --dir · --clients · --skip-config · --skip-binary', text.installationTargets],
            ['CBM_DOWNLOAD_URL', text.downloadSource],
            ['CLAUDE_CONFIG_DIR · CODEX_HOME · KIRO_HOME · HERMES_HOME · QWEN_HOME · CLINE_DATA_DIR', text.agentLocations],
            ['OPENCLAW_HOME · OPENCLAW_STATE_DIR · OPENCLAW_PROFILE · OPENCLAW_CONFIG_PATH · OPENCLAW_WORKSPACE_DIR', text.openclawTargets],
            ['OPENCODE_CONFIG · OPENCODE_CONFIG_DIR · COPILOT_HOME · CRUSH_GLOBAL_CONFIG · VIBE_HOME · GROK_HOME', text.otherLocations],
            ['OMP_PROFILE · PI_CODING_AGENT_DIR · GLAB_CONFIG_DIR · KIMI_CODE_HOME', text.extraDiscovery],
            ['CBM_CONTINUE_CONFIG_PATH · CBM_TRAE_CONFIG_PATH · CBM_ROO_CONFIG_PATH · CBM_CODY_CONFIG_PATH', text.editorTargets],
            ['HOME · USERPROFILE · APPDATA · LOCALAPPDATA · XDG_CONFIG_HOME · XDG_CACHE_HOME · PATH · SHELL · COMSPEC · TEMP · TMP · TMPDIR', text.osLocations],
        ] },
        { title: text.browserControls, timing: text.thisBrowser, description: text.browserDescription, items: [
            ['workspace · project', text.urlPrecedence],
            ['codeatlasClosureDepth · codeatlasClosureCap', text.hierarchyDefaults],
            [text.panelNames, text.panelPreferences],
            ['VITE_EXPERIMENTAL_AGENTS', text.experimentalAgents],
        ] },
        { title: text.externalHooks, timing: text.externalProcess, description: text.externalDescription, items: [
            ['ATLAS_TRACE_FILE · ATLAS_DAEMON_URL · ATLAS_PROJECT · ATLAS_AGENT_NAME', text.hookDescription],
            ['ATLAS_MODELS_DIR · LLAMA_CACHE · ATLAS_MODELS_MAX · ATLAS_MODEL · ATLAS_CTX', text.sidecarLaunch],
            ['.codeatlas/policy.json · atlas-llm · atlas-model', text.sidecarPreferences],
        ] },
        { title: text.development, timing: text.developmentTiming, description: text.developmentDescription, items: [
            [text.compilerOptions, text.buildMachine],
            ['CBM_THREAD_STACK_MB · CBM_FUZZ_SEED · CBM_COMPOSITION_FIXTURE · CBM_SMOKE_ARTIFACT_DIR · CBM_CHECK_UI_ABSENT', text.sanitizerInputs],
            [text.workerFiles, text.recoveryInputs],
        ] },
    ] as const;

    return <div className="cbm-config-reference"><p>{text.referenceDescription}</p>
        {externalInputs.map(group => <details key={group.title}><summary>{group.title}<span>{group.timing}</span></summary><p>{group.description}</p><dl>{group.items.map(([name, description]) => <div key={name}><dt>{name}</dt><dd>{description}</dd></div>)}</dl></details>)}
    </div>;
}
