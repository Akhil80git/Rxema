import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');
const androidDir = path.join(rootDir, 'android');

async function createCapacitorZip() {
  if (!fs.existsSync(androidDir)) {
    console.log('android dir not found');
    return;
  }

  const zip = new JSZip();
  const folder = zip.folder('TaskFlow-Capacitor-Android');

  function addDir(dir, zipNode) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      if (item === '.gradle' || item === 'build' || item === 'captures') continue;
      const full = path.join(dir, item);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        addDir(full, zipNode.folder(item));
      } else {
        zipNode.file(item, fs.readFileSync(full));
      }
    }
  }

  addDir(androidDir, folder);

  const buffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  const zipPath = path.join(publicDir, 'TaskFlow-Capacitor-Android.zip');
  fs.writeFileSync(zipPath, buffer);
  console.log(`✅ Capacitor Android ZIP created at: ${zipPath} (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`);
}

createCapacitorZip().catch(console.error);
