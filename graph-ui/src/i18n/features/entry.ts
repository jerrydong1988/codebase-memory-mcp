import { localizedMessages } from '../feature-language';

// UI copy only. Runtime identifiers, source text and arguments retain their original values.
const en = {
    no_route_is_listed_the_index_reported_none_for_this_project_and_t_cab03c4: "no route is listed: the index reported none for this project, and this surface reads no source files of its own, so an unreported route cannot be recovered here",
};

const zh: typeof en = {
    no_route_is_listed_the_index_reported_none_for_this_project_and_t_cab03c4: "没有列出路由: 索引没有报告此项目的路由，而这个表面没有读取它自己的源文件，因此无法在此找到未报告的路由",
};

export const featureCopy = localizedMessages(en, zh);
