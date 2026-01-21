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

// função chamada quando se clica no botão ADICIONAR
function adicionarItem() {
    // obtendo os valores de entrada
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
        
        const descricaoItem = `${tipoKit} Nº${numeroOriginal} ${emendaOriginal === 'sim' ? 'C/' : 'S/'} Emenda`;
        const idUnico = `${descricaoItem}-${medida}`;

        const itemExistente = listaItensPedido.find(item => item.id === idUnico);

        if (itemExistente) {
            itemExistente.caixas += qtdCaixas;
        } else {
            listaItensPedido.push({
                id: idUnico,
                descricao: descricaoItem,
                medida: medida,
                caixas: qtdCaixas
            });
        }

        console.log("Lista atualizada:", listaItensPedido);
        atualizarInterface();

        const campoUltimoItem = document.querySelector('.ultimo_item');
        campoUltimoItem.textContent = `Último item: ${tipoKit} Nº${numeroOriginal} - ${medida}m (${emendaOriginal === 'sim' ? 'Com' : 'Sem'} Emenda)`;
        
        document.getElementById('qtd').value = "";

    } catch (error) {
        alert("Essa combinação de kit/medida/emenda não existe na tabela!");
        console.error("Erro na busca:", tipoKit, numeroTecnico, emendaTecnica, medida);
    }
}

function novoPedido() {
    listaItensPedido = [];
    document.querySelector('.resultado').innerHTML = ""; 
    document.getElementById('qtd').value = ""; 
    alert("Pronto para um novo pedido!");
}

function atualizarInterface() {
    const listaHtml = document.querySelector('.resultado');
    listaHtml.innerHTML = "";

    listaItensPedido.forEach(item => {
        const li = document.createElement('li');
        
        let medidaExibicao = item.medida;
        if (item.descricao.includes("C/ Emenda")) {
            medidaExibicao = (parseFloat(item.medida) / 2).toFixed(2);
        }

        li.textContent = `${item.caixas} caixa(s) de ${medidaExibicao}m`;
        
        listaHtml.appendChild(li);
    });
}