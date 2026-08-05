import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/context';
import {
  canCopyImage,
  canShareFiles,
  copyCardToClipboard,
  downloadCard,
  shareCard,
} from '../lib/exportCard';

type Action = 'download' | 'copy' | 'share';

export function ExportBar({ getNode, login }: { getNode: () => HTMLElement | null; login: string }) {
  const { t } = useI18n();
  const [busy, setBusy] = useState<Action | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const flash = (text: string) => {
    setMessage(text);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMessage(null), 3500);
  };

  const run = async (action: Action) => {
    const node = getNode();
    if (!node || busy) return;
    setBusy(action);
    try {
      if (action === 'download') {
        await downloadCard(node, login);
        flash(t.exportDoneDownload);
      }
      if (action === 'copy') {
        await copyCardToClipboard(node);
        flash(t.exportDoneCopy);
      }
      if (action === 'share') {
        await shareCard(node, login, t.shareText(login));
        flash(t.exportDoneShare);
      }
    } catch (err) {
      // Closing the share sheet is not an error worth yelling about.
      if (err instanceof DOMException && err.name === 'AbortError') return;
      flash(t.exportFailed);
    } finally {
      setBusy(null);
    }
  };

  const labels: Record<Action, string> = {
    download: t.exportDownload,
    copy: t.exportCopy,
    share: t.exportShare,
  };

  return (
    <>
      <div className="card-actions">
        <button className="btn" onClick={() => run('download')} disabled={busy !== null}>
          {busy === 'download' ? t.exportBusy : labels.download}
        </button>
        {canCopyImage() && (
          <button className="btn btn-ghost" onClick={() => run('copy')} disabled={busy !== null}>
            {busy === 'copy' ? t.exportBusy : labels.copy}
          </button>
        )}
        {canShareFiles() && (
          <button className="btn btn-ghost" onClick={() => run('share')} disabled={busy !== null}>
            {busy === 'share' ? t.exportBusy : labels.share}
          </button>
        )}
      </div>
      <p className="card-hint" role="status">
        {message ?? t.exportHint}
      </p>
    </>
  );
}
