import { PrismaClient } from '../lib/generated/prisma/index.js'



const prisma = new PrismaClient()

async function main() {
  const user = await prisma.utilisateurs.create({
    data: {
      nom: 'Jean',
      prenom: 'Dupont',
      email: 'jean@example.com',
      telephone: '+33612345678',
      mot_de_passe: 'secret123',
  
    }
  })
  console.log(user)
}

main()
