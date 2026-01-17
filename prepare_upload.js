import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const outputFile = 'upload_payload.json';

const ignoreDirs = ['node_modules', 'dist', '.git', '.gemini'];
const ignoreFiles = ['.env', 'package-lock.json', 'bun.lockb', 'upload_payload.json', 'test-connection.js', 'deployment_instructions.md'];

function walk(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            if (!ignoreDirs.includes(file)) {
                walk(filePath, fileList);
            }
        } else {
            if (!ignoreFiles.includes(file)) {
                const ext = path.extname(file).toLowerCase();
                if (['.png', '.jpg', '.jpeg', '.ico', '.pdf'].includes(ext)) {
                    console.log(`Skipping binary file: ${file}`);
                    continue;
                }

                // Keep relative path for GitHub
                const relativePath = path.relative(rootDir, filePath).replace(/\\/g, '/');
                try {
                    const content = fs.readFileSync(filePath, 'utf-8');
                    fileList.push({ path: relativePath, content: content });
                } catch (e) {
                    console.error(`Skipping binary or unreadable file: ${relativePath}`);
                }
            }
        }
    }
    return fileList;
}

const allFiles = walk(rootDir);

const CHUNK_SIZE = 20;
const chunks = [];
for (let i = 0; i < allFiles.length; i += CHUNK_SIZE) {
    chunks.push(allFiles.slice(i, i + CHUNK_SIZE));
}

chunks.forEach((chunk, index) => {
    const fileName = `upload_payload_${index + 1}.json`;
    fs.writeFileSync(fileName, JSON.stringify(chunk, null, 2));
    console.log(`Created ${fileName} with ${chunk.length} files.`);
});

console.log(`Total files: ${allFiles.length}. Created ${chunks.length} batch files.`);
