import * as fs from 'fs';
import * as path from 'path';

export const simpanRawJSON = (subFolder: string, namaFile: string, data: any) => {
    try {
        const outputDir = path.join(__dirname, '../../output', subFolder); 
        
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const filePath = path.join(outputDir, namaFile); 
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error(`[DEBUG] Gagal menyimpan file ${namaFile}:`, err);
    }
};