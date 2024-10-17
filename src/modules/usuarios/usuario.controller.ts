export const validarInicio = (body: any, callback: Function) => {
    if (!body.Nome || typeof body.Nome != 'string' || body.Nome.length == 0) {
        callback(false, 'É necessário informar o nome do jogador.')
    }
    else if (body.Nome.includes(';')) {
        callback(false, "O nome de usuário não pode conter ';'")
    }    
    else {
        callback(true, null)
    }
}

export const validarPronto = (body: any, callback: Function) => {
    if (!body.Nome || typeof body.Nome != 'string' || body.Nome.length == 0) {
        callback(false, 'É necessário informar o nome do jogador.')
    }
    else if (!body.NumeroJogador) {
        callback(false, "O número do jogador é obrigatório")
    }  
    else {
        const numero = Number(body.NumeroJogador);
        if (isNaN(numero) || numero <= 0) {
            callback(false, "O número do jogador não é valido.")
        }
    }  
    callback(true, null)
}

export const validarFinalizacao = (body: any, callback: Function) => {
    if (body.NumeroJogador) {
        const numero = Number(body.NumeroJogador);
        if (isNaN(numero) || numero <= 0) {
            callback(false, "O número do jogador não é valido.")
        }
    }
    callback(true, null)
}