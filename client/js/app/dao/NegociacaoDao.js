'use strict';

System.register(['../models/Negociacao'], function (_export, _context) {
    "use strict";

    var Negociacao, _createClass, NegociacaoDao;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_modelsNegociacao) {
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

            _export('NegociacaoDao', NegociacaoDao = function () {
                function NegociacaoDao(connection) {
                    _classCallCheck(this, NegociacaoDao);

                    this._connection = connection;
                    this._store = 'negociacoes';
                }

                _createClass(NegociacaoDao, [{
                    key: 'adiciona',
                    value: function adiciona(negociacao) {
                        var _this = this;

                        return new Promise(function (resolve, reject) {

                            // cria a transação e obtem conexão com o objectStore Negociações
                            var request = _this._connection // encadeamento
                            .transaction([_this._store], 'readwrite') // pegar a transação da conexão
                            .objectStore(_this._store) // pega o objectStore
                            .add(negociacao); // adiciona uma Store.

                            request.onsuccess = function (e) {
                                // Negociação adicionada com sucesso!
                                resolve();
                            };

                            request.onerror = function (e) {
                                console.log(e.target.error);
                                reject('Não foi possível adicionar a negociação!');
                            };
                        });
                    }
                }, {
                    key: 'apagaTodos',
                    value: function apagaTodos() {
                        var _this2 = this;

                        return new Promise(function (resolve, reject) {
                            var requestClear = _this2._connection.transaction([_this2._store], 'readwrite').objectStore(_this2._store).clear();

                            requestClear.onsuccess = function (e) {
                                return resolve('Negociações Removidas com Sucesso!');
                            };
                            requestClear.onerror = function (e) {
                                console.log(e.target.error);
                                reject('Não foi possível remover as negociações!');
                            };
                        });
                    }
                }, {
                    key: 'listaTodos',
                    value: function listaTodos() {
                        var _this3 = this;

                        return new Promise(function (resolve, reject) {

                            var cursor = _this3._connection.transaction([_this3._store], 'readwrite').objectStore(_this3._store).openCursor();

                            // abre o cursor para iterar os dados do Banco
                            var negociacoes = [];

                            cursor.onsuccess = function (e) {
                                // retorna o ponteiro do primeiro dado do banco
                                var atual = e.target.result;

                                // se o ponteiro for valido, busca o dado pelo ponteiro e adiciona uma estancia no array
                                if (atual) {
                                    var dado = atual.value;
                                    negociacoes.push(new Negociacao(dado._data, dado._quantidade, dado._valor));

                                    // pula para o próximo ponteiro e reexecuta o onsucess!
                                    atual.continue();
                                } else {
                                    // ao final, exibe as negociações!
                                    resolve(negociacoes);
                                }
                            };

                            cursor.onerror = function (e) {
                                console.log('Error:' + e.target.error);
                                reject('Não foi possível listar as Negociações!');
                            };
                        });
                    }
                }]);

                return NegociacaoDao;
            }());

            _export('NegociacaoDao', NegociacaoDao);
        }
    };
});
//# sourceMappingURL=NegociacaoDao.js.map