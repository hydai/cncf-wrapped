import { getFontEmbedCSS, toPng } from 'html-to-image';
import { CARD_HEIGHT, CARD_WIDTH } from '../components/WrappedCard';

export const EXPORT_PIXEL_RATIO = 2; // 480x640 -> 960x1280 PNG

export function exportFileName(login: string): string {
  return `cncf-wrapped-${login}.png`;
}

// Safari's foreignObject rendering sometimes misses fonts/images on the first
// pass; rendering twice and keeping the second result is the standard fix.
const needsDoubleRender = /^((?!chrome|android).)*safari/i.test(
  typeof navigator === 'undefined' ? '' : navigator.userAgent,
);

// Embedding font CSS walks every @font-face rule (Noto Sans TC has hundreds of
// unicode-range subsets), so compute it once and reuse it for every export.
let fontCssPromise: Promise<string> | null = null;

async function renderPng(node: HTMLElement): Promise<string> {
  fontCssPromise ??= getFontEmbedCSS(node);
  let fontEmbedCSS: string;
  try {
    fontEmbedCSS = await fontCssPromise;
  } catch (err) {
    fontCssPromise = null;
    throw err;
  }

  const options = {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    pixelRatio: EXPORT_PIXEL_RATIO,
    fontEmbedCSS,
  };
  if (needsDoubleRender) await toPng(node, options);
  return toPng(node, options);
}

export async function cardToPngDataUrl(node: HTMLElement): Promise<string> {
  return renderPng(node);
}

export async function cardToPngBlob(node: HTMLElement): Promise<Blob> {
  const dataUrl = await renderPng(node);
  const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1);
  const bytes = atob(base64);
  const buf = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) buf[i] = bytes.charCodeAt(i);
  return new Blob([buf], { type: 'image/png' });
}

export async function downloadCard(node: HTMLElement, login: string): Promise<void> {
  const dataUrl = await cardToPngDataUrl(node);
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = exportFileName(login);
  a.click();
}

export function canCopyImage(): boolean {
  return (
    typeof ClipboardItem !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    !!navigator.clipboard &&
    typeof navigator.clipboard.write === 'function'
  );
}

export async function copyCardToClipboard(node: HTMLElement): Promise<void> {
  // Hand ClipboardItem a promise so it is created synchronously inside the
  // user gesture — required by Safari.
  const item = new ClipboardItem({ 'image/png': cardToPngBlob(node) });
  await navigator.clipboard.write([item]);
}

export function canShareFiles(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    typeof navigator.share === 'function' &&
    typeof navigator.canShare === 'function'
  );
}

export async function shareCard(node: HTMLElement, login: string): Promise<void> {
  const blob = await cardToPngBlob(node);
  const file = new File([blob], exportFileName(login), { type: 'image/png' });
  if (!navigator.canShare({ files: [file] })) {
    throw new Error('sharing files is not supported here');
  }
  await navigator.share({
    files: [file],
    title: 'CNCF Wrapped',
    text: `我的 CNCF Wrapped：@${login}`,
  });
}
