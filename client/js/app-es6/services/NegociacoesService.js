import {HttpService} from './HttpService';
import {ConnectionFactory} from './ConnectionFactory';
import {NegociacaoDao} from '../dao/NegociacaoDao';
import {Negociacao} from '../models/Negociacao';
export class NegociacoesService {

    constructor() {
        this._http = new HttpService();
    }

    obterNegociacoes() {
        // Executa todas as promisses de uma vez e retona em apens um unico 'then' e 'catch', ficando mais fácil de lidar!
        return Promise.all([
            this.obterNegociacoesDaSemana(),
            this.obterNegociacoesDaSemanaAnterior(),
            this.obterNegociacoesDaSemanaRetrasada()
        ]).then(periodos => {
            // Como periodos retorna uma lista de listas, é necessário utilizar o método 'reduce' para concatenar as Promisseso
            let negociacoes = periodos
                .reduce((dados, periodo) => dados.concat(periodo), []);
            return negociacoes;
        });

    }

    obterNegociacoesDaSemana() {
        return this.obterNegociacoesDaSemanaHTTP('negociacoes/semana', 'Não foi possível obter as negociações da semana');
    }

    obterNegociacoesDaSemanaAnterior() {
        return this.obterNegociacoesDaSemanaHTTP('negociacoes/anterior', 'Não foi possível obter as negociações da semana anterior');
    }

    obterNegociacoesDaSemanaRetrasada() {
        return this.obterNegociacoesDaSemanaHTTP('negociacoes/retrasada', 'Não foi possível obter as negociações da semana retrasada');
    }

    obterNegociacoesDaSemanaHTTP(path, mensagemDeErro) {
        // Realiza a requisição HTTP e converte o retorno em objetos para que possam ser exibidos na View
        return this._http.get(path)
            .then(negociacoes => {
                return negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor));
            }).catch(erro => {
                console.log(erro);
                throw new Error(mensagemDeErro);
            });
    }

    // CADASTRAR NO BANCO INDEXDB 
    cadastra(negociacao) {

        return ConnectionFactory.getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.adiciona(negociacao))
            .then(() => 'Negociação Adicionada com sucesso!')
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possível adicionar a negociação');
            });
    }

    lista() {
        return ConnectionFactory.getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.listaTodos())
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possível listar as negociações');
            });
    }

    apaga() {
        return ConnectionFactory.getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.apagaTodos())
            .then(() => 'Negociações apagadas com sucesso!')
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possível apagar as negociações!');
            })
    }

    importa(listaAtual) {
        // Com o Some, conseguimos ter acesso a cada objeto da lista e verificar de maneira direta cada um dos objetos 
        // e então aplicar corretamente o filtro
        // com isso, podemos utilizar o stringfy para tornar os objetos diretos e verificar seus conteudos, não seus ponteiros
        return this.obterNegociacoes()
            .then(negociacoes => negociacoes.filter(negociacao =>
                !listaAtual.some(negociacaoExistentes =>
                    negociacao.isEquals(negociacaoExistentes))
            ));
        // catch utilizado é o do método obterNegociacoesDaSemanaHTTP que vai para o obterNegociacoes (sem catch também),
        // para evitar adicionar catchs sobre catchs, deixar apenas um catch funcionando
    }

}