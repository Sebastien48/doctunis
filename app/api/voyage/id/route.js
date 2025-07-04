import fs from 'fs';
import path from 'path';
import formidable from 'formidable';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'voyages.json');

export const config = {
  api: {
    bodyParser: false,
  },
};

const initDataFile = () => {
  const dir = path.dirname(DATA_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE_PATH)) {
    fs.writeFileSync(DATA_FILE_PATH, '[]', 'utf-8');
  }
};

const readData = () => {
  initDataFile();
  try {
    const data = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeData = (data) => {
  fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
};

const saveImage = async (file) => {
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const ext = path.extname(file.originalFilename) || '.jpg';
    const filename = `${Date.now()}${ext}`;
    const filepath = path.join(uploadDir, filename);
    
    const fileData = fs.readFileSync(file.filepath);
    fs.writeFileSync(filepath, fileData);
    fs.unlinkSync(file.filepath);
    
    return `/uploads/${filename}`;
  } catch (error) {
    console.error('Erreur sauvegarde image:', error);
    return null;
  }
};

export  async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const voyages = readData();
    const voyageIndex = voyages.findIndex(v => v.id === id);

    if (voyageIndex === -1) {
      return res.status(404).json({ error: 'Voyage non trouvé' });
    }

    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(process.cwd(), 'tmp');
    
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const updatedData = {
      ...voyages[voyageIndex],
      ...fields,
      options: JSON.parse(fields.options || '{}'),
      activites: JSON.parse(fields.activites || '[]'),
    };

    if (files.image) {
      updatedData.image = await saveImage(files.image);
    }

    voyages[voyageIndex] = updatedData;
    writeData(voyages);
    
    return res.status(200).json(updatedData);
    
  } catch (error) {
    console.error('Erreur PUT:', error);
    return res.status(500).json({ error: 'Erreur de mise à jour' });
  }
}