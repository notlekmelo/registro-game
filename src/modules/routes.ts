import express, { Request, Response } from "express";
import * as usuarioService from './usuarios/usuario.service';
import * as usuarioController from './usuarios/usuario.controller';
import swaggerUi from 'swagger-ui-express';
import { ConfigSwagger } from '../infra/swagger/configSwagger';

const routes = express.Router();

routes.post('/iniciar', (req: Request, res: Response) => {
    const body = req.body;
    usuarioController.validarInicio(body, (paramValido: boolean, mensagemErro: string)=> {
        if (!paramValido) {
            res.status(422).json({
                "statusCode": 422,
                "message": mensagemErro
            });
        }
        else {
            usuarioService.validarInicioJogo(body, (err: any, numeroJogador: number, message: string) => {
                if (err) {
                    res.status(400).json({
                        "statusCode": 400,
                        "message": err.message
                    });
                }
                else {
                    res.status(200).json({
                        "statusCode": 200,
                        'numeroJogador': numeroJogador,
                        "message": message
                    })
                }
            })
        }
    })
});

routes.post('/verificar-inicio', (req: Request, res: Response) => {
    const body = req.body;
    usuarioController.validarPronto(body, (paramValido: boolean, mensagemErro: string)=> {
        if (!paramValido) {
            res.status(422).json({
                "statusCode": 422,
                "message": mensagemErro
            });
        }
        else {
            usuarioService.verificarInicio(body, (err: any, podeIniciar: boolean, message: string) => {
                if (err) {
                    res.status(400).json({
                        "statusCode": 400,
                        "message": err.message
                    });
                }
                else {
                    res.status(200).json({
                        "statusCode": 200,
                        'podeIniciar': podeIniciar,
                        "message": message
                    })
                }
            })
        }
    })
});

routes.post('/finalizar', (req: Request, res: Response) => {
    const body = req.body;
    usuarioController.validarPronto(body, (paramValido: boolean, mensagemErro: string)=> {
        if (!paramValido) {
            res.status(422).json({
                "statusCode": 422,
                "message": mensagemErro
            });
        }
        else {
            usuarioService.finalizado(body, (err: any, finalizado: boolean, message: string) => {
                if (err) {
                    res.status(400).json({
                        "statusCode": 400,
                        "message": err.message
                    });
                }
                else {
                    res.status(200).json({
                        "statusCode": 200,
                        'finalizado': finalizado,
                        "message": message
                    })
                }
            })
        }
    })
});

routes.post('/validar-resultados', (req: Request, res: Response) => {
    const body = req.body;
    usuarioController.validarFinalizacao(body, (paramValido: boolean, mensagemErro: string)=> {
        if (!paramValido) {
            res.status(422).json({
                "statusCode": 422,
                "message": mensagemErro
            });
        }
        else {
            usuarioService.rotaResultado(body, (err: any, partidaFinalizada: boolean, message: string, table: Array<any>) => {
                if (err) {
                    res.status(400).json({
                        "statusCode": 400,
                        "message": err.message
                    });
                }
                else {
                    res.status(200).json({
                        "statusCode": 200,
                        "partidaFinalizada": partidaFinalizada,
                        "message": message,
                        'resultados': table
                    })
                }
            })
        }
    })
});

routes.post('/reset', (req: Request, res: Response) => {
    usuarioService.reset();
    res.status(200).json({
        "statusCode": 200,
        'reset': true
    })
})


// Para utilização dos testes automatizados este bloco deve estar comentado
const configSwagger = new ConfigSwagger();
routes.use('/api/docs', swaggerUi.serve,
    swaggerUi.setup(configSwagger.swaggerDocument));
// Fim do bloco que deve estar comentado para uso dos testes automatizados
routes.get('/', function (req, res) {
    res.send('Api de registro do game');
});

export default routes;