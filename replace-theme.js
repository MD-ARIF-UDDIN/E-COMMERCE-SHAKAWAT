const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
  // First handle multi-word/specific combos
  { regex: /bg-black-900\/50/g, replacement: 'bg-white border border-gold-100' },
  { regex: /bg-black-800\/50/g, replacement: 'bg-gold-50 border border-gold-100' },
  
  // Then the black backgrounds
  { regex: /bg-black-950/g, replacement: 'bg-white' },
  { regex: /bg-black-900/g, replacement: 'bg-white' },
  { regex: /bg-black-800/g, replacement: 'bg-gold-50' },
  { regex: /(?<!-)bg-black(?!-|\/)/g, replacement: 'bg-white' }, // bg-black but not bg-black-900
  { regex: /bg-black\/(\d+)/g, replacement: 'bg-black/$1' }, // Keep bg-black/60 for overlays

  // Text Gold adjustments
  { regex: /text-gold-100/g, replacement: 'text-gold-900' },
  { regex: /text-gold-900\/40/g, replacement: 'text-gold-400' },
  { regex: /text-gold-900\/20/g, replacement: 'text-gold-300' },
  { regex: /border-gold-900\/10/g, replacement: 'border-gold-100' },
  { regex: /border-gold-900\/20/g, replacement: 'border-gold-200' },

  // Slate -> Gold
  { regex: /slate-950/g, replacement: 'gold-900' },
  { regex: /slate-900/g, replacement: 'gold-900' },
  { regex: /slate-800/g, replacement: 'gold-800' },
  { regex: /slate-700/g, replacement: 'gold-700' },
  { regex: /slate-600/g, replacement: 'gold-600' },
  { regex: /slate-500/g, replacement: 'gold-500' },
  { regex: /slate-400/g, replacement: 'gold-400' },
  { regex: /slate-300/g, replacement: 'gold-300' },
  { regex: /slate-200/g, replacement: 'gold-200' },
  { regex: /slate-100/g, replacement: 'gold-100' },
  { regex: /slate-50/g, replacement: 'gold-50' },

  // Indigo -> Primary
  { regex: /indigo-950/g, replacement: 'primary' },
  { regex: /indigo-900/g, replacement: 'primary' },
  { regex: /indigo-800/g, replacement: 'primary' },
  { regex: /indigo-700/g, replacement: 'primary' },
  { regex: /indigo-600/g, replacement: 'primary' },
  { regex: /indigo-500/g, replacement: 'primary' },
  { regex: /indigo-400/g, replacement: 'primary\/80' },
  { regex: /indigo-300/g, replacement: 'primary\/60' },
  { regex: /indigo-200/g, replacement: 'primary\/40' },
  { regex: /indigo-100/g, replacement: 'primary\/20' },
  { regex: /indigo-50/g, replacement: 'primary\/10' },

  // Other dark specific classes
  { regex: /text-black/g, replacement: 'text-white' }, // Since backgrounds are white, primary hover with text-black should be text-white maybe? Let's check first. Actually no, if background is primary (gold), text should be black for contrast.
];

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

let modifiedFilesCount = 0;

walkDir(srcDir, function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let originalContent = content;

    replacements.forEach(rep => {
      if (rep.regex.source === 'text-black') {
         // Skip text-black replacement to prevent breaking buttons.
         return; 
      }
      content = content.replace(rep.regex, rep.replacement);
    });

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf-8');
      modifiedFilesCount++;
      console.log('Modified:', filePath);
    }
  }
});

console.log(`Total files modified: ${modifiedFilesCount}`);
