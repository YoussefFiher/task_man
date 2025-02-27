import { LokaliseApi } from '@lokalise/node-api';
import fs from 'fs';
import axios from 'axios';
import unzipper from 'unzipper';
import path from 'path';

const apiKey = process.env.LOKALISE_API_KEY;
const projectId = process.env.LOKALISE_PROJECT_ID;

const client = new LokaliseApi({ apiKey });

async function downloadTranslations() {
    try {
        console.log('📡 Génération du fichier de traduction sur Lokalise...');

        // Demande de téléchargement du fichier
        const response = await client.files().download(projectId, {
            format: 'xlf', // Format XLIFF (.xlf)
            original_filenames: true, // Conserver le nom original
        });

        const fileUrl = response.bundle_url;
        console.log('🔗 Fichier généré ! Téléchargement depuis:', fileUrl);

        // Télécharger le fichier ZIP
        const outputFile = 'src/locale/translations.zip';
        const fileResponse = await axios({
            url: fileUrl,
            method: 'GET',
            responseType: 'stream',
        });

        const writer = fs.createWriteStream(outputFile);

        fileResponse.data.pipe(writer);

        writer.on('finish', async () => {
            console.log(`✅ Téléchargement terminé ! Fichier enregistré sous: ${outputFile}`);

            // 📂 Extraction du fichier ZIP
            console.log('📂 Extraction des fichiers de traduction...');
            const extractPath = 'src/locale/';
            let foundEnglishFile = false; // Vérifie si on a trouvé "en/messages.xlf"

            fs.createReadStream(outputFile)
                .pipe(unzipper.Parse())
                .on('entry', async (entry) => {
                    const fileName = entry.path;
                    const fileExt = path.extname(fileName);

                    // Vérifie si le fichier appartient au dossier "en"
                    if (fileExt === '.xlf' && fileName.startsWith('en/')) {
                        const newFilePath = path.join(extractPath, 'messages.en.xlf');
                        console.log(`📝 Fichier extrait : ${fileName} -> ${newFilePath}`);

                        // Sauvegarde du fichier extrait avec un nouveau nom
                        foundEnglishFile = true;
                        entry.pipe(fs.createWriteStream(newFilePath));
                    } else {
                        entry.autodrain(); // Ignorer les autres fichiers
                    }
                })
                .on('close', () => {
                    console.log('✅ Extraction terminée !');

                    if (!foundEnglishFile) {
                        console.warn('⚠️ Aucun fichier de traduction "en/messages.xlf" trouvé.');
                    }

                    // 📌 Supprimer le fichier ZIP après extraction
                    fs.unlink(outputFile, (err) => {
                        if (err) {
                            console.error('❌ Erreur lors de la suppression du fichier ZIP:', err.message);
                        } else {
                            console.log(`🗑️ Fichier ZIP supprimé: ${outputFile}`);
                        }
                    });
                })
                .on('error', (err) => {
                    console.error('❌ Erreur lors de l’extraction:', err.message);
                });
        });

        writer.on('error', (err) => {
            console.error('❌ Erreur lors du téléchargement:', err.message);
        });

    } catch (error) {
        console.error('❌ Erreur:', error.message);
        process.exit(1);
    }
}

// 📌 Exécuter le script
downloadTranslations();
