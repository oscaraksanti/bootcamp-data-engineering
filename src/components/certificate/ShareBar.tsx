"use client";

import { useState } from "react";
import { toPng } from "html-to-image";

export function ShareBar({
  targetId,
  certUrl,
  linkedInUrl,
  shareUrls,
  fileName,
}: {
  targetId: string;
  certUrl: string;
  linkedInUrl: string;
  shareUrls: { whatsapp: string; x: string; facebook: string };
  fileName: string;
}) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(certUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleDownload() {
    const node = document.getElementById(targetId);
    if (!node) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(node, { pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = fileName;
      link.href = dataUrl;
      link.click();
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6 print:hidden">
      <a
        href={linkedInUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-semibold text-white bg-[#0a66c2] hover:opacity-90 rounded-lg px-4 py-2.5"
      >
        Ajouter à LinkedIn
      </a>
      <a
        href={shareUrls.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-semibold text-ink border border-line-strong rounded-lg px-4 py-2.5 hover:border-accent"
      >
        WhatsApp
      </a>
      <a
        href={shareUrls.x}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-semibold text-ink border border-line-strong rounded-lg px-4 py-2.5 hover:border-accent"
      >
        X
      </a>
      <a
        href={shareUrls.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-semibold text-ink border border-line-strong rounded-lg px-4 py-2.5 hover:border-accent"
      >
        Facebook
      </a>
      <button
        onClick={handleCopy}
        className="text-sm font-semibold text-ink border border-line-strong rounded-lg px-4 py-2.5 hover:border-accent"
      >
        {copied ? "Lien copié ✓" : "Copier le lien"}
      </button>
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="text-sm font-semibold text-white bg-accent hover:bg-accent-strong rounded-lg px-4 py-2.5 disabled:opacity-60"
      >
        {downloading ? "Génération…" : "Télécharger l'image"}
      </button>
    </div>
  );
}
