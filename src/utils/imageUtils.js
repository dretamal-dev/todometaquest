import fs from 'fs';
import dotenv from 'dotenv';

/*
OPT_IMG_SOURCE_DIR = 'public/images'
OPT_IMG_OUTPUT_DIR = 'public/optimized'
*/

export function getOptimizedImage(imagePath, size = false) {

    if (!size) return imagePath;

    dotenv.config();

    const sourceDirEnv = process.env.OPT_IMG_SOURCE_DIR || '';
    const SOURCE_DIR = sourceDirEnv.replace('public/', '/');
    
    const outputDirEnv = process.env.OPT_IMG_OUTPUT_DIR || '';
    const OUTPUT_DIR = outputDirEnv.replace('public/', './public/');


    // const SOURCE_DIR = '/images'; // Carpeta de origen
    // const OUTPUT_DIR = './public/optimized'; // Carpeta de salida

    const relativeImagePath = imagePath.replace(new RegExp(`^/?${SOURCE_DIR}/`), '');
    const optimizedPath = `${OUTPUT_DIR}/${relativeImagePath.replace(/\.[^/.]+$/, '')}-${size}.webp`;

    try {
        // For Node.js: use fs to check if file exists
        if (fs.existsSync(optimizedPath)) {
            const publicPath = optimizedPath.replace(/^\.\/public/, '');
            console.log('eeeeeeeeeeeeeee', publicPath);
            return publicPath;
        }
    } catch (e) {
        console.error('Error checking file existence:', e);
        // In case require or fs is not available (e.g., browser), ignore
    }

    return imagePath;
}