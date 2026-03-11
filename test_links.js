const fs = require('fs');
const content = fs.readFileSync('src/app/[locale]/page.tsx', 'utf-8');
const regex = /href="([^"]+)"/g;
const links = [];
let match;
while ((match = regex.exec(content)) !== null) {
  links.push(match[1]);
}
console.log(links);
