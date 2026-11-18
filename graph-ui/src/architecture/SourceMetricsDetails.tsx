import { featureCopy } from '../i18n/features/architecture';
import type { SourceCatalog, SourceMeasure } from './source-metrics';

export default function SourceMetricsDetails({ measure, catalog }: { measure: SourceMeasure; catalog: SourceCatalog }) {
    const share = measure.lines !== undefined && catalog.total.lines ? Math.min(100, measure.lines / catalog.total.lines * 100) : undefined;
    const denominator = measure.lines || measure.files || 1;
    return <div className="spatial-source-metrics" aria-label={featureCopy.Source_size_and_languages_e3d9d8b}>
        <div className="spatial-source-total"><strong>{measure.lines === undefined ? featureCopy.Unknown_bc7819b : `${measure.measuredFiles < measure.files ? '≥ ' : ''}${measure.lines.toLocaleString()}`}</strong><span>{featureCopy.indexed_source_lines_fb447a4}</span></div>
        <small>{featureCopy.Includes_comments_and_blank_lines_Each_measured_file_counts_once_10abfb4}</small>
        {share !== undefined && <div className="spatial-source-share"><span>{share.toFixed(1)}{featureCopy.of_measured_project_lines_63c8283}</span><div role="meter" aria-label={featureCopy.Share_of_measured_project_lines_bdaee60} aria-valuenow={share} aria-valuemin={0} aria-valuemax={100}><i style={{ width: `${share}%` }} /></div></div>}
        <small>{measure.measuredFiles} / {measure.files}{featureCopy.files_measured_d776ef0}{measure.measuredFiles < measure.files ? featureCopy.remaining_sizes_unknown_d693201 : ''}</small>
        <h4>{featureCopy.Language_mix_d1b0131}<span>· {measure.lines ? featureCopy.measured_lines_88ef737 : featureCopy.files_a1f13b3}</span></h4>
        <div className="spatial-language-bar" aria-hidden="true">{measure.languages.map(language => <i key={language.name} style={{ background: language.color, flex: measure.lines ? language.lines : language.files }} />)}</div>
        <ul className="spatial-language-breakdown">{measure.languages.map(language => <li key={language.name}><i style={{ background: language.color }} /><span>{language.name}</span><span>{((measure.lines ? language.lines : language.files) / denominator * 100).toFixed(1)}%</span></li>)}</ul>
        <small>{featureCopy.Language_inferred_from_file_type_A_mixed_file_may_contain_other_l_be756dc}</small>
    </div>;
}
