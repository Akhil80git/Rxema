import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

const rootDir = process.cwd();
const androidDir = path.join(rootDir, 'android');
const publicDir = path.join(rootDir, 'public');
const distDir = path.join(rootDir, 'dist');
const assetsWwwDir = path.join(androidDir, 'app', 'src', 'main', 'assets', 'www');

// Ensure directories
if (!fs.existsSync(assetsWwwDir)) {
  fs.mkdirSync(assetsWwwDir, { recursive: true });
}

// Copy dist into android assets if dist exists
if (fs.existsSync(distDir)) {
  fs.cpSync(distDir, assetsWwwDir, { recursive: true });
  console.log('✅ Bundled web assets into Android APK assets: android/app/src/main/assets/www');
}

// Ensure mipmap icons
const mipmapDirs = [
  'mipmap-mdpi',
  'mipmap-hdpi',
  'mipmap-xhdpi',
  'mipmap-xxhdpi',
  'mipmap-xxxhdpi',
];

const iconSource = path.join(publicDir, 'pwa-512x512.png');
if (fs.existsSync(iconSource)) {
  mipmapDirs.forEach((dirName) => {
    const targetDir = path.join(androidDir, 'app', 'src', 'main', 'res', dirName);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    fs.copyFileSync(iconSource, path.join(targetDir, 'ic_launcher.png'));
    fs.copyFileSync(iconSource, path.join(targetDir, 'ic_launcher_round.png'));
  });
  console.log('✅ Generated Android launcher icons in mipmap folders');
}

// Function to recursively add directory to JSZip
function addDirectoryToZip(zip, folderPath, relativePath = '') {
  const items = fs.readdirSync(folderPath);
  for (const item of items) {
    const fullPath = path.join(folderPath, item);
    const itemRelativePath = relativePath ? `${relativePath}/${item}` : item;
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const folderZip = zip.folder(itemRelativePath);
      addDirectoryToZip(folderZip, fullPath, '');
    } else {
      zip.file(itemRelativePath, fs.readFileSync(fullPath));
    }
  }
}

async function createAndroidZip() {
  const zip = new JSZip();
  const rootFolder = zip.folder('TaskFlow-Android-APK-Project');

  addDirectoryToZip(rootFolder, androidDir);

  // Add build instructions README inside the zip
  const readmeContent = `# TaskFlow Pro - Complete Android APK Project Bundle

## How to Build the APK / AAB Bundle:

### Method 1: Using Android Studio (Recommended)
1. Open Android Studio
2. Click "Open" and select the unzipped "TaskFlow-Android-APK-Project" folder
3. Let Gradle sync dependencies automatically (AGP 8.2+, Gradle 8.5)
4. To test on device: Connect Android phone with USB Debugging and click "Run" (Green Play button)
5. To generate Release APK:
   - Go to menu: "Build" -> "Build Bundle(s) / APK(s)" -> "Build APK(s)"
   - APK will be generated at: \`app/build/outputs/apk/release/app-release-unsigned.apk\`

### Method 2: Command Line (Gradle)
\`\`\`bash
# Build Debug APK
./gradlew assembleDebug

# Build Release APK
./gradlew assembleRelease

# Build Google Play AAB Bundle
./gradlew bundleRelease
\`\`\`

## Included Native Android Features:
- Native NotificationChannel & High Priority Push Notifications
- Native Phone Vibration via VibratorManager
- Background wake & network permissions
- Offline standalone assets bundled into assets/www
- Responsive full-screen WebView with hardware acceleration
`;

  rootFolder.file('README.md', readmeContent);

  const content = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  const outputZipPath = path.join(publicDir, 'TaskFlow-Android-APK-Bundle.zip');
  fs.writeFileSync(outputZipPath, content);
  fs.writeFileSync(path.join(publicDir, 'TaskFlow-Android-Source.zip'), content);

  console.log(`✅ Android Studio APK Bundle ZIP created: ${outputZipPath} (${(content.length / 1024 / 1024).toFixed(2)} MB)`);
}

createAndroidZip().catch((err) => {
  console.error('Error creating Android zip:', err);
});
