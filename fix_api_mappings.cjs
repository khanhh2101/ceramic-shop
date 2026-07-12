const fs = require('fs');
const glob = require('glob');

const pattern = /set([A-Za-z]+)\((res \|\| \[\])\);/g;
const replacement = 'set$1(Array.isArray(res) ? res : (res?.data || res?.items || []));';

glob('src/pages/Admin/**/*.jsx', (err, files) => {
    if (err) {
        console.error(err);
        return;
    }
    
    let count = 0;
    files.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        if (pattern.test(content)) {
            content = content.replace(pattern, replacement);
            fs.writeFileSync(file, content);
            console.log(`Updated ${file}`);
            count++;
        }
    });
    console.log(`Updated ${count} files.`);
});
