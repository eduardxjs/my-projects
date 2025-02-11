// Inicializando variáveis para armazenar os totais de entradas, saídas e o saldo
let saldo = 0;
let totalEntradas = 0;
let totalSaidas = 0;
let transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];

// Configuração da paginação
const transacoesPorPagina = 10;
let paginaAtual = 1;
let transacoesFiltradas = [];

// Pegando os elementos da página onde os totais e transações serão exibidos
const relatorio = document.getElementById('relatorio');
const saldoElemento = document.getElementById('saldo');
const totalEntradasElemento = document.getElementById('total-entradas');
const totalSaidasElemento = document.getElementById('total-saidas');
const listaHistorico = document.getElementById('lista-historico');
const filtroHistorico = document.getElementById('filtro-historico');
const paginacao = document.getElementById('paginacao');
const limparHistoricoBtn = document.getElementById('limpar-historico');

// Função para formatar a data no formato dd/mm/aa
function formatarData(dataISO) {
    if (!dataISO) return "";
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano.slice(-2)}`;
}

// Função para adicionar uma nova transacao
function adicionarTransacao() {
    const descricao = document.getElementById('descricao').value.trim();
    const valor = parseFloat(document.getElementById('valor').value);
    const tipo = document.getElementById('tipo').value;
    const categoria = document.getElementById('categoria').value;
    const data = new Date().toISOString().split('T')[0]; // Mantendo o formato aaaa-mm-dd

    if (!descricao || isNaN(valor) || valor <= 0) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    const transacao = { descricao, valor, tipo, categoria, data };
    transacoes.push(transacao);
    localStorage.setItem('transacoes', JSON.stringify(transacoes));

    atualizarInterface();
    limparFormulario();
}

// Função para atualizar a interface
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
}

// Função para limpar o formulário
function limparFormulario() {
    document.getElementById('descricao').value = '';
    document.getElementById('valor').value = '';
    document.getElementById('categoria').value = '';
    document.getElementById('tipo').value = 'entrada';
    document.getElementById('descricao').focus();
}

// Função para atualizar o histórico com paginação
function atualizarHistorico() {
    listaHistorico.innerHTML = '';
    paginacao.innerHTML = '';
    
    const inicio = (paginaAtual - 1) * transacoesPorPagina;
    const fim = inicio + transacoesPorPagina;
    const transacoesPaginadas = transacoesFiltradas.slice().reverse().slice(inicio, fim);

    transacoesPaginadas.forEach(transacao => {
        if (!transacao.data) return;
        const li = document.createElement('li');
        li.textContent = `${formatarData(transacao.data)} - ${transacao.descricao} - R$ ${transacao.valor.toFixed(2)} - ${transacao.categoria}`;
        li.classList.add(transacao.tipo);
        listaHistorico.appendChild(li);
    });

    const totalPaginas = Math.ceil(transacoesFiltradas.length / transacoesPorPagina);
    if (totalPaginas > 1) {
        const paginacaoContainer = document.createElement('div');
        paginacaoContainer.classList.add('paginacao-container');
        
        for (let i = 1; i <= totalPaginas; i++) {
            const botao = document.createElement('button');
            botao.textContent = i;
            botao.classList.add('pagina-botao');
            if (i === paginaAtual) {
                botao.classList.add('ativo');
            }
            botao.addEventListener('click', () => {
                paginaAtual = i;
                atualizarHistorico();
            });
            paginacaoContainer.appendChild(botao);
        }
        paginacao.appendChild(paginacaoContainer);
    }
}

// Função para filtrar histórico por data
filtroHistorico.addEventListener('input', function() {
    const filtro = filtroHistorico.value;
    paginaAtual = 1;
    transacoesFiltradas = transacoes.filter(transacao => transacao.data && transacao.data === filtro);
    atualizarHistorico();
});

// Função para limpar apenas o histórico filtrado
limparHistoricoBtn.addEventListener('click', function() {
    const filtro = filtroHistorico.value;
    if (!filtro) {
        alert("Por favor, selecione uma data para limpar os registros filtrados.");
        return;
    }
    transacoes = transacoes.filter(transacao => transacao.data !== filtro);
    localStorage.setItem('transacoes', JSON.stringify(transacoes));
    atualizarHistorico();
});

// Carregar transações do armazenamento local ao iniciar a página
window.onload = function () {
    atualizarInterface();
};
