import { featureCopy } from '../i18n/features/projects';
export const projectSwitcherStrings = {
    project: featureCopy.Project_f6f4da8,
    choose: featureCopy.Choose_project_9039b52,
    switchProject: (name: string) => featureCopy.Switch_project_0_43e4c5a(name),
    search: featureCopy.Find_a_project_bb1e1ac,
    searchPlaceholder: featureCopy.Search_projects_or_paths_02e1545,
    loading: featureCopy.Loading_projects_5a1c809,
    failed: featureCopy.Could_not_load_projects_52d2b82,
    empty: featureCopy.No_indexed_projects_yet_8573559,
    noMatches: featureCopy.No_matching_projects_1c668a8,
    current: featureCopy.Current_4fc0e2b,
    retry: featureCopy.Try_again_042c862,
    /** Review of K42: the Refresh button says that it runs, then when it ran (shared words in ui/refresh/strings.ts). */
    refreshFeedback: { idle: featureCopy.Refresh_projects_2888e92, busy: featureCopy.Refreshing_projects_fa611d7, done: (time: string) => featureCopy.Projects_refreshed_at_0_d57f211(time) },
    add: featureCopy.Add_project_index_9108ede,
    indexActivity: (status: 'indexing' | 'done' | 'error') => status === 'indexing' ? featureCopy.Indexing_1fd8094 : status === 'done' ? featureCopy.Index_ready_5207f2b : featureCopy.Index_needs_attention_0f56631,
};
