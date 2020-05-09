// Module Pattern da Classe Connection Factory transformando todo o código em um módulo,
//  de modo a permitir o retorno da mesma conexão na variavel connection
// var ConnectionFactory = (function () { // CASO EU DESEJASSE UTILIZAR UM MODULE PATTERN GLOBAL COM O VAR

let stores = ['negociacoes'];
let version = 4;
let dbName = 'aluraframe';
let connection = null; // permissão do retorno da mesma conexão sempre
let close = null;

export class ConnectionFactory {
    constructor() {
        throw new Error('Não é possível criar uma instancia de ConnectionFactory');
    }
    static getConnection() {
        return new Promise((resolve, reject) => {
            let openRequest = window.indexedDB.open(dbName, version);

            openRequest.onupgradeneeded = e => {
                ConnectionFactory._createStores(e.target.result);
            };

            openRequest.onsuccess = e => {
                if (!connection) {
                    connection = e.target.result;
                    // close = connection.close.bind(connection);
                    close = connection.close; // usando o Reflect.apply
                    connection.close = function () {
                        throw new Error('Você não pode fechar diretamente a conexão!');
                    }
                }
                resolve(connection);
            };

            openRequest.onerror = e => {
                console.log(e.target.error);

                reject(e.target.error.name);
            };
        })
    }

    static _createStores(connection) {
        stores.forEach(store => {

            if (connection.objectStoreNames.contains(store))
                connection.deleteObjectStore(store);

            connection.createObjectStore(store, { autoIncrement: true });
        });

    }

    static closeConnection() {
        if (connection) {
            // close(); // usar este por ja estar usando o método 'bind'
            Reflect.apply(close, connection, []); // executar o método close com o Reflect.Apply para sobrepor contexto
            connection = null;
        }
    }
}
