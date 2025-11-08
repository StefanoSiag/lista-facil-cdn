

function adicionarItem() {

    const produto = document.getElementById("produto").value;

    const quantidade = parseInt(document.getElementById("quantidade").value);

    const valorUn = parseFloat(document.getElementById("valorUn").value);

    const total = (quantidade * valorUn).toFixed(2);


    const tabela = document.querySelector("#tabela tbody");

    const linha = document.createElement("tr");


    linha.innerHTML = `

  <td>${produto}</td>

  <td>${quantidade}</td>

  <td>R$ ${valorUn.toFixed(2)}</td>

  <td>R$ ${total}</td>

  <td><button onclick="removerItem(this)">Remover</button></td>

  `;


    tabela.appendChild(linha);

    atualizarTotal();

}


function removerItem(botao) {

    botao.closest("tr").remove();

    atualizarTotal();

}


function atualizarTotal() {

    const linhas = document.querySelectorAll("#tabela tbody tr");

    let totalGeral = 0;


    linhas.forEach(linha => {

        const valor = parseFloat(linha.cells[3].textContent.replace("R$ ", "").replace(",", "."));

        totalGeral += valor;

    });


    document.getElementById("totalGeral").textContent = `Total: R$ ${totalGeral.toFixed(2)}`;

}

//---------

// Carrega os itens salvos ao abrir a página

window.onload = function () {

    const dadosSalvos = localStorage.getItem("listaCompras");

    if (dadosSalvos) {

        const itens = JSON.parse(dadosSalvos);

        itens.forEach(item => adicionarLinha(item));

        atualizarTotal();

    }

};


function adicionarItem() {

    const produto = document.getElementById("produto").value;

    const quantidade = parseInt(document.getElementById("quantidade").value);

    const valorUn = parseFloat(document.getElementById("valorUn").value);

    const total = (quantidade * valorUn).toFixed(2);


    const item = { produto, quantidade, valorUn, total };

    adicionarLinha(item);

    salvarItem(item);

    atualizarTotal();

}


function adicionarLinha(item) {

    const tabela = document.querySelector("#tabela tbody");

    const linha = document.createElement("tr");


    linha.innerHTML = `

  <td>${item.produto}</td>

  <td>${item.quantidade}</td>

  <td>R$ ${item.valorUn.toFixed(2)}</td>

  <td>R$ ${item.total}</td>

  <td><button class="btn btn-danger" onclick="removerItem(this)">Remover</button></td>

  `;


    tabela.appendChild(linha);

}


function salvarItem(novoItem) {

    const dadosSalvos = localStorage.getItem("listaCompras");

    const lista = dadosSalvos ? JSON.parse(dadosSalvos) : [];

    lista.push(novoItem);

    localStorage.setItem("listaCompras", JSON.stringify(lista));

}


function removerItem(botao) {

    const linha = botao.closest("tr");

    const produto = linha.cells[0].textContent;

    const quantidade = parseInt(linha.cells[1].textContent);

    const valorUn = parseFloat(linha.cells[2].textContent.replace("R$ ", "").replace(",", "."));


    linha.remove();

    atualizarTotal();


    // Atualiza o localStorage removendo o item

    const dadosSalvos = localStorage.getItem("listaCompras");

    let lista = dadosSalvos ? JSON.parse(dadosSalvos) : [];

    lista = lista.filter(item => !(item.produto === produto && item.quantidade === quantidade && item.valorUn ===
        valorUn));

    localStorage.setItem("listaCompras", JSON.stringify(lista));

}


function atualizarTotal() {

    const linhas = document.querySelectorAll("#tabela tbody tr");

    let totalGeral = 0;


    linhas.forEach(linha => {

        const valor = parseFloat(linha.cells[3].textContent.replace("R$ ", "").replace(",", "."));

        totalGeral += valor;

    });


    document.getElementById("totalGeral").textContent = `Total: R$ ${totalGeral.toFixed(2)}`;

}

// function lerImagem(input) {
//     const imagem = input.files[0];
//     if (!imagem) return;

//     Tesseract.recognize(imagem, 'por', {
//         logger: m => console.log(m)
//     }).then(({ data: { text } }) => {
//         console.log("Texto original extraído:", text);

//         // Normaliza e limpa o texto
//         let textoLimpo = text
//             .replace(/[^\d,.\n]/g, '')    // remove letras e símbolos desnecessários
//             .replace(/\s+/g, ' ')         // normaliza espaços
//             .trim();

//         console.log("Texto limpo:", textoLimpo);

//         // Procura padrões de preços comuns: 9,99 / 12.90 / R$ 3,50 / etc.
//         const regexPreco = /(?:\d{1,3}(?:[\.,]\d{3})*[\.,]\d{2})/g;
//         const encontrados = textoLimpo.match(regexPreco);

//         if (encontrados && encontrados.length > 0) {
//             // Converte o primeiro valor encontrado em número válido
//             const precoBruto = encontrados[0]
//                 .replace(/\./g, '')  // remove separadores de milhar
//                 .replace(',', '.');  // converte vírgula para ponto

//             const valorNumerico = parseFloat(precoBruto);

//             if (!isNaN(valorNumerico)) {
//                 document.getElementById("valorUn").value = valorNumerico.toFixed(2);
//                 console.log("Valor reconhecido:", valorNumerico);
//                 return;
//             }
//         }

//         alert("Não foi possível identificar corretamente o valor na imagem.");

//     }).catch(err => {
//         console.error("Erro no OCR:", err);
//         alert("Erro ao processar a imagem.");
//     });
// }

function lerImagem(input) {
    const imagem = input.files[0];
    if (!imagem) return;

    Tesseract.recognize(imagem, 'por', {
        logger: m => console.log(m) // opcional: mostra progresso no console
    }).then(({ data: { text } }) => {
        console.log("Texto extraído:", text); // debug

        // Tenta encontrar um valor numérico no texto
        const match = text.match(/(\d+[,\.]?\d{0,2})/);
        if (match) {
            const valor = match[1].replace(",", ".");
            document.getElementById("valorUn").value = parseFloat(valor).toFixed(2);
        } else {
            alert("Não foi possível identificar o valor na imagem.");
        }
    }).catch(err => {
        console.error("Erro no OCR:", err);
        alert("Erro ao processar a imagem.");
    });
} 