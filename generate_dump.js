const fs = require('fs');
const path = require('path');

const output = [];
const walk = (dir) => {
  if (!fs.existsSync(dir)) return;
  const list = fs.readdirSync(dir);
  for (let file of list) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('dist')) walk(file);
    } else {
      if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css')) {
        output.push(`\n\n=== ${file.replace(/\\/g, '/')} ===\n\`\`\`${file.endsWith('.css') ? 'css' : 'javascript'}\n` + fs.readFileSync(file, 'utf-8') + `\n\`\`\`\n`);
      }
    }
  }
};

walk('src');

const rootFiles = ['package.json', 'index.html', 'tailwind.config.js', 'postcss.config.js', 'vite.config.js'];
rootFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let lang = 'json';
    if (f.endsWith('.js')) lang = 'javascript';
    if (f.endsWith('.html')) lang = 'html';
    
    output.push(`\n\n=== ${f} ===\n\`\`\`${lang}\n` + fs.readFileSync(f, 'utf-8') + `\n\`\`\`\n`);
  }
});

// Also read from artifact directory if anything there needs to be captured - probably not for the main codebase.

fs.writeFileSync('codebase_dump.md', "# Supply Chain AI Codebase Dump\nThis file contains the full codebase structure and logic for the application.\n" + output.join(''));
console.log("Successfully created codebase_dump.md");
