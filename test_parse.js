const fs = require('fs');
const css = fs.readFileSync('src/index.css', 'utf8');

// Check line 2800 to 2860
const lines = css.split('\n');
console.log('Lines 2803 to 2855:');
for (let i = 2802; i < 2855; i++) {
  console.log((i+1) + ': ' + lines[i]);
}
