@echo off
echo Nettoyage en cours...
rmdir /s /q node_modules 2>nul
rmdir /s /q .next 2>nul
npm cache clean --force
echo Installation des dépendances...
npm install
echo Démarrage du serveur...
npm run dev
pause