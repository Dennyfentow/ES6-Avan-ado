import { View } from './View';
import {DateHelper} from '../helpers/DateHelper';
import { currentInstance } from '../controllers/NegociacaoController';

export class NegociacoesView extends View {
    
    constructor(elemento) {
        super(elemento);
        // utilizando o "event bubbling" do Javascript, onde ao clicar no item, o mesmo irá perguntando a todos os pais para saber quem responde ao
        // evento de click. Quem responderá será a div #negociacoesView (que é objeto 'elemento') instanciada no controller e presente no index.html
        elemento.addEventListener('click', function(event) {
            // se event.target.nodeName for o bloco TH (verificar se estamos clicando em uma th), executar o script abaixo
            if(event.target.nodeName == 'TH') {
                // atravez de uma instancia do controller, executar o ordena e pegar o texto de dentro do bloco, deixa-lo em caixa baixa e passar-lo 
                // como paramentro.
                currentInstance().ordena(event.target.textContent.toLowerCase())
            }
        })

    }
    
    template(model) {
        
        return `
        <table class="table table-hover table-bordered">
            <thead>
                <tr>
                    <th>DATA</th>
                    <th>QUANTIDADE</th>
                    <th>VALOR</th>
                    <th>VOLUME</th>
                </tr>
            </thead>
        
            <tbody>
                ${model.negociacoes.map(n => `
                    
                    <tr>
                        <td>${DateHelper.dataParaTexto(n.data)}</td>
                        <td>${n.quantidade}</td>
                        <td>${n.valor}</td>
                        <td>${n.volume}</td>
                    </tr>
                    
                `).join('')}                
            </tbody>
                  
            <tfoot>
                <td colspan="3"></td>
                <td>
                    ${model.volumeTotal}
                </td>
            </tfoot>
            
        </table>
        `;
    }
}
