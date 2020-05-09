'use strict';

System.register(['../models/ListaNegociacoes', '../models/Mensagem', '../models/Negociacao', '../views/NegociacoesView', '../views/MensagemView', '../services/NegociacoesService', '../helpers//DateHelper', '../helpers/Bind'], function (_export, _context) {
    "use strict";

    var ListaNegociacoes, Mensagem, Negociacao, NegociacoesView, MensagemView, NegociacoesService, DateHelper, Bind, _createClass, NegociacaoController, negociacaoController;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_modelsListaNegociacoes) {
            ListaNegociacoes = _modelsListaNegociacoes.ListaNegociacoes;
        }, function (_modelsMensagem) {
            Mensagem = _modelsMensagem.Mensagem;
        }, function (_modelsNegociacao) {
            Negociacao = _modelsNegociacao.Negociacao;
        }, function (_viewsNegociacoesView) {
            NegociacoesView = _viewsNegociacoesView.NegociacoesView;
        }, function (_viewsMensagemView) {
            MensagemView = _viewsMensagemView.MensagemView;
        }, function (_servicesNegociacoesService) {
            NegociacoesService = _servicesNegociacoesService.NegociacoesService;
        }, function (_helpersDateHelper) {
            DateHelper = _helpersDateHelper.DateHelper;
        }, function (_helpersBind) {
            Bind = _helpersBind.Bind;
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

            _export('NegociacaoController', NegociacaoController = function () {
                function NegociacaoController() {
                    _classCallCheck(this, NegociacaoController);

                    var $ = document.querySelector.bind(document);
                    this._inputData = $('#data');
                    this._inputQuantidade = $('#quantidade');
                    this._inputValor = $('#valor');
                    this._ordemAtual = ''; // quando a página for carregada, não tem critério. Só passa a ter quando ele começa a clicar nas colunas
                    this._service = new NegociacoesService();
                    // this._listaNegociacoes = new ListaNegociacoes(model => 
                    //     this._negociacoesView.update(model));

                    // Cria-se as listas de negociações onde são automaticamente atualizadas na view
                    this._listaNegociacoes = new Bind(new ListaNegociacoes(), new NegociacoesView($('#negociacoesView')), 'adiciona', 'esvazia', 'ordena', 'inverteOrdem');

                    // this._mensagem = new Mensagem();
                    // this._mensagemView = new MensagemView($('#mensagemView'));
                    this._mensagem = new Bind(new Mensagem(), new MensagemView($('#mensagemView')), 'texto');

                    this._init();
                }

                _createClass(NegociacaoController, [{
                    key: '_init',
                    value: function _init() {
                        var _this = this;

                        // Jeito um pouco complicado, mas funcionando
                        // ConnectionFactory.getConnection()
                        //     .then(connection => {
                        //         new NegociacaoDao(connection)
                        //         .listaTodos()
                        //         .then(negociacoes => {
                        //             negociacoes.forEach(negociacao => {
                        //                 this._listaNegociacoes.adiciona(negociacao);
                        //             })
                        //         })
                        //     });

                        this._service.lista().then(function (negociacoes) {
                            return (// pega o objeto com as negociações e adiciona na lista, o proxy cuida de atualizar na View
                                negociacoes.forEach(function (negociacao) {
                                    return _this._listaNegociacoes.adiciona(negociacao);
                                })
                            );
                        }).catch(function (erro) {
                            return _this._mensagem.texto = erro;
                        });

                        setInterval(function () {
                            _this.importaNegociacoes();
                        }, 3000);
                    }
                }, {
                    key: 'adiciona',
                    value: function adiciona(event) {
                        var _this2 = this;

                        event.preventDefault();

                        var negociacao = this._criaNegociacao();

                        this._service.cadastra(negociacao).then(function (mensagem) {
                            _this2._listaNegociacoes.adiciona(negociacao);
                            _this2._mensagem.texto = mensagem;
                            _this2._limpaFormulario();
                        }).catch(function (erro) {
                            return _this2._mensagem.texto = erro;
                        });
                    }
                }, {
                    key: 'importaNegociacoes',
                    value: function importaNegociacoes() {
                        var _this3 = this;

                        this._service.importa(this._listaNegociacoes.negociacoes).then(function (negociacoes) {
                            negociacoes.forEach(function (negociacao) {
                                return _this3._listaNegociacoes.adiciona(negociacao);
                            });
                            _this3._mensagem.texto = 'Negociações do período importadas com sucesso';
                        }).catch(function (erro) {
                            return _this3._mensagem.texto = erro;
                        });
                    }
                }, {
                    key: 'apaga',
                    value: function apaga() {
                        var _this4 = this;

                        this._service.apaga().then(function (mensagem) {
                            _this4._mensagem.texto = mensagem;
                            _this4._listaNegociacoes.esvazia();
                        });
                    }
                }, {
                    key: 'ordena',
                    value: function ordena(coluna) {
                        if (this._ordemAtual == coluna) {
                            this._listaNegociacoes.inverteOrdem();
                        } else {
                            this._listaNegociacoes.ordena(function (a, b) {
                                return a[coluna] - b[coluna];
                            });
                        }
                        this._ordemAtual = coluna;
                    }
                }, {
                    key: '_criaNegociacao',
                    value: function _criaNegociacao() {

                        return new Negociacao(DateHelper.textoParaData(this._inputData.value), parseInt(this._inputQuantidade.value), parseFloat(this._inputValor.value));
                    }
                }, {
                    key: '_limpaFormulario',
                    value: function _limpaFormulario() {

                        this._inputData.value = '';
                        this._inputQuantidade.value = 1;
                        this._inputValor.value = 0.0;
                        this._inputData.focus();
                    }
                }]);

                return NegociacaoController;
            }());

            _export('NegociacaoController', NegociacaoController);

            negociacaoController = new NegociacaoController();

            // Mostrando aqui que o ES6 também exporta instancias atraves APENAS de uma função!
            function currentInstance() {
                return negociacaoController;
            }

            _export('currentInstance', currentInstance);
        }
    };
});
//# sourceMappingURL=NegociacaoController.js.map