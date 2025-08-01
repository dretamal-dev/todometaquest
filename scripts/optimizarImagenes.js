// npm install sharp
// npm install dotenv --save

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import dotenv from 'dotenv';

dotenv.config();


// Configuración
const QUALITY = 80; // Calidad de la imagen de salida (1-100)
const SOURCE_DIR = process.env.OPT_IMG_SOURCE_DIR;
const OUTPUT_DIR = process.env.OPT_IMG_OUTPUT_DIR;
// const SOURCE_DIR = 'public/images'; // Carpeta de origen
// const OUTPUT_DIR = 'public/optimized'; // Carpeta de salida
const SIZES = [400]; // Tamaños de los recortes

// Crear la carpeta de salida si no existe
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Función para optimizar las imágenes
async function optimizeImage(filePath, outputPath, width) {
  // Verificar si el archivo ya existe
  if (fs.existsSync(outputPath)) {
    console.log(`File already exists, skipping: ${outputPath}`);
    return;
  }

  try {
    await sharp(filePath)
      .resize(width)
      .webp({ quality: QUALITY }) // Cambiar a WebP
      .toFile(outputPath);
    console.log(`Image optimized: ${outputPath}`);
  } catch (err) {
    console.error(`Error optimizing image: ${filePath}`, err);
  }
}

// Función para procesar una carpeta
function processDirectory(directoryPath) {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }

    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Error reading file/directory: ${filePath}`, err);
          return;
        }

        if (stats.isDirectory()) {
          // Si es una subcarpeta, procesarla
          processDirectory(filePath);
        } else if (stats.isFile()) {
          // Si es un archivo, optimizarlo en diferentes tamaños
          SIZES.forEach((size) => {
            // Crear la ruta de salida basándose en la ruta de origen
            const relativePath = path.relative(SOURCE_DIR, filePath);
            const outputPath = path.join(OUTPUT_DIR, path.dirname(relativePath));
            const outputFilePath = path.join(outputPath, `${path.basename(file, path.extname(file))}-${size}.webp`);

            // Crear la carpeta de salida si no existe
            if (!fs.existsSync(outputPath)) {
              fs.mkdirSync(outputPath, { recursive: true });
            }

            optimizeImage(filePath, outputFilePath, size);
          });
        }
      });
    });
  });
}

// Empezar a procesar desde la carpeta de origen
processDirectory(SOURCE_DIR);