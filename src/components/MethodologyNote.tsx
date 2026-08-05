import { useI18n } from '../i18n/context';

/**
 * Collapsed-by-default explainer under the card. Lives outside the PNG
 * export node (the export ref targets .wrap-card only), so it never
 * appears in exported images.
 */
export function MethodologyNote() {
  const { t } = useI18n();
  return (
    <details className="method">
      <summary>{t.methodTitle}</summary>
      <dl className="method-list">
        {t.methodItems.map(({ term, body }) => (
          <div className="method-item" key={term}>
            <dt>{term}</dt>
            <dd>{body}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}
