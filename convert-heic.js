const fs = require('fs');
const path = require('path');
const heicConvert = require('heic-convert');

async function convert() {
    const file = 'IMG20241201131920.heic';
    const inputPath = path.join(__dirname, file);
    const outputPath = path.join(__dirname, file.replace('.heic', '.jpg'));
    
    console.log(`Converting ${file}...`);
    const inputBuffer = fs.readFileSync(inputPath);
    const outputBuffer = await heicConvert({
        buffer: inputBuffer,
        format: 'JPEG',
        quality: 0.85
    });
    fs.writeFileSync(outputPath, Buffer.from(outputBuffer));
    console.log(`  -> ${file.replace('.heic', '.jpg')} done!`);
}

convert().catch(err => console.error('Error:', err));
