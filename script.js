// Inicializando variáveis para armazenar os totais de entradas, saídas e o saldo.
let saldo = 0;
let totalEntradas = 0;
let totalSaidas = 0;
let transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];

// Configuração da paginação
const transacoesPorPagina = 10;
let paginaAtual = 1;
let transacoesFiltradas = [];

// Pegando os elementos da página onde os totais e transações serão exibidos
const saldoElemento = document.getElementById('saldo');
const totalEntradasElemento = document.getElementById('total-entradas');
const totalSaidasElemento = document.getElementById('total-saidas');
const listaHistorico = document.getElementById('lista-historico');
const filtroHistorico = document.getElementById('filtro-historico');
const paginacao = document.getElementById('paginacao');
const limparHistoricoBtn = document.getElementById('limpar-historico');
const limparHistoricoBt = document.getElementById('limpar-tudo');

// Função para formatar a data no formato dd/mm/aa
function formatarData(dataISO) {
    if (!dataISO) return "";
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano.slice(-2)}`;
}

// Função para adicionar uma nova transação
function adicionarTransacao(event) {
    event.preventDefault();

    const descricao = document.getElementById('descricao').value.trim();
    const valor = parseFloat(document.getElementById('valor').value);
    const tipo = document.getElementById('tipo').value;
    const categoria = document.getElementById('categoria').value;
    const data = new Date().toISOString().split('T')[0];

    if (!descricao || isNaN(valor) || valor <= 0) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    const transacao = { descricao, valor, tipo, categoria, data };
    transacoes.push(transacao);
    localStorage.setItem('transacoes', JSON.stringify(transacoes));

    atualizarInterface();
    limparFormulario(); // Chamando a função para limpar os campos do formulário
}

// Função para limpar o formulário após uma transação ser adicionada
function limparFormulario() {
    document.getElementById('descricao').value = '';
    document.getElementById('valor').value = '';
    document.getElementById('tipo').value = 'entrada'; // Resetando o tipo para "entrada"
    document.getElementById('categoria').value = 'servicos_cabelo'; // Resetando a categoria para a primeira opção
}

// Função para atualizar a interface com os totais
function atualizarInterface() {
    saldo = 0;
    totalEntradas = 0;
    totalSaidas = 0;

    transacoes.forEach(transacao => {
        if (transacao.tipo === 'entrada') {
            totalEntradas += transacao.valor;
            saldo += transacao.valor;
        } else {
            totalSaidas += transacao.valor;
            saldo -= transacao.valor;
        }
    });

    totalEntradasElemento.textContent = totalEntradas.toFixed(2);
    totalSaidasElemento.textContent = totalSaidas.toFixed(2);
    saldoElemento.textContent = saldo.toFixed(2);
    atualizarHistorico();
}

// Função para atualizar o histórico com paginação
function atualizarHistorico() {
    listaHistorico.innerHTML = '';
    paginacao.innerHTML = '';

    const inicio = (paginaAtual - 1) * transacoesPorPagina;
    const fim = inicio + transacoesPorPagina;
    const transacoesPaginadas = transacoes.slice().reverse().slice(inicio, fim);

    transacoesPaginadas.forEach(transacao => {
        const li = document.createElement('li');
        li.textContent = `${formatarData(transacao.data)} - ${transacao.descricao} - R$ ${transacao.valor.toFixed(2)} - ${transacao.categoria}`;
        li.classList.add(transacao.tipo);
        listaHistorico.appendChild(li);
    });

    const totalPaginas = Math.ceil(transacoes.length / transacoesPorPagina);
    for (let i = 1; i <= totalPaginas; i++) {
        const botao = document.createElement('button');
        botao.textContent = i;
        if (i === paginaAtual) {
            botao.classList.add('ativo');
        }
        botao.addEventListener('click', () => {
            paginaAtual = i;
            atualizarHistorico();
        });
        paginacao.appendChild(botao);
    }
}

// Filtro do histórico
filtroHistorico.addEventListener('input', function () {
    const filtro = filtroHistorico.value;
    paginaAtual = 1;
    transacoesFiltradas = transacoes.filter(transacao => transacao.data === filtro);
    atualizarHistorico();
});

// Limpar histórico
limparHistoricoBtn.addEventListener('click', function () {
    const filtro = filtroHistorico.value;
    transacoes = transacoes.filter(transacao => transacao.data !== filtro);
    localStorage.setItem('transacoes', JSON.stringify(transacoes));
    atualizarHistorico();
});

// Limpar todo o histórico
limparHistoricoBt.addEventListener('click', function () {
    transacoes = [];
    localStorage.removeItem('transacoes');
    atualizarHistorico();
});

// Atualizar a interface assim que a página carregar
atualizarInterface();
