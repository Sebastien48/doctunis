import jwt from 'jsonwebtoken';

export async function GET(request) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return new Response(JSON.stringify({ error: 'Non connecté' }), { status: 401 });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return new Response(JSON.stringify({ nom: user.nom, prenom: user.prenom }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: 'Token invalide' }), { status: 401 });
  }
}
