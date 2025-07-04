import formidable from 'formidable';
import { Readable } from 'stream';
import path from 'path';
import fs from 'fs';
import prisma from '@/lib/prisma';

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseFormData = async (request) => {
  const contentType = request.headers.get('content-type');
  const contentLength = request.headers.get('content-length');

  if (!contentType || !contentLength) {
    throw new Error('Missing headers: content-type or content-length');
  }

  // Lire le body dans un Buffer
  const buffers = [];
  const reader = request.body.getReader();

  let result;
  while (!(result = await reader.read()).done) {
    buffers.push(result.value);
  }

  const buffer = Buffer.concat(buffers);

  // Créer un faux objet HTTP lisible
  const fakeReq = new Readable({
    read() {
      this.push(buffer);
      this.push(null);
    },
  });

  // Simuler les headers attendus par formidable
  fakeReq.headers = {
    'content-type': contentType,
    'content-length': contentLength,
  };

  // Parser avec formidable
  return new Promise((resolve, reject) => {
    const form = formidable({
      keepExtensions: true,
      uploadDir: path.join(process.cwd(), 'tmp'),
    });

    form.parse(fakeReq, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};
/*
const saveImage = async (file) => {
  const realFile = Array.isArray(file) ? file[0] : file;

  // ✅ Déclaration AVANT utilisation
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const ext = path.extname(realFile.originalFilename || '.jpg');
  const filename = `${Date.now()}${ext}`;
  const filepath = path.join(uploadDir, filename);

  console.log("realFile:", realFile);
  console.log("Chemin temporaire:", realFile.filepath);
  console.log("Destination finale:", filepath);

  if (!realFile.filepath) {
    throw new Error("Fichier mal reçu ou chemin introuvable.");
  }

  fs.copyFileSync(realFile.filepath, filepath);
  fs.unlinkSync(realFile.filepath);

  return `/uploads/${filename}`;
};
*/
const saveImage = async (file) => {
  if (!file) return null;

  const realFile = Array.isArray(file) ? file[0] : file;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const ext = path.extname(realFile.originalFilename) || '.jpg';
  const filename = `${Date.now()}${ext}`;
  const filepath = path.join(uploadDir, filename);

  fs.renameSync(realFile.filepath, filepath); // Utilisez renameSync pour déplacer

  return `/uploads/${filename}`;
};


const createVoyage = async (fields, files) => {
  const toInt = (val) => parseInt(val) || 0;
  const toDate = (val) => {
    const d = new Date(val);
    return isNaN(d) ? null : d;
  };
  const getField = (val) => (Array.isArray(val) ? val[0] : val)
  // je veux cartegorie en ce modèle  chaine de caractère ;
const rawCategorie = fields.categorie || fields.categorieVoyage || fields.categorieSejour || fields.categorieEvenement;
const categorie = Array.isArray(rawCategorie) ? rawCategorie[0] : rawCategorie;
 
  const voyageData = {
    type: getField(fields.type),
    prix: parseFloat(fields.prix),
    
    placesDisponible: toInt(fields.placesDisponible),
 
    categorie: categorie,

    options: JSON.parse(fields.options || '{}'),
    activites: JSON.parse(fields.activites || '[]'),
    published: false,
    
  };

  // Gérer l’image si présente
  if (files.image && files.image[0]?.filename) {
    voyageData.image = `/uploads/${files.image[0].filename}`;
  }

  // Gestion spécifique selon le type
  switch (voyageData.type) {
    case "voyage":
      Object.assign(voyageData, {
        départ: getField(fields.départ || fields.depart),
        destination: getField(fields.destination),
        date: new Date(),
        heureDepart: getField(fields.heureDepart),
        typeVoyage: getField(fields.typeVoyage),
        dateRetour: toDate(fields.dateRetour),
        heureRetour: getField(fields.heureRetour) || null,
        moyensTransport: getField(fields.moyensTransport),
        placesDisponible: toInt(fields.placesDisponible),
        

      });
      break;

    case "sejour":
      Object.assign(voyageData, {
        départ: getField(fields.départ || fields.depart),
        destinationSejour: getField(fields.destinationSejour),
        dateDepartSejour: toDate(fields.dateDepartSejour),
        duree: toInt(fields.duree),
        hotel: getField(fields.hotel),
        moyensTransport: getField(fields.moyensTransport),
        placesDisponible: toInt(fields.placesDisponible),
      });
      break;

    case "evenement":
      Object.assign(voyageData, {
        titre: getField(fields.titre),
        description: getField(fields.description),
        lieu: getField(fields.lieu),
        dateEvent: toDate(fields.dateEvent),
        heureEvent: getField(fields.heureEvent),
        organisateur: getField(fields.organisateur),
        departEvent: getField(fields.departEvent),
        destinationEvent: getField(fields.destinationEvent),
        moyensTransportEvent: getField(fields.moyensTransportEvent),
        départ: getField(fields.départ || fields.depart),
        placesDisponible: toInt(fields.placesDisponible),
      });
      break;
  }

  // Dernier contrôle (ex : s'assurer que les champs obligatoires sont présents)
  if (voyageData.type === "voyage" && !voyageData.départ) {
    throw new Error("Le champ 'départ' est requis pour un voyage.");
  }

  return await prisma.voyage.create({ data: voyageData });
};


export async function POST(request) {
  try {
    const { fields, files } = await parseFormData(request);
    const voyage = await createVoyage(fields, files);

    return new Response(JSON.stringify(voyage), { status: 201 });
  } catch (error) {
    console.error('Erreur POST:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}
// recharger les fichiers enregistres dans la base de données
export async function GET() {
  try {
    const voyages = await prisma.voyage.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return new Response(JSON.stringify(voyages), { status: 200 });
  } catch (error) {
    console.error('Erreur GET:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}
