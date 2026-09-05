import QRCode from "qrcode";

/**
 * Lien officiel "Add to Profile" LinkedIn pour les certifications — format
 * confirmé (utilisé par Credly, Coursera, Microsoft Learn, etc.) :
 * linkedin.com/help/linkedin/answer/a528030
 */
export function buildLinkedInAddUrl(params: {
  certificationName: string;
  organizationName: string;
  issuedAt: Date;
  certUrl: string;
  certId: string;
}) {
  const search = new URLSearchParams({
    startTask: "CERTIFICATION_NAME",
    name: params.certificationName,
    organizationName: params.organizationName,
    issueYear: String(params.issuedAt.getFullYear()),
    issueMonth: String(params.issuedAt.getMonth() + 1),
    certUrl: params.certUrl,
    certId: params.certId,
  });
  return `https://www.linkedin.com/profile/add?${search.toString()}`;
}

export function buildShareUrls(certUrl: string, title: string) {
  const encodedUrl = encodeURIComponent(certUrl);
  const encodedText = encodeURIComponent(title);
  return {
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  };
}

/** SVG du QR code, prêt à injecter en `dangerouslySetInnerHTML` — pas d'appel réseau. */
export async function generateQrSvg(url: string): Promise<string> {
  return QRCode.toString(url, {
    type: "svg",
    margin: 0,
    color: { dark: "#14152b", light: "#0000" },
  });
}
