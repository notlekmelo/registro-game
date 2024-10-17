import server from './infra/server/server';
import * as fs from 'fs';
import * as path from 'path';

// Cria o arquivo que será validado
const caminhoArquivo = path.join(__dirname, '..', 'arquivoGaming.txt');
if (fs.existsSync(caminhoArquivo)){
  fs.rmSync(caminhoArquivo)
}
fs.writeFileSync(caminhoArquivo, 'Aguardando Jogadores...')

server.listen(3000, () => {
  console.log(`[SERVER] Running at http://localhost:3000`);
});