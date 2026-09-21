export interface GalleryImage {
  id: string;
  label: string;
}

const BASE = "https://lh3.googleusercontent.com/d/";

export function driveUrl(id: string) {
  return `${BASE}${id}`;
}

export const galleryImages: GalleryImage[] = [
  // Houston Astros
  { id: "19sRxrnpDGmIceg5W3f92mW5B4HD7crde", label: "Houston Astros Sequin Jersey" },
  { id: "1Op1yS4ctHM5Qr-4mXkH3L0agsH6To14q", label: "Houston Astros Sequin Jersey" },
  { id: "1G9Qcv3OgOpH8gCdNh5ONoXViWwqmTgAe", label: "Houston Astros Sequin Jersey" },
  { id: "12Cg7-e1bgw0giCmgp_3dw072kZ-iTAPy", label: "Houston Astros Glitter Top" },
  { id: "1AwZazv6erMeM1xUjoDwkMF8hxvATdAS4", label: "Houston Astros Glitter Top" },
  { id: "12DW9A4H6nKg5pzo-IPtOW4mFRNxLRHoB", label: "Houston Astros Sequin Jersey" },
  { id: "1ueNg4Gqzl5-QVvi7tDQbr6EgohAhk-gz", label: "Houston Astros Sequin Jersey" },
  { id: "1pDgjPxiIXhutffJnT1aZmOqNUfdkUOEB", label: "Houston Astros Sequin Jersey" },
  { id: "18e7iAz9EN59hTcbKlRK37EeiC3i-zZqT", label: "Houston Astros H-Town Jersey" },
  { id: "1ufEMi2cJsB6cVq9T7TTdtZJ8JdSPKN33", label: "Houston Astros H-Town Jersey" },
  { id: "1imil1YpbxjACoEr702MGkytBA2bS2Rwj", label: "Houston Astros Sequin Top" },
  { id: "1q9w5vHwiwClrR19-xAG7pv8IhWN5Yt-7", label: "Houston Astros Sequin Top" },
  { id: "14KZoLT27aJj7D6dFPxqBb2r4p_xCJ6O9", label: "Houston Astros Sequin Jersey" },
  { id: "15VvP0_RBGwxhPCV2BNoA6ZAE5cQyBWoU", label: "Houston Astros Glitter Top" },
  { id: "1XF7xAuMuf43arEhGMPyI0gKAH3COSCsu", label: "Houston Astros Sequin Top" },
  { id: "1gzV24Vl_CMSjwan_Jq3zUrWIyHMTPc_w", label: "Houston Astros Sequin Jersey" },
  { id: "1kDUldGLaXkDbEr9uMbYTO152hJ5wg-rY", label: "Houston Astros Sequin Top" },
  { id: "1kQpgMC2hMmsH-iuHk7Urv7gJ47Iq4Vbt", label: "Houston Astros Glitter Top" },
  { id: "1HSX8RAfUkY3gDdJz2e-8XwveLRcAoMsq", label: "Houston Astros Sequin Jersey" },
  // Houston Rockets
  { id: "1DugKhPoJjtSXZ3mOMrEPUUx7GQIQ2qJo", label: "Houston Rockets Sequin Jersey" },
  { id: "1TVnhLinsJTLLgrUPRFbi7LoZiJNHlaPr", label: "Houston Rockets Glitter Top" },
  { id: "1-Xr26S43CwQ1_-tU3ZNiNY0QzKBrGcFq", label: "Houston Rockets Sequin Jersey" },
  { id: "1HrBrSzJp79bLadCl2SBLu7TDSkAy09EH", label: "Houston Rockets Sequin Jersey" },
  { id: "1xUMeFoWRECBjwUyUev6FIMkkNxzB26tg", label: "Houston Rockets Sequin Jersey" },
  { id: "1nhh_cBktHf-x7GTKatzZSvl682HIoIoA", label: "Houston Rockets Sequin Jersey" },
  { id: "1cQLU1kYRi0thtlZsloehY-PKoxl5BU5q", label: "Houston Rockets Sequin Jersey" },
  { id: "1xBaRMDeqXow8pKiNmj-D1fFINvWnTWru", label: "Houston Rockets Glitter Top" },
  // San Antonio Spurs
  { id: "1YqjflFi8cISwm7lG21Bu8hQfNPkOlr3A", label: "San Antonio Spurs Sequin Jersey" },
  { id: "1QMrz_VDEhPZzFuidK2Li-VBdshU5Yj8H", label: "San Antonio Spurs Sequin Jersey" },
  { id: "1szOjR-wCn52L-RfEAYJpejhBSnGdqM4v", label: "San Antonio Spurs Glitter Top" },
  { id: "1EOdHg_8D1_aQT1vgUAf9gqScCREftZWI", label: "San Antonio Spurs Glitter Top" },
  { id: "1DTejWfv6MlDQUVy_NkkSPf2P6qyK-ia2", label: "San Antonio Spurs Glitter Top" },
  // Other sequin styles
  { id: "1LQz_r0ycPtHJwqvNt5wLWJMDyD005YdY", label: "Sequin Game Day Jersey" },
  { id: "19x2OiHz0-nbdRuaLLCedZix3rwwI6WXb", label: "Sequin Game Day Top" },
  { id: "1qVidSpA99JZAH0TDOxGL4g3Ua6afV--N", label: "Game Day Jersey" },
];
