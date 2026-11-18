import { featureCopy } from '../../i18n/features/ui';
/** What every Refresh button of the app says after it ran (hand test 2026-10-04, A3, and its review, K42). */
export const refreshText = {
    unchanged: (time: string) => featureCopy.Up_to_date_at_0_no_changes_since_the_last_load_1ef1046(time),
    /** Without a reason when the view already shows the error in its own words beside the button. */
    failed: (time: string, error: string) => (error ? featureCopy.Refresh_failed_at_0_1_20ba519(time, error) : featureCopy.Refresh_failed_at_0_64f5c19(time)),
};
