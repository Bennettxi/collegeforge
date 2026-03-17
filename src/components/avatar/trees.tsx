interface TreeProps {
  className?: string;
}

export function SeedlingTree({ className }: TreeProps) {
  return (
    <svg viewBox="0 0 400 500" className={className} role="img" aria-label="Seedling avatar">
      {/* Ground */}
      <ellipse cx="200" cy="420" rx="120" ry="20" fill="#8B7355" opacity="0.3" />
      <rect x="80" y="400" width="240" height="60" rx="30" fill="#92744B" opacity="0.2" />
      {/* Soil mound */}
      <ellipse cx="200" cy="400" rx="80" ry="25" fill="#8B6914" />
      <ellipse cx="200" cy="395" rx="75" ry="20" fill="#A0782C" />
      {/* Tiny stem */}
      <rect x="196" y="350" width="8" height="50" rx="4" fill="#6B8E23" />
      {/* Two small leaves */}
      <ellipse cx="185" cy="345" rx="18" ry="8" fill="#7CCD7C" transform="rotate(-30, 185, 345)" className="avatar-leaves" />
      <ellipse cx="215" cy="340" rx="18" ry="8" fill="#90EE90" transform="rotate(25, 215, 340)" className="avatar-leaves" />
      {/* Tiny sparkle */}
      <circle cx="230" cy="330" r="2" fill="#FFD700" opacity="0.6" className="avatar-particles" />
    </svg>
  );
}

export function SproutTree({ className }: TreeProps) {
  return (
    <svg viewBox="0 0 400 500" className={className} role="img" aria-label="Sprout avatar">
      {/* Ground */}
      <ellipse cx="200" cy="430" rx="150" ry="20" fill="#8B7355" opacity="0.2" />
      {/* Soil */}
      <ellipse cx="200" cy="420" rx="90" ry="25" fill="#8B6914" />
      <ellipse cx="200" cy="415" rx="85" ry="20" fill="#A0782C" />
      {/* Stem */}
      <rect x="194" y="300" width="12" height="120" rx="6" fill="#6B8E23" />
      {/* Branch left */}
      <line x1="200" y1="350" x2="160" y2="320" stroke="#6B8E23" strokeWidth="6" strokeLinecap="round" />
      {/* Branch right */}
      <line x1="200" y1="330" x2="240" y2="305" stroke="#6B8E23" strokeWidth="6" strokeLinecap="round" />
      {/* Leaves */}
      <ellipse cx="155" cy="310" rx="25" ry="15" fill="#66CD66" className="avatar-leaves" />
      <ellipse cx="245" cy="295" rx="25" ry="15" fill="#7CCD7C" className="avatar-leaves" />
      <ellipse cx="200" cy="280" rx="30" ry="18" fill="#90EE90" className="avatar-leaves" />
      {/* Sparkles */}
      <circle cx="260" cy="280" r="3" fill="#FFD700" opacity="0.7" className="avatar-particles" />
      <circle cx="140" cy="300" r="2" fill="#FFD700" opacity="0.5" className="avatar-particles" />
    </svg>
  );
}

export function SaplingTree({ className }: TreeProps) {
  return (
    <svg viewBox="0 0 400 500" className={className} role="img" aria-label="Sapling avatar">
      {/* Ground shadow */}
      <ellipse cx="200" cy="440" rx="160" ry="20" fill="#8B7355" opacity="0.15" />
      {/* Grass tufts */}
      <ellipse cx="130" cy="430" rx="30" ry="8" fill="#90EE90" opacity="0.4" />
      <ellipse cx="270" cy="435" rx="25" ry="6" fill="#90EE90" opacity="0.3" />
      {/* Trunk */}
      <rect x="188" y="280" width="24" height="155" rx="8" fill="#8B6914" />
      <rect x="191" y="280" width="8" height="155" rx="4" fill="#A0782C" opacity="0.5" />
      {/* Branches */}
      <line x1="200" y1="350" x2="140" y2="300" stroke="#8B6914" strokeWidth="8" strokeLinecap="round" />
      <line x1="200" y1="320" x2="260" y2="275" stroke="#8B6914" strokeWidth="8" strokeLinecap="round" />
      <line x1="200" y1="290" x2="155" y2="255" stroke="#8B6914" strokeWidth="6" strokeLinecap="round" />
      {/* Leaf clusters */}
      <circle cx="130" cy="285" r="35" fill="#3CB371" className="avatar-leaves" />
      <circle cx="270" cy="260" r="35" fill="#2E8B57" className="avatar-leaves" />
      <circle cx="148" cy="240" r="30" fill="#66CD66" className="avatar-leaves" />
      <circle cx="200" cy="230" r="40" fill="#3CB371" className="avatar-leaves" />
      {/* Small flowers */}
      <circle cx="165" cy="270" r="4" fill="#FFB6C1" />
      <circle cx="245" cy="248" r="4" fill="#FFB6C1" />
      <circle cx="195" cy="215" r="3" fill="#FFC0CB" />
      {/* Butterfly */}
      <g transform="translate(280, 240)" className="avatar-particles">
        <ellipse cx="-5" cy="0" rx="6" ry="4" fill="#DDA0DD" opacity="0.7" />
        <ellipse cx="5" cy="0" rx="6" ry="4" fill="#DDA0DD" opacity="0.7" />
        <rect x="-1" y="-3" width="2" height="6" rx="1" fill="#8B668B" />
      </g>
    </svg>
  );
}

export function FullTree({ className }: TreeProps) {
  return (
    <svg viewBox="0 0 400 500" className={className} role="img" aria-label="Tree avatar">
      {/* Ground shadow */}
      <ellipse cx="200" cy="445" rx="180" ry="25" fill="#8B7355" opacity="0.1" />
      {/* Grass */}
      <ellipse cx="120" cy="435" rx="40" ry="10" fill="#90EE90" opacity="0.3" />
      <ellipse cx="280" cy="438" rx="35" ry="8" fill="#90EE90" opacity="0.3" />
      {/* Trunk */}
      <rect x="180" y="270" width="40" height="170" rx="12" fill="#8B6914" />
      <rect x="185" y="270" width="12" height="170" rx="6" fill="#A0782C" opacity="0.4" />
      {/* Roots */}
      <line x1="190" y1="430" x2="150" y2="445" stroke="#8B6914" strokeWidth="8" strokeLinecap="round" />
      <line x1="210" y1="430" x2="250" y2="445" stroke="#8B6914" strokeWidth="8" strokeLinecap="round" />
      {/* Major branches */}
      <line x1="200" y1="340" x2="120" y2="280" stroke="#8B6914" strokeWidth="12" strokeLinecap="round" />
      <line x1="200" y1="310" x2="280" y2="250" stroke="#8B6914" strokeWidth="12" strokeLinecap="round" />
      <line x1="200" y1="280" x2="140" y2="220" stroke="#8B6914" strokeWidth="10" strokeLinecap="round" />
      <line x1="200" y1="280" x2="260" y2="210" stroke="#8B6914" strokeWidth="10" strokeLinecap="round" />
      {/* Canopy */}
      <circle cx="110" cy="260" r="45" fill="#228B22" className="avatar-leaves" />
      <circle cx="290" cy="235" r="45" fill="#2E8B57" className="avatar-leaves" />
      <circle cx="135" cy="205" r="40" fill="#3CB371" className="avatar-leaves" />
      <circle cx="265" cy="195" r="40" fill="#228B22" className="avatar-leaves" />
      <circle cx="200" cy="180" r="55" fill="#2E8B57" className="avatar-leaves" />
      <circle cx="165" cy="165" r="35" fill="#3CB371" className="avatar-leaves" />
      <circle cx="235" cy="170" r="35" fill="#228B22" className="avatar-leaves" />
      {/* Light rays */}
      <line x1="200" y1="120" x2="200" y2="100" stroke="#FFD700" strokeWidth="2" opacity="0.3" />
      <line x1="160" y1="130" x2="145" y2="110" stroke="#FFD700" strokeWidth="2" opacity="0.2" />
      <line x1="240" y1="130" x2="255" y2="110" stroke="#FFD700" strokeWidth="2" opacity="0.2" />
      {/* Birds */}
      <g transform="translate(300, 180)" className="avatar-particles">
        <path d="M-8,0 Q-4,-4 0,0 Q4,-4 8,0" fill="none" stroke="#555" strokeWidth="1.5" />
      </g>
      <g transform="translate(320, 160)" className="avatar-particles">
        <path d="M-6,0 Q-3,-3 0,0 Q3,-3 6,0" fill="none" stroke="#555" strokeWidth="1.5" />
      </g>
      {/* Flowers at base */}
      <circle cx="145" cy="425" r="4" fill="#FF69B4" />
      <circle cx="155" cy="430" r="3" fill="#FFB6C1" />
      <circle cx="250" cy="428" r="4" fill="#FF69B4" />
    </svg>
  );
}

export function MightyOakTree({ className }: TreeProps) {
  return (
    <svg viewBox="0 0 400 500" className={className} role="img" aria-label="Mighty Oak avatar">
      {/* Ambient glow */}
      <defs>
        <radialGradient id="oakGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="250" r="200" fill="url(#oakGlow)" />
      {/* Ground shadow */}
      <ellipse cx="200" cy="450" rx="190" ry="25" fill="#8B7355" opacity="0.1" />
      {/* Flowers at base */}
      <circle cx="100" cy="435" r="5" fill="#FF69B4" />
      <circle cx="115" cy="440" r="4" fill="#FFB6C1" />
      <circle cx="290" cy="438" r="5" fill="#FF69B4" />
      <circle cx="305" cy="442" r="4" fill="#DDA0DD" />
      <circle cx="180" cy="442" r="4" fill="#FFB6C1" />
      <circle cx="230" cy="445" r="3" fill="#FF69B4" />
      {/* Trunk - thick and detailed */}
      <rect x="170" y="250" width="60" height="195" rx="15" fill="#6B4226" />
      <rect x="178" y="250" width="15" height="195" rx="7" fill="#8B6914" opacity="0.4" />
      <rect x="205" y="260" width="8" height="180" rx="4" fill="#5C3317" opacity="0.3" />
      {/* Roots */}
      <line x1="185" y1="435" x2="110" y2="455" stroke="#6B4226" strokeWidth="12" strokeLinecap="round" />
      <line x1="215" y1="435" x2="290" y2="455" stroke="#6B4226" strokeWidth="12" strokeLinecap="round" />
      <line x1="195" y1="440" x2="155" y2="460" stroke="#6B4226" strokeWidth="8" strokeLinecap="round" />
      {/* Major branches */}
      <line x1="200" y1="350" x2="90" y2="270" stroke="#6B4226" strokeWidth="16" strokeLinecap="round" />
      <line x1="200" y1="350" x2="310" y2="260" stroke="#6B4226" strokeWidth="16" strokeLinecap="round" />
      <line x1="200" y1="300" x2="100" y2="200" stroke="#6B4226" strokeWidth="14" strokeLinecap="round" />
      <line x1="200" y1="300" x2="300" y2="190" stroke="#6B4226" strokeWidth="14" strokeLinecap="round" />
      <line x1="200" y1="270" x2="160" y2="160" stroke="#6B4226" strokeWidth="10" strokeLinecap="round" />
      <line x1="200" y1="270" x2="250" y2="155" stroke="#6B4226" strokeWidth="10" strokeLinecap="round" />
      {/* Massive canopy */}
      <circle cx="80" cy="250" r="50" fill="#1A6B1A" className="avatar-leaves" />
      <circle cx="320" cy="240" r="50" fill="#1A6B1A" className="avatar-leaves" />
      <circle cx="90" cy="190" r="45" fill="#228B22" className="avatar-leaves" />
      <circle cx="310" cy="180" r="45" fill="#228B22" className="avatar-leaves" />
      <circle cx="140" cy="155" r="50" fill="#2E8B57" className="avatar-leaves" />
      <circle cx="260" cy="150" r="50" fill="#2E8B57" className="avatar-leaves" />
      <circle cx="200" cy="135" r="60" fill="#228B22" className="avatar-leaves" />
      <circle cx="160" cy="120" r="40" fill="#3CB371" className="avatar-leaves" />
      <circle cx="240" cy="120" r="40" fill="#2E8B57" className="avatar-leaves" />
      <circle cx="200" cy="100" r="35" fill="#3CB371" className="avatar-leaves" />
      {/* Golden particles */}
      <circle cx="100" cy="150" r="3" fill="#FFD700" opacity="0.8" className="avatar-particles" />
      <circle cx="300" cy="130" r="3" fill="#FFD700" opacity="0.7" className="avatar-particles" />
      <circle cx="200" cy="80" r="4" fill="#FFD700" opacity="0.9" className="avatar-particles" />
      <circle cx="150" cy="100" r="2" fill="#FFD700" opacity="0.6" className="avatar-particles" />
      <circle cx="250" cy="90" r="2" fill="#FFD700" opacity="0.5" className="avatar-particles" />
      <circle cx="330" cy="200" r="3" fill="#FFD700" opacity="0.6" className="avatar-particles" />
      {/* Owl */}
      <g transform="translate(155, 310)">
        <ellipse cx="0" cy="0" rx="10" ry="12" fill="#8B7355" />
        <circle cx="-4" cy="-3" r="3" fill="#FFD700" />
        <circle cx="4" cy="-3" r="3" fill="#FFD700" />
        <circle cx="-4" cy="-3" r="1.5" fill="#333" />
        <circle cx="4" cy="-3" r="1.5" fill="#333" />
        <path d="M-2,2 L0,5 L2,2" fill="#CD853F" />
      </g>
      {/* Birds */}
      <g transform="translate(340, 120)" className="avatar-particles">
        <path d="M-8,0 Q-4,-5 0,0 Q4,-5 8,0" fill="none" stroke="#555" strokeWidth="1.5" />
      </g>
      <g transform="translate(60, 140)" className="avatar-particles">
        <path d="M-6,0 Q-3,-4 0,0 Q3,-4 6,0" fill="none" stroke="#555" strokeWidth="1.5" />
      </g>
      <g transform="translate(350, 150)" className="avatar-particles">
        <path d="M-5,0 Q-2,-3 0,0 Q2,-3 5,0" fill="none" stroke="#555" strokeWidth="1.5" />
      </g>
    </svg>
  );
}
