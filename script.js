const capacidadeCaixas = {
    "simples": {
        "n1": {
            "com_emenda": { "2.00": 15, "2.50": 15, "3.00": 15, "3.50": 15, "4.00": 15 },
            "sem_emenda": { "1.00": 20, "1.50": 20, "2.00": 20, "2.50": 20, "3.00": 10, "3.50": 10, "4.00": 10 }
        },
        "n2": {
            "com_emenda": { "2.00": 10, "2.50": 10, "3.00": 10, "3.50": 10, "4.00": 10 },
            "sem_emenda": { "1.00": 12, "1.50": 12, "2.00": 12, "2.50": 12, "3.00": 6, "3.50": 6, "4.00": 6 }
        }
    },
    "simples_ecowood": {
        "n1": {
            "com_emenda": { "2.00": 15, "2.50": 15, "3.00": 15, "3.50": 15, "4.00": 15 },
            "sem_emenda": { "1.00": 25, "1.50": 25, "2.00": 25, "2.50": 25, "3.00": 10, "3.50": 10, "4.00": 10 }
        },
        "n2": {
            "com_emenda": { "2.00": 10, "2.50": 10, "3.00": 10, "3.50": 10, "4.00": 10 },
            "sem_emenda": { "1.00": 15, "1.50": 15, "2.00": 15, "2.50": 15, "3.00": 6, "3.50": 6, "4.00": 6 }
        }
    },
    "duplo": {
        "n1": {
            "com_emenda": { "2.00": 10, "2.50": 10, "3.00": 10, "3.50": 10, "4.00": 10 },
            "sem_emenda": { "1.00": 15, "1.50": 15, "2.00": 15, "2.50": 15, "3.00": 8, "3.50": 8, "4.00": 8 }
        },
        "n2": {
            "com_emenda": { "2.00": 6, "2.50": 6, "3.00": 6, "3.50": 6, "4.00": 6 },
            "sem_emenda": { "1.00": 10, "1.50": 10, "2.00": 10, "2.50": 10, "3.00": 5, "3.50": 5, "4.00": 5 }
        }
    },
    "duplo_ecowood": {
        "n1": {
            "com_emenda": { "2.00": 10, "2.50": 10, "3.00": 10, "3.50": 10, "4.00": 10 },
            "sem_emenda": { "1.00": 15, "1.50": 15, "2.00": 15, "2.50": 15, "3.00": 8, "3.50": 8, "4.00": 8 }
        },
        "n2": {
            "com_emenda": { "2.00": 6, "2.50": 6, "3.00": 6, "3.50": 6, "4.00": 6 },
            "sem_emenda": { "1.00": 10, "1.50": 10, "2.00": 10, "2.50": 10, "3.00": 5, "3.50": 5, "4.00": 5 }
        }
    }
};

// criando um array para armazenar os itens que for adicionando
let listaItensPedido = []
let contaLinha = 0;

// função chamada quando se clica no botão ADICIONAR
function adicionarItem() {
    const tipoKit = document.getElementById('tipo').value;
    const medida = document.getElementById('medida').value;
    const quantidade = parseInt(document.getElementById('qtd').value);
    const numeroOriginal = document.querySelector('input[name="numero"]:checked').value;
    const emendaOriginal = document.querySelector('input[name="emenda"]:checked').value;

    if (isNaN(quantidade) || quantidade <= 0) {
        alert("Por favor, informe uma quantidade válida!");
        return;
    }

    const numeroTecnico = "n" + numeroOriginal;
    const emendaTecnica = (emendaOriginal === "sim") ? "com_emenda" : "sem_emenda";

    try {
        const capacidade = capacidadeCaixas[tipoKit][numeroTecnico][emendaTecnica][medida];

        if (capacidade === undefined) {
            throw new Error("Combinação não encontrada");
        }

        const qtdCaixas = quantidade / capacidade;
        
        // --- LOGICA DE SOMA POR CAIXA ---
        // Primeiro, calculamos qual será o tamanho da caixa física
        let tamanhoCaixaFisica = medida;
        if (emendaOriginal === "sim") {
            tamanhoCaixaFisica = (parseFloat(medida) / 2).toFixed(2);
        }

        // O ID agora é apenas o tamanho da caixa. 
        // Ex: Todos os kits que resultarem em 1.50m cairão no mesmo ID.
        const idUnico = tamanhoCaixaFisica;

        const itemExistente = listaItensPedido.find(item => item.id === idUnico);

        if (itemExistente) {
            itemExistente.caixas += qtdCaixas;
        } else {
            listaItensPedido.push({
                id: idUnico,
                medidaCaixa: tamanhoCaixaFisica,
                caixas: qtdCaixas
            });
        }
        contaLinha += 1;
        // Atualiza o parágrafo de feedback (seu "Último Item")
        const campoUltimoItem = document.querySelector('.ultimo_item');
        const campoContaLinha = document.querySelector('.contaLinha');
        campoUltimoItem.textContent = `Último item: ${tipoKit} Nº${numeroOriginal} - ${medida}m (${emendaOriginal === 'sim' ? 'C/' : 'S/'} Emenda)`;
        campoContaLinha.textContent = `Última linha: ${contaLinha}`;
        atualizarInterface();
        document.getElementById('qtd').value = "";

    } catch (error) {
        alert("Essa combinação não existe na tabela!");
        console.error(error);
    }
}

function novoPedido() {
    contaLinha = 0;
    listaItensPedido = [];
    document.querySelector('.resultado').innerHTML = ""; 
    document.getElementById('qtd').value = ""; 
    alert("Pronto para um novo pedido!");
}

function atualizarInterface() {
    const listaHtml = document.querySelector('.resultado');
    listaHtml.innerHTML = "";

    // Ordenar a lista por tamanho de caixa (opcional, mas fica mais profissional)
    listaItensPedido.sort((a, b) => a.medidaCaixa - b.medidaCaixa);

    listaItensPedido.forEach(item => {
        const li = document.createElement('li');
        
        // Agora o texto foca no total de caixas por tamanho
        li.textContent = `${item.caixas} caixa(s) de ${item.medidaCaixa} metros`;
        
        listaHtml.appendChild(li);
    });
}