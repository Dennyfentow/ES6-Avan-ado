'use strict';

System.register(['./HttpService', './ConnectionFactory', '../dao/NegociacaoDao', '../models/Negociacao'], function (_export, _context) {
    "use strict";

    var HttpService, ConnectionFactory, NegociacaoDao, Negociacao, _createClass, NegociacoesService;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_HttpService) {
            HttpService = _HttpService.HttpService;
        }, function (_ConnectionFactory) {
            ConnectionFactory = _ConnectionFactory.ConnectionFactory;
        }, function (_daoNegociacaoDao) {
            NegociacaoDao = _daoNegociacaoDao.NegociacaoDao;
        }, function (_modelsNegociacao) {
            Negociacao = _modelsNegociacao.Negociacao;
        }],
        execute: function () {
            _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }

                return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();

            _export('NegociacoesService', NegociacoesService = function () {
                function NegociacoesService() {
                    _classCallCheck(this, NegociacoesService);

                    this._http = new HttpService();
                }

                _createClass(NegociacoesService, [{
                    key: 'obterNegociacoes',
                    value: function obterNegociacoes() {
                        // Executa todas as promisses de uma vez e retona em apens um unico 'then' e 'catch', ficando mais fácil de lidar!
                        return Promise.all([this.obterNegociacoesDaSemana(), this.obterNegociacoesDaSemanaAnterior(), this.obterNegociacoesDaSemanaRetrasada()]).then(function (periodos) {
                            // Como periodos retorna uma lista de listas, é necessário utilizar o método 'reduce' para concatenar as Promisses
                            var negociacoes = periodos.reduce(function (dados, periodo) {
                                return dados.concat(periodo);
                            }, []);
                            return negociacoes;
                        });
                    }
                }, {
                    key: 'obterNegociacoesDaSemana',
                    value: function obterNegociacoesDaSemana() {
                        return this.obterNegociacoesDaSemanaHTTP('negociacoes/semana', 'Não foi possível obter as negociações da semana');
                    }
                }, {
                    key: 'obterNegociacoesDaSemanaAnterior',
                    value: function obterNegociacoesDaSemanaAnterior() {
                        return this.obterNegociacoesDaSemanaHTTP('negociacoes/anterior', 'Não foi possível obter as negociações da semana anterior');
                    }
                }, {
                    key: 'obterNegociacoesDaSemanaRetrasada',
                    value: function obterNegociacoesDaSemanaRetrasada() {
                        return this.obterNegociacoesDaSemanaHTTP('negociacoes/retrasada', 'Não foi possível obter as negociações da semana retrasada');
                    }
                }, {
                    key: 'obterNegociacoesDaSemanaHTTP',
                    value: function obterNegociacoesDaSemanaHTTP(path, mensagemDeErro) {
                        // Realiza a requisição HTTP e converte o retorno em objetos para que possam ser exibidos na View
                        return this._http.get(path).then(function (negociacoes) {
                            return negociacoes.map(function (objeto) {
                                return new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor);
                            });
                        }).catch(function (erro) {
                            console.log(erro);
                            throw new Error(mensagemDeErro);
                        });
                    }
                }, {
                    key: 'cadastra',
                    value: function cadastra(negociacao) {

                        return ConnectionFactory.getConnection().then(function (connection) {
                            return new NegociacaoDao(connection);
                        }).then(function (dao) {
                            return dao.adiciona(negociacao);
                        }).then(function () {
                            return 'Negociação Adicionada com sucesso!';
                        }).catch(function (erro) {
                            console.log(erro);
                            throw new Error('Não foi possível adicionar a negociação');
                        });
                    }
                }, {
                    key: 'lista',
                    value: function lista() {
                        return ConnectionFactory.getConnection().then(function (connection) {
                            return new NegociacaoDao(connection);
                        }).then(function (dao) {
                            return dao.listaTodos();
                        }).catch(function (erro) {
                            console.log(erro);
                            throw new Error('Não foi possível listar as negociações');
                        });
                    }
                }, {
                    key: 'apaga',
                    value: function apaga() {
                        return ConnectionFactory.getConnection().then(function (connection) {
                            return new NegociacaoDao(connection);
                        }).then(function (dao) {
                            return dao.apagaTodos();
                        }).then(function () {
                            return 'Negociações apagadas com sucesso!';
                        }).catch(function (erro) {
                            console.log(erro);
                            throw new Error('Não foi possível apagar as negociações!');
                        });
                    }
                }, {
                    key: 'importa',
                    value: function importa(listaAtual) {
                        // Com o Some, conseguimos ter acesso a cada objeto da lista e verificar de maneira direta cada um dos objetos 
                        // e então aplicar corretamente o filtro
                        // com isso, podemos utilizar o stringfy para tornar os objetos diretos e verificar seus conteudos, não seus ponteiros
                        return this.obterNegociacoes().then(function (negociacoes) {
                            return negociacoes.filter(function (negociacao) {
                                return !listaAtual.some(function (negociacaoExistentes) {
                                    return negociacao.isEquals(negociacaoExistentes);
                                });
                            });
                        });
                        // catch utilizado é o do método obterNegociacoesDaSemanaHTTP que vai para o obterNegociacoes (sem catch também),
                        // para evitar adicionar catchs sobre catchs, deixar apenas um catch funcionando
                    }
                }]);

                return NegociacoesService;
            }());

            _export('NegociacoesService', NegociacoesService);
        }
    };
});
//# sourceMappingURL=NegociacoesService.js.map