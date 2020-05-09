export class ProxyFactory {
    static create(objeto, props, acao) {
        return new Proxy(objeto, {
            // Ao dar o get em uma propriedade de um objeto (que também pode ser uma função), é executado o método get abaixo
            get(target, prop, receiver) {
                // caso o objeto tenha a propriedade invocada nas 'props', passadas na criação da próxy,
                // e a mesma seja uma função, executar este método(propriedade) invocado, além de dar o update na view com o método no Bind,
                // que seria o parâmentro 'acao' com o argumento da model(target)
                if (props.includes(prop) && ProxyFactory._ehFuncao(target[prop])) {

                    return function () {
                        console.log(`método '${prop}' interceptado`);
                        // pega a proprieadade da model, a model, e os argumentos da propriedade e executam o método no contexto da model(target)
                        let retorno = Reflect.apply(target[prop], target, arguments);
                        // executa o update da view passando a model
                        acao(target);
                        // retorna o método perfeitamente configurado, que será executado normalmente com seu contexto model(target)
                        // a diferença é que foi executado o view.update(model) para atualizar a view automaticamente, além de exibir algo no console
                        return retorno;
                    }
                }
                return Reflect.get(target, prop, receiver);
            },

            set(target, prop, value, receiver) {
                let retorno = Reflect.set(target, prop, value, receiver);
                if(props.includes(prop)) acao(target);    // só executa acao(target) se for uma propriedade monitorada
                return retorno; 
                
            }
        })
    }

    static _ehFuncao(func) {

        return typeof(func) == typeof(Function);
    
    }
}