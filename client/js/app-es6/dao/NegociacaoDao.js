import {Negociacao} from '../models/Negociacao';

export class NegociacaoDao {
    constructor(connection) {
        this._connection = connection;
        this._store = 'negociacoes';
    }

    adiciona(negociacao) {
        return new Promise((resolve, reject) => {

            // cria a transação e obtem conexão com o objectStore Negociações
            let request = this._connection // encadeamento
                .transaction([this._store], 'readwrite') // pegar a transação da conexão
                .objectStore(this._store) // pega o objectStore
                .add(negociacao); // adiciona uma Store.

            request.onsuccess = e => {
                // Negociação adicionada com sucesso!
                resolve();
            }

            request.onerror = e => {
                console.log(e.target.error);
                reject('Não foi possível adicionar a negociação!');
            };
        });
    }

    apagaTodos() {
        return new Promise((resolve, reject) => {
            let requestClear = this._connection
            .transaction([this._store], 'readwrite')
            .objectStore(this._store)
            .clear();
            
            requestClear.onsuccess = e => resolve('Negociações Removidas com Sucesso!');
            requestClear.onerror = e => {
                console.log(e.target.error);
                reject('Não foi possível remover as negociações!');
            }    
        });
    }

    listaTodos() {
        return new Promise((resolve, reject) => {

            let cursor = this._connection
                .transaction([this._store], 'readwrite')
                .objectStore(this._store)
                .openCursor();

            // abre o cursor para iterar os dados do Banco
            let negociacoes = [];

            cursor.onsuccess = e => {
                // retorna o ponteiro do primeiro dado do banco
                let atual = e.target.result;

                // se o ponteiro for valido, busca o dado pelo ponteiro e adiciona uma estancia no array
                if (atual) {
                    let dado = atual.value;
                    negociacoes.push(new Negociacao(dado._data, dado._quantidade, dado._valor));

                    // pula para o próximo ponteiro e reexecuta o onsucess!
                    atual.continue();
                } else {
                    // ao final, exibe as negociações!
                    resolve(negociacoes);
                }

            }

            cursor.onerror = e => {
                console.log('Error:' + e.target.error);
                reject('Não foi possível listar as Negociações!');
            };
        });
    }
}