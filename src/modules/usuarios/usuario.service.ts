import fs from "fs";
import path from "path";

const caminhoArquivo = path.join(__dirname, '..', '..', '..', 'arquivoGaming.txt');

export const validarInicioJogo = (body: any, callback: Function) => {
    try {
        const arquivo = fs.readFileSync(caminhoArquivo, 'utf8').split('\n');
        if (arquivo[0] == 'Aguardando Jogadores...') {
            let numeroJogador = 0
            if (arquivo.length == 1) {
                arquivo.push('Jogador 1: ' + body.Nome + '\n' + new Date().toISOString())
                numeroJogador = 1;
                fs.writeFileSync(caminhoArquivo, arquivo.join('\n'))
                callback(null, numeroJogador, 'Você está na fila para jogar, por favor aguarde.')
            }
            else {
                const horaUltimoJogador = new Date(arquivo[arquivo.length-1]);
                const agora = new Date();
                const diferencaTempo = (agora.getTime() - horaUltimoJogador.getTime()) / 1000;
                const quantidadeJogadores = Number(arquivo[arquivo.length-2].substring(8,9)) + 1;

                if (diferencaTempo > 10 && quantidadeJogadores > 2) {
                    callback(null, 0, 'A partida já vai iniciar, aguarde a próxima partida.')
                }
                else if (quantidadeJogadores == 6) {
                    callback(null, 0, 'A partida já está cheia.')
                } 
                else {
                    arquivo[arquivo.length-1] = 'Jogador ' + quantidadeJogadores + ': ' + body.Nome + '\n' + new Date().toISOString();
                    numeroJogador = quantidadeJogadores;
                    fs.writeFileSync(caminhoArquivo, arquivo.join('\n'))
                    callback(null, numeroJogador, 'Você está na fila para jogar, por favor aguarde.')
                }
            }
        }
        else {
            callback(null, 0, "O jogo já começou, por favor aguarde.")
        }
    }
    catch(err){
        callback(err)
    }
}

export const verificarInicio = (body: any, callback: Function) => {
    try {
        const arquivo = fs.readFileSync(caminhoArquivo, 'utf8').split('\n');
        if (['Partida iniciada!', 'Aguardando Jogadores...'].includes(arquivo[0]) && 
            arquivo[body.NumeroJogador].substring(11) == body.Nome) 
        {
            if (arquivo.length == 1) {
                callback(null, false, 'Nenhum jogador na fila.')
            }
            else {
                const quantidadeJogadores = Number(arquivo[arquivo.length-2].substring(8,9));
                const ultimaInscricao = new Date(arquivo[arquivo.length-1]);
                const agora = new Date();

                const diferencaTempo = (agora.getTime() - ultimaInscricao.getTime()) / 1000

                if (quantidadeJogadores >= 2 && diferencaTempo >= 10) {
                    arquivo[0] = 'Partida iniciada!';
                    arquivo[body.NumeroJogador] += ' ;' + new Date().toISOString();
                    fs.writeFileSync(caminhoArquivo, arquivo.join('\n'))
                    callback(null, true, 'Autorizado à começar')
                }
                else {
                    callback(null, false, 'Aguardando jogadores...')
                }
            }
        }
        else {
            callback(null, false, "O jogo já começou, por favor aguarde.")
        }
    }
    catch(err) {
        callback(err)
    }
}

export const finalizado = (body: any, callback: Function) => {
    try {
        const arquivo = fs.readFileSync(caminhoArquivo, 'utf8').split('\n');
        if (arquivo[0] == 'Partida iniciada!') {
            const indexSinal = arquivo[body.NumeroJogador].indexOf(';');
            if (indexSinal > 0 && arquivo[body.NumeroJogador].substring(11, indexSinal-1) == body.Nome &&
                arquivo[body.NumeroJogador].substring(arquivo[body.NumeroJogador].length-9) != 'segundos;' 
            ) {
                const horaIniciada = new Date(arquivo[body.NumeroJogador].substring(indexSinal+1))
                const agora = new Date();
                const diferencaTempo = (agora.getTime() - horaIniciada.getTime()) / 1000

                const minutos = Math.floor(diferencaTempo / 60);
                const tempo = minutos + ' minuto(s) e ' + Math.floor(diferencaTempo - (minutos * 60)) + ' segundo(s).' 

                arquivo[body.NumeroJogador] = arquivo[body.NumeroJogador].substring(0, indexSinal+1) + diferencaTempo + ' segundos;'
                
                fs.writeFileSync(caminhoArquivo, arquivo.join('\n'))

                let achou = false;
                for (let i = 1; i < arquivo.length-1 && !achou; i++) {
                    if (arquivo[i].substring(arquivo[i].length-9) != 'segundos;') {
                        achou = true;
                    }
                }
                if (!achou) {
                    arquivo[0] = 'Partida Finalizada.'
                }
                fs.writeFileSync(caminhoArquivo, arquivo.join('\n'))
                callback(null, true, 'Você terminou em ' + tempo)
            }
            else {
                callback(null, false, "Esse jogador não está na partida.")
            }
        }
        else {
            callback(null, false, "Não há jogada a ser finalizada.")
        }
    }
    catch(err) {
        callback(err)
    }
}

export const rotaResultado = (body: any, callback: Function) => {
    try {
        const arquivo = fs.readFileSync(caminhoArquivo, 'utf8').split('\n');
        if (arquivo[0] == 'Partida Finalizada.') {
            if (body && body.NumeroJogador) {
                const indexSinal = arquivo[body.NumeroJogador].indexOf(';');
                if (indexSinal > 0 && arquivo[body.NumeroJogador].substring(11, indexSinal-1) == body.Nome &&
                    arquivo[body.NumeroJogador].substring(arquivo[body.NumeroJogador].length-3) != ';OK'
                ) {
                    arquivo[body.NumeroJogador] += 'OK'
                    let achou = false;
                    for (let i = 1; i < arquivo.length-1 && !achou; i++) {
                        if (arquivo[i].substring(arquivo[i].length-3) != ';OK') {
                            achou = true;
                        }
                    }
                    if (!achou) {
                        fs.writeFileSync(caminhoArquivo, 'Aguardando Jogadores...')
                    }
                    else {
                        fs.writeFileSync(caminhoArquivo, arquivo.join('\n'))
                    }
                }
            }
            let table = [];
            for (let i = 1; i < arquivo.length-1; i++) {
                table.push({
                    Jogador: arquivo[i].substring(8, arquivo[i].indexOf(':')),
                    Nome: arquivo[i].substring(arquivo[i].indexOf(':')+1, arquivo[i].indexOf(';')-1),
                    Tempo: arquivo[i].substring(arquivo[i].indexOf(';')+1, arquivo[i].lastIndexOf(';')),
                })
            } 
            table.sort((a,b) => Number(a.Tempo.substring(0, a.Tempo.indexOf(' '))) - Number(b.Tempo.substring(0, b.Tempo.indexOf(' '))))
            table.forEach(item => {
                const segundos = Number(item.Tempo.substring(0, item.Tempo.indexOf(' ')));
                const minutos = Math.floor(segundos / 60);
                item.Tempo = minutos + ' minuto(s) e ' + Math.floor(segundos - minutos * 60) + ' segundo(s)'
            })
            callback(null, true, '', table)
        }
        else {
            callback(null, false,'A partida não foi finalizada.', [])
        }
    }
    catch(err) {
        callback(err)
    }
}

export const reset = () => {
    fs.writeFileSync(caminhoArquivo, 'Aguardando Jogadores...')
}