import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';

const OUT_DIR = resolve(process.cwd(), 'public/papers');
const W = 1280;
const H = 800;

/**
 * Shared studio backdrop: deep blurred navy-charcoal background, warm upper-left
 * directional key light, subtle warm gold rim highlight, and matte warm slate stone table
 * with procedural micro-grain so all 10 catalogue images share one unified studio session.
 */
function wrapStudioScene(innerSvg, accentGlow = '#C9A86A') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="bgWall" cx="32%" cy="24%" r="78%">
      <stop offset="0%" stop-color="#1E3354"/>
      <stop offset="48%" stop-color="#101B30"/>
      <stop offset="100%" stop-color="#080D1A"/>
    </radialGradient>
    <radialGradient id="keyLight" cx="22%" cy="14%" r="58%">
      <stop offset="0%" stop-color="#FFF4DC" stop-opacity="0.28"/>
      <stop offset="50%" stop-color="${accentGlow}" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="rimGlow" cx="76%" cy="38%" r="44%">
      <stop offset="0%" stop-color="${accentGlow}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="${accentGlow}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="stoneTable" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3C3B38"/>
      <stop offset="45%" stop-color="#2E2D2B"/>
      <stop offset="100%" stop-color="#1D1C1B"/>
    </linearGradient>
    <linearGradient id="tableHorizon" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#070B14" stop-opacity="0.82"/>
      <stop offset="22%" stop-color="#1A1918" stop-opacity="0"/>
      <stop offset="100%" stop-color="#090909" stop-opacity="0.55"/>
    </linearGradient>
    <radialGradient id="contactShadow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#05070C" stop-opacity="0.78"/>
      <stop offset="62%" stop-color="#080B12" stop-opacity="0.42"/>
      <stop offset="100%" stop-color="#080B12" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F6E3BA" stop-opacity="0.7"/>
      <stop offset="50%" stop-color="#C9A86A" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.1"/>
    </linearGradient>
    <filter id="dropShadow" x="-20%" y="-20%" width="150%" height="150%">
      <feDropShadow dx="14" dy="22" stdDeviation="16" flood-color="#050811" flood-opacity="0.58"/>
    </filter>
    <filter id="softShadow" x="-20%" y="-20%" width="150%" height="150%">
      <feDropShadow dx="6" dy="10" stdDeviation="8" flood-color="#050811" flood-opacity="0.42"/>
    </filter>
    <filter id="paperFiber" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="11" result="noise"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.85  0 0 0 0 0.82  0 0 0 0 0.76  0 0 0 0.055 0" in="noise" result="coloredNoise"/>
      <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="textured"/>
      <feBlend mode="multiply" in="SourceGraphic" in2="textured"/>
    </filter>
    <pattern id="reamEdges" width="8" height="6" patternUnits="userSpaceOnUse">
      <line x1="0" y1="1.5" x2="8" y2="1.5" stroke="#000000" stroke-opacity="0.13" stroke-width="0.9"/>
      <line x1="0" y1="3.5" x2="8" y2="3.5" stroke="#FFFFFF" stroke-opacity="0.28" stroke-width="0.8"/>
      <line x1="0" y1="5" x2="8" y2="5" stroke="#000000" stroke-opacity="0.09" stroke-width="0.7"/>
    </pattern>
    <pattern id="stoneSpeckle" width="120" height="120" patternUnits="userSpaceOnUse">
      <circle cx="18" cy="24" r="1.1" fill="#FFF8E8" fill-opacity="0.06"/>
      <circle cx="74" cy="52" r="1.4" fill="#000000" fill-opacity="0.16"/>
      <circle cx="96" cy="18" r="0.9" fill="#C9A86A" fill-opacity="0.08"/>
      <circle cx="42" cy="88" r="1.3" fill="#000000" fill-opacity="0.14"/>
      <circle cx="105" cy="94" r="1.1" fill="#FFF8E8" fill-opacity="0.05"/>
      <path d="M8 64 Q 54 58, 112 67" stroke="#FFFFFF" stroke-opacity="0.025" stroke-width="1.2" fill="none"/>
    </pattern>
  </defs>

  <!-- Studio Backdrop -->
  <rect width="${W}" height="${H}" fill="url(#bgWall)"/>
  <rect width="${W}" height="${H}" fill="url(#keyLight)"/>
  <rect width="${W}" height="${H}" fill="url(#rimGlow)"/>

  <!-- Matte Warm Slate / Travertine Stone Table -->
  <path d="M0 470 L${W} 445 L${W} ${H} L0 ${H} Z" fill="url(#stoneTable)"/>
  <path d="M0 470 L${W} 445 L${W} ${H} L0 ${H} Z" fill="url(#stoneSpeckle)"/>
  <path d="M0 470 L${W} 445 L${W} ${H} L0 ${H} Z" fill="url(#tableHorizon)"/>
  <line x1="0" y1="470" x2="${W}" y2="445" stroke="#C9A86A" stroke-opacity="0.22" stroke-width="1.5"/>

  <!-- Contact Shadow on Table -->
  <ellipse cx="640" cy="590" rx="430" ry="74" fill="url(#contactShadow)"/>

  ${innerSvg}
</svg>`;
}

/** Helper to draw an isometric 3D paper ream block with top, left-front, and right-front faces. */
function drawIsoBlock({
  cx,
  cy,
  w,
  d,
  h,
  topFill,
  leftEdgeFill,
  rightEdgeFill,
  stroke = '#EAE4D7',
  showReamLines = true,
}) {
  const top = [
    [cx, cy - d],
    [cx + w, cy - d * 0.15],
    [cx + w * 0.12, cy + d * 0.95],
    [cx - w * 0.88, cy + d * 0.1],
  ];
  const leftFace = [
    top[3],
    top[2],
    [top[2][0], top[2][1] + h],
    [top[3][0], top[3][1] + h],
  ];
  const rightFace = [
    top[2],
    top[1],
    [top[1][0], top[1][1] + h],
    [top[2][0], top[2][1] + h],
  ];
  const pts = (arr) => arr.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

  return `<g filter="url(#dropShadow)">
    <polygon points="${pts(leftFace)}" fill="${leftEdgeFill}"/>
    ${showReamLines ? `<polygon points="${pts(leftFace)}" fill="url(#reamEdges)"/>` : ''}
    <polygon points="${pts(rightFace)}" fill="${rightEdgeFill}"/>
    ${showReamLines ? `<polygon points="${pts(rightFace)}" fill="url(#reamEdges)"/>` : ''}
    <polygon points="${pts(top)}" fill="${topFill}" stroke="${stroke}" stroke-width="1.2"/>
  </g>`;
}

const SCENES = {
  // 1. Sticker Paper: glossy white stack + peeled top corner revealing blue glassine release liner & die-cut label matrix
  sticker: () =>
    wrapStudioScene(`
    <defs>
      <linearGradient id="glassineBlue" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#BFD9EE"/>
        <stop offset="55%" stop-color="#8EB7D9"/>
        <stop offset="100%" stop-color="#6997BE"/>
      </linearGradient>
      <linearGradient id="stickerGloss" x1="0%" y1="0%" x2="100%" y2="90%">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="42%" stop-color="#F7F9FB"/>
        <stop offset="56%" stop-color="#FFFFFF"/>
        <stop offset="100%" stop-color="#E4E9EF"/>
      </linearGradient>
      <linearGradient id="peelCurl" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="45%" stop-color="#EDEAE2"/>
        <stop offset="78%" stop-color="#C9A86A"/>
        <stop offset="100%" stop-color="#FAF8F5"/>
      </linearGradient>
    </defs>
    ${drawIsoBlock({
      cx: 650,
      cy: 430,
      w: 330,
      d: 145,
      h: 48,
      topFill: 'url(#glassineBlue)',
      leftEdgeFill: '#AFC7DC',
      rightEdgeFill: '#88A6C0',
      stroke: '#CBE0F2',
    })}
    <!-- Die-cut label grid lines on the release liner -->
    <g stroke="#5D87AC" stroke-opacity="0.45" stroke-width="1.2" fill="none">
      <line x1="485" y1="382" x2="825" y2="338"/>
      <line x1="435" y1="435" x2="778" y2="390"/>
    </g>
    <!-- Top glossy white adhesive sheet with peeled right corner -->
    <g filter="url(#softShadow)">
      <path d="M 650 285 L 910 375 C 845 395, 790 430, 755 495 L 689 567 L 360 444 Z" fill="url(#stickerGloss)" stroke="#FFFFFF" stroke-width="1.5"/>
      <!-- Curled peeled flap showing adhesive underside + gold rim highlight -->
      <path d="M 910 375 C 835 375, 765 425, 755 495 C 795 458, 868 432, 910 375 Z" fill="url(#peelCurl)" stroke="#F6E3BA" stroke-width="1.3"/>
      <!-- Glossy specular reflection streak -->
      <path d="M 470 395 L 635 318 L 710 344 L 545 426 Z" fill="#FFFFFF" fill-opacity="0.65"/>
    </g>
  `),

  // 2. Coloured Parchment: 4 pastel shades (butter yellow, sky blue, blush pink, pale mint green) neatly fanned
  parchment: () =>
    wrapStudioScene(`
    <defs>
      <linearGradient id="pGreen" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#D7EFE0"/><stop offset="100%" stop-color="#A8D5BA"/>
      </linearGradient>
      <linearGradient id="pPink" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F7D8DF"/><stop offset="100%" stop-color="#E4B0BC"/>
      </linearGradient>
      <linearGradient id="pBlue" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#CFE7F8"/><stop offset="100%" stop-color="#98C5E6"/>
      </linearGradient>
      <linearGradient id="pYellow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FAE9A8"/><stop offset="100%" stop-color="#E5C86B"/>
      </linearGradient>
    </defs>
    <g transform="translate(60,-10)">
      <g transform="rotate(-11 580 470)">
        ${drawIsoBlock({ cx: 560, cy: 455, w: 280, d: 125, h: 24, topFill: 'url(#pGreen)', leftEdgeFill: '#9ACAAD', rightEdgeFill: '#7FB394', stroke: '#E7F8EE' })}
      </g>
      <g transform="rotate(-4 580 450)">
        ${drawIsoBlock({ cx: 575, cy: 432, w: 280, d: 125, h: 24, topFill: 'url(#pPink)', leftEdgeFill: '#D9A0AE', rightEdgeFill: '#BF8493', stroke: '#FFE9EE' })}
      </g>
      <g transform="rotate(3 600 430)">
        ${drawIsoBlock({ cx: 590, cy: 408, w: 280, d: 125, h: 24, topFill: 'url(#pBlue)', leftEdgeFill: '#8AB8DB', rightEdgeFill: '#6E9EC3', stroke: '#E6F4FF' })}
      </g>
      <g transform="rotate(10 615 410)" filter="url(#paperFiber)">
        ${drawIsoBlock({ cx: 610, cy: 382, w: 280, d: 125, h: 26, topFill: 'url(#pYellow)', leftEdgeFill: '#D8BA5B', rightEdgeFill: '#BE9F43', stroke: '#FFF6D2' })}
      </g>
    </g>
  `),

  // 3. Bristol Board: thick heavyweight cream-white cardstock stack + standing scored & folded rigid folder cover
  bristol: () =>
    wrapStudioScene(`
    <defs>
      <linearGradient id="bristolTop" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FCF9F2"/>
        <stop offset="60%" stop-color="#F2ECE0"/>
        <stop offset="100%" stop-color="#E4DCCA"/>
      </linearGradient>
      <linearGradient id="folderLeft" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFFDF8"/>
        <stop offset="100%" stop-color="#E9E0CE"/>
      </linearGradient>
      <linearGradient id="folderRight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#DDD2BD"/>
        <stop offset="100%" stop-color="#C4B69C"/>
      </linearGradient>
    </defs>
    <!-- Thick heavyweight Bristol stack -->
    ${drawIsoBlock({
      cx: 535,
      cy: 445,
      w: 315,
      d: 140,
      h: 92,
      topFill: 'url(#bristolTop)',
      leftEdgeFill: '#DED5C3',
      rightEdgeFill: '#C6BBA6',
      stroke: '#FFFFFF',
    })}
    <!-- Standing scored & half-folded rigid presentation cover beside the stack -->
    <g filter="url(#dropShadow)">
      <polygon points="790,485 885,430 885,205 790,255" fill="url(#folderLeft)" stroke="#FFFFFF" stroke-width="1.5"/>
      <polygon points="885,430 995,478 995,248 885,205" fill="url(#folderRight)" stroke="#EAE1CF" stroke-width="1.5"/>
      <!-- Crisp score crease line -->
      <line x1="885" y1="205" x2="885" y2="430" stroke="#C9A86A" stroke-opacity="0.55" stroke-width="2"/>
    </g>
  `),

  // 4. Duplex Board — Grey Back: thick multi-ply stack + angled lifted sheet contrasting white coated top vs matte recycled grey back
  'duplex-grey': () =>
    wrapStudioScene(`
    <defs>
      <linearGradient id="greyBackSurface" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#9A9D9E"/>
        <stop offset="55%" stop-color="#7F8285"/>
        <stop offset="100%" stop-color="#64676A"/>
      </linearGradient>
      <linearGradient id="whiteCoatedFace" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="70%" stop-color="#F1F3F5"/>
        <stop offset="100%" stop-color="#DFE3E8"/>
      </linearGradient>
    </defs>
    <!-- Base stack showing bright white coated top & thick grey multi-ply edges -->
    ${drawIsoBlock({
      cx: 560,
      cy: 455,
      w: 325,
      d: 142,
      h: 82,
      topFill: 'url(#whiteCoatedFace)',
      leftEdgeFill: '#8B8E91',
      rightEdgeFill: '#6F7275',
      stroke: '#FFFFFF',
    })}
    <!-- Angled flipped top board sheet showing matte recycled grey back + white front curl -->
    <g filter="url(#dropShadow)" transform="translate(85,-52) rotate(8 640 420)">
      <polygon points="440,395 755,310 890,435 570,525" fill="url(#greyBackSurface)" stroke="#B4B7BA" stroke-width="3.5"/>
      <!-- Folded corner showing bright coated white front side underneath -->
      <polygon points="755,310 890,435 785,462" fill="url(#whiteCoatedFace)" stroke="#FFFFFF" stroke-width="2"/>
      <!-- Multi-ply caliper edge highlight -->
      <line x1="440" y1="395" x2="570" y2="525" stroke="#ECEEEF" stroke-width="3"/>
    </g>
  `),

  // 5. Duplex Board — White Back: white coated top & clean virgin white back stack + folded white pharma carton box mockup
  'duplex-white': () =>
    wrapStudioScene(`
    <defs>
      <linearGradient id="pureWhiteTop" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="65%" stop-color="#F8FAFC"/>
        <stop offset="100%" stop-color="#E9EEF4"/>
      </linearGradient>
      <linearGradient id="boxFront" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="100%" stop-color="#EEF2F6"/>
      </linearGradient>
      <linearGradient id="boxSide" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#E5EBF1"/>
        <stop offset="100%" stop-color="#CFD8E3"/>
      </linearGradient>
    </defs>
    <!-- White-back duplex board stack -->
    ${drawIsoBlock({
      cx: 505,
      cy: 455,
      w: 300,
      d: 135,
      h: 78,
      topFill: 'url(#pureWhiteTop)',
      leftEdgeFill: '#E6EBF0',
      rightEdgeFill: '#CFD7E0',
      stroke: '#FFFFFF',
    })}
    <!-- Crisp folded white pharmaceutical/cosmetic carton box mockup beside stack -->
    <g filter="url(#dropShadow)">
      <!-- Box front panel -->
      <polygon points="760,515 905,470 905,235 760,280" fill="url(#boxFront)" stroke="#FFFFFF" stroke-width="1.5"/>
      <!-- Box right side panel -->
      <polygon points="905,470 1005,522 1005,287 905,235" fill="url(#boxSide)" stroke="#F0F4F8" stroke-width="1.5"/>
      <!-- Open top tuck-flap showing clean virgin white interior back -->
      <polygon points="760,280 905,235 965,266 820,312" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
      <polygon points="760,280 905,235 875,182 742,226" fill="#FBFDFF" stroke="#FFFFFF" stroke-width="1.5"/>
      <!-- Subtle gold registration trim accent on box -->
      <line x1="782" y1="455" x2="882" y2="424" stroke="#C9A86A" stroke-width="2" stroke-opacity="0.7"/>
    </g>
  `),

  // 6. Butter Paper: semi-translucent warm ivory greaseproof roll + delicately curled backlit translucent sheets
  butter: () =>
    wrapStudioScene(`
    <defs>
      <linearGradient id="butterRoll" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#FBF3DF"/>
        <stop offset="45%" stop-color="#ECD9B0"/>
        <stop offset="85%" stop-color="#C9A86A"/>
        <stop offset="100%" stop-color="#9F7F45"/>
      </linearGradient>
      <linearGradient id="butterTranslucent" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFF9EB" stop-opacity="0.82"/>
        <stop offset="50%" stop-color="#F5E6C4" stop-opacity="0.64"/>
        <stop offset="100%" stop-color="#E6CCA0" stop-opacity="0.76"/>
      </linearGradient>
    </defs>
    <!-- Translucent layered curled sheets catching studio backlight -->
    <g filter="url(#softShadow)">
      <path d="M 380 510 C 480 450, 650 440, 860 520 C 930 545, 980 480, 930 430 C 780 375, 580 380, 440 435 Z" fill="url(#butterTranslucent)" stroke="#FFFDF6" stroke-opacity="0.8" stroke-width="1.3"/>
      <path d="M 435 555 C 565 485, 745 485, 955 560 C 1020 578, 1050 510, 990 462 C 835 415, 635 415, 490 478 Z" fill="url(#butterTranslucent)" stroke="#FFFDF6" stroke-opacity="0.9" stroke-width="1.5"/>
    </g>
    <!-- Cylindrical unrolled butter paper reel -->
    <g filter="url(#dropShadow)" transform="rotate(-14 520 370)">
      <path d="M 310 315 L 740 315 A 46 66 0 0 1 740 447 L 310 447 Z" fill="url(#butterRoll)"/>
      <ellipse cx="310" cy="381" rx="44" ry="66" fill="#E5CFA3" stroke="#FFF6E0" stroke-width="1.5"/>
      <ellipse cx="310" cy="381" rx="18" ry="28" fill="#6E5326" stroke="#C9A86A" stroke-width="2"/>
    </g>
  `),

  // 7. Printing Paper (Offset): tall precision stack of high-whiteness uncoated sheets + open blank stitched book signature
  offset: () =>
    wrapStudioScene(`
    <defs>
      <linearGradient id="offsetStackTop" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FCFBF7"/>
        <stop offset="100%" stop-color="#EAE5D9"/>
      </linearGradient>
      <linearGradient id="bookPageLeft" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FDFCF9"/>
        <stop offset="85%" stop-color="#F1EDE2"/>
        <stop offset="100%" stop-color="#D5CEBE"/>
      </linearGradient>
      <linearGradient id="bookPageRight" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#D5CEBE"/>
        <stop offset="15%" stop-color="#F4F0E6"/>
        <stop offset="100%" stop-color="#FFFFFF"/>
      </linearGradient>
    </defs>
    <!-- Tall commercial offset stack -->
    ${drawIsoBlock({
      cx: 485,
      cy: 425,
      w: 285,
      d: 130,
      h: 112,
      topFill: 'url(#offsetStackTop)',
      leftEdgeFill: '#E2DDD0',
      rightEdgeFill: '#CCC5B4',
      stroke: '#FFFFFF',
    })}
    <!-- Open blank stitched book signature foreground right -->
    <g filter="url(#dropShadow)" transform="translate(20,15)">
      <path d="M 675 515 Q 760 475, 845 505 L 855 320 Q 770 290, 685 330 Z" fill="url(#bookPageLeft)" stroke="#FFFFFF" stroke-width="1.5"/>
      <path d="M 845 505 Q 930 475, 1020 515 L 1010 330 Q 925 290, 855 320 Z" fill="url(#bookPageRight)" stroke="#FFFFFF" stroke-width="1.5"/>
      <line x1="855" y1="320" x2="845" y2="505" stroke="#B8B09F" stroke-width="2" stroke-dasharray="6 4"/>
    </g>
  `),

  // 8. Copy Paper (A4 & A3): ultra-bright white A4 and A3 reams + partially folded kraft-cream wrapper
  copy: () =>
    wrapStudioScene(`
    <defs>
      <linearGradient id="copyBright" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="100%" stop-color="#EEF2F7"/>
      </linearGradient>
      <linearGradient id="kraftWrap" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#E7D7B8"/>
        <stop offset="100%" stop-color="#C6AC7D"/>
      </linearGradient>
    </defs>
    <!-- Larger A3 ream stack behind -->
    ${drawIsoBlock({
      cx: 565,
      cy: 410,
      w: 350,
      d: 150,
      h: 72,
      topFill: 'url(#copyBright)',
      leftEdgeFill: '#E5E9F0',
      rightEdgeFill: '#CFD6E2',
      stroke: '#FFFFFF',
    })}
    <!-- Foreground A4 500-sheet ream partially wrapped in unbranded kraft-cream wrapper -->
    <g transform="translate(95,62)">
      ${drawIsoBlock({
        cx: 615,
        cy: 435,
        w: 250,
        d: 112,
        h: 64,
        topFill: 'url(#copyBright)',
        leftEdgeFill: '#E8ECF2',
        rightEdgeFill: '#D4DBE6',
        stroke: '#FFFFFF',
      })}
      <!-- Partially folded open kraft-cream ream wrapper band -->
      <polygon points="395,446 615,323 735,368 512,498" fill="url(#kraftWrap)" stroke="#F6E7C8" stroke-width="1.5" filter="url(#softShadow)"/>
      <polygon points="395,446 512,498 512,562 395,510" fill="#B89B67"/>
    </g>
  `),

  // 9. Coated Paper (Couche): glossy curved S-arc catching silky specular reflection + CMYK color proof bar
  coated: () =>
    wrapStudioScene(`
    <defs>
      <linearGradient id="coucheSpecular" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#E6E1D5"/>
        <stop offset="28%" stop-color="#FFFFFF"/>
        <stop offset="46%" stop-color="#FFF9EB"/>
        <stop offset="62%" stop-color="#DED8C8"/>
        <stop offset="86%" stop-color="#FFFFFF"/>
        <stop offset="100%" stop-color="#CFC8B6"/>
      </linearGradient>
    </defs>
    <!-- Base stack of art-coated paper -->
    ${drawIsoBlock({
      cx: 590,
      cy: 470,
      w: 330,
      d: 142,
      h: 54,
      topFill: '#F7F4EC',
      leftEdgeFill: '#DFD8C8',
      rightEdgeFill: '#C7BFAE',
      stroke: '#FFFFFF',
    })}
    <!-- Gracefully arched glossy couche top sheet catching specular light sheen -->
    <g filter="url(#dropShadow)">
      <path d="M 325 468 C 430 250, 620 245, 765 395 C 835 465, 915 445, 965 365 L 820 305 C 765 380, 690 385, 620 315 C 500 190, 340 210, 235 420 Z" fill="url(#coucheSpecular)" stroke="#FFFFFF" stroke-width="2"/>
    </g>
    <!-- Abstract CMYK calibration color bars on print proof strip (zero text) -->
    <g transform="translate(650,515) rotate(-14)" filter="url(#softShadow)">
      <rect x="0" y="0" width="260" height="44" rx="2" fill="#FFFFFF" stroke="#E4DECFC"/>
      <rect x="14" y="10" width="36" height="24" fill="#00A6E2"/>
      <rect x="56" y="10" width="36" height="24" fill="#E11D74"/>
      <rect x="98" y="10" width="36" height="24" fill="#FACC15"/>
      <rect x="140" y="10" width="36" height="24" fill="#111827"/>
      <rect x="182" y="10" width="64" height="24" fill="#C9A86A"/>
    </g>
  `),

  // 10. Carbon Paper: midnight-navy carbon transfer sheets interleaved between crisp white multi-part form sheets
  carbon: () =>
    wrapStudioScene(`
    <defs>
      <linearGradient id="carbonCoat" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1D2D50"/>
        <stop offset="50%" stop-color="#0F172A"/>
        <stop offset="100%" stop-color="#070B16"/>
      </linearGradient>
      <linearGradient id="ncrTopSheet" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FAF7EE"/>
        <stop offset="100%" stop-color="#E8E1D0"/>
      </linearGradient>
    </defs>
    <!-- Bottom white duplicate form stack -->
    ${drawIsoBlock({
      cx: 620,
      cy: 472,
      w: 320,
      d: 140,
      h: 42,
      topFill: '#F4EFE3',
      leftEdgeFill: '#DDD6C5',
      rightEdgeFill: '#C5BDA9',
      stroke: '#FFFFFF',
    })}
    <!-- Interleaved midnight-navy carbon transfer sheet jutting out -->
    <g filter="url(#softShadow)">
      <polygon points="620,305 955,435 660,590 315,455" fill="url(#carbonCoat)" stroke="#3B5284" stroke-width="1.4"/>
    </g>
    <!-- Top off-white form sheet with lifted corner exposing the dark carbon sheet underneath -->
    <g filter="url(#dropShadow)">
      <path d="M 615 280 L 845 368 C 785 395, 745 438, 720 505 L 650 555 L 335 430 Z" fill="url(#ncrTopSheet)" stroke="#FFFFFF" stroke-width="1.5"/>
      <path d="M 845 368 C 775 372, 728 428, 720 505 C 765 462, 815 425, 845 368 Z" fill="#DFD7C4" stroke="#FFFFFF" stroke-width="1.2"/>
      <!-- Fine ruled invoice form lines (no text) -->
      <line x1="455" y1="402" x2="715" y2="352" stroke="#193051" stroke-opacity="0.22" stroke-width="1.5"/>
      <line x1="485" y1="435" x2="735" y2="386" stroke="#193051" stroke-opacity="0.22" stroke-width="1.5"/>
      <line x1="515" y1="468" x2="705" y2="430" stroke="#C9A86A" stroke-opacity="0.45" stroke-width="1.5"/>
    </g>
  `),
};

await mkdir(OUT_DIR, { recursive: true });

for (const [id, renderFn] of Object.entries(SCENES)) {
  const svg = Buffer.from(renderFn());
  const outPath = resolve(OUT_DIR, `${id}.webp`);
  await sharp(svg, { density: 144 })
    .resize(W, H, { fit: 'cover' })
    .webp({ quality: 90, effort: 5 })
    .toFile(outPath);
  console.log(`Generated ${id}.webp`);
}
