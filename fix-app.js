const fs = require('fs');
let appTsx = fs.readFileSync('frontend/src/App.tsx', 'utf8');

// Replace the root wrapper div
appTsx = appTsx.replace(
  /<div className=\"min-h-screen bg-slate-50 bg-pastel-orbs font-body text-glass-darkText selection:bg-accent-primary\/20\">/,
  `<div className="min-h-screen font-body text-slate-100 selection:bg-accent-primary/30 relative">
      {/* Animated Background Mesh */}
      <div className="bg-mesh-container">
        <div className="bg-mesh-gradient"></div>
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>`
);

// Update Header
appTsx = appTsx.replace(
  /<header className=\"border-b border-glass-border bg-white\/40 backdrop-blur-md sticky top-0 z-50\">/g,
  '<header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50 shadow-glass">'
);

appTsx = appTsx.replace(
  /<p className=\"font-display text-xl font-bold leading-tight bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent\">Half Light<\/p>/,
  '<p className="font-display text-2xl font-bold leading-tight text-gradient tracking-wide">Half Light</p>'
);

// Network Banner
appTsx = appTsx.replace(
  /<div className=\"border-b border-glass-border bg-white\/20 px-6 py-2.5 text-xs text-glass-mutedText backdrop-blur-sm\">/,
  '<div className="border-b border-white/10 bg-black/30 px-6 py-2.5 text-xs text-slate-300 backdrop-blur-md">'
);

appTsx = appTsx.replace(
  /<strong className=\"text-glass-darkText\">Midnight Preprod<\/strong>/,
  '<strong className="text-white tracking-wide">Midnight Preprod</strong>'
);

// Main Section
appTsx = appTsx.replace(
  /<h1 className=\"font-display text-4xl font-bold leading-tight sm:text-5xl text-glass-darkText tracking-tight\">/,
  '<h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl text-white tracking-tight drop-shadow-lg">'
);

appTsx = appTsx.replace(
  /<span className=\"rounded-full bg-white\/50 px-3 py-1 text-xs font-medium text-glass-mutedText border border-white\/60 shadow-sm\">ID:/,
  '<span className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 border border-white/10 shadow-glass">ID:'
);

fs.writeFileSync('frontend/src/App.tsx', appTsx);
