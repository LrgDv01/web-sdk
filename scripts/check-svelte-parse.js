const fs = require('fs');
const path = require('path');
const svelte = require('svelte/compiler');

const base = path.join(__dirname, '..', 'packages', 'pixi-svelte', 'src', 'lib');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.svelte')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(base);
let failed = 0;
files.forEach(f => {
  try {
    const code = fs.readFileSync(f, 'utf8');
    svelte.compile(code, { filename: f });
    console.log('OK:', f);
  } catch (err) {
    failed++;
    console.error('ERROR:', f);
    console.error(err.message);
  }
});

if (failed) process.exit(1);
