import { useEffect, useRef, useState } from 'react';
import {
  canCopyImage,
  canShareFiles,
  copyCardToClipboard,
  downloadCard,
  shareCard,
} from '../lib/exportCard';

type Action = 'download' | 'copy' | 'share';

const LABELS: Record<Action, string> = {
  download: '⬇️ 下載 PNG',
  copy: '📋 複製圖片',
  share: '📤 分享',
};

const DONE_MESSAGES: Record<Action, string> = {
  download: '已下載！貼到 X / Slack / Discord 炫耀吧 🎉',
  copy: '已複製到剪貼簿！直接 ⌘V 貼出去 🎉',
  share: '分享出去了 🎉',
};

export function ExportBar({ getNode, login }: { getNode: () => HTMLElement | null; login: string }) {
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
      if (action === 'download') await downloadCard(node, login);
      if (action === 'copy') await copyCardToClipboard(node);
      if (action === 'share') await shareCard(node, login);
      flash(DONE_MESSAGES[action]);
    } catch (err) {
      // Closing the share sheet is not an error worth yelling about.
      if (err instanceof DOMException && err.name === 'AbortError') return;
      flash('匯出失敗了 😵 再試一次？');
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <div className="card-actions">
        <button className="btn" onClick={() => run('download')} disabled={busy !== null}>
          {busy === 'download' ? '產圖中…' : LABELS.download}
        </button>
        {canCopyImage() && (
          <button className="btn btn-ghost" onClick={() => run('copy')} disabled={busy !== null}>
            {busy === 'copy' ? '產圖中…' : LABELS.copy}
          </button>
        )}
        {canShareFiles() && (
          <button className="btn btn-ghost" onClick={() => run('share')} disabled={busy !== null}>
            {busy === 'share' ? '產圖中…' : LABELS.share}
          </button>
        )}
      </div>
      <p className="card-hint" role="status">
        {message ?? '產生 PNG 後貼到 X / Slack / Discord，就是你的年度戰績。'}
      </p>
    </>
  );
}
