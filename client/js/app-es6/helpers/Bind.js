import {ProxyFactory} from '../services/ProxyFactory';

export class Bind {
    constructor(model, view, ...props) {
        // Criando o Proxy, que seria um objeto que se auto atualiza executando o método do terceiro parâmento!
        let proxy = ProxyFactory.create(model, props, model => view.update(model));
        view.update(model);

        return proxy;
    }
}