const API_URL = 'http://localhost:5000';
let livros = [];

document.addEventListener('DOMContentLoaded', () => {
    carregarLivros();
    document.getElementById('form-livro').addEventListener('submit', adicionarLivro);
});

async function carregarLivros() {
    try {
        const response = await fetch(`${API_URL}/listar_livros`);
        livros = await response.json();
        exibirLivros();
    } catch (erro) {
        console.error('Erro ao carregar livros:', erro);
    }
}

function exibirLivros(listaDeLivros = livros) {  
    const container = document.getElementById('livros-list');
    container.innerHTML = '';

    listaDeLivros.forEach(livro => {  
        const livroCard = document.createElement('div');
        livroCard.className = 'livro-card';
        livroCard.innerHTML = `
            <h3>${livro.titulo}</h3>
            <p><strong>Autor:</strong> ${livro.autor}</p>
            <p><strong>Ano:</strong> ${livro.ano_publicacao || 'N/A'}</p>
            <button onclick="removerLivro(${livro.id})">Remover</button>
        `;
        container.appendChild(livroCard);
    });
}

function filtrarLivros() {
    const termo = document.getElementById('busca').value.toLowerCase();
    const livrosFiltrados = livros.filter(livro => 
        livro.titulo.toLowerCase().includes(termo) || 
        livro.autor.toLowerCase().includes(termo) ||
        (livro.ano_publicacao && livro.ano_publicacao.toString().includes(termo))
    );
    exibirLivros(livrosFiltrados);  // 
}

async function adicionarLivro(e) {
    e.preventDefault();
    const titulo = document.getElementById('titulo').value;
    const autor = document.getElementById('autor').value;
    const ano = document.getElementById('ano').value;

    try {
        const response = await fetch(`${API_URL}/adicionar_livro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                titulo,
                autor,
                ano_publicacao: ano || null
            })
        });

        if (response.ok) {
            document.getElementById('form-livro').reset();
            carregarLivros();
        }
    } catch (erro) {
        console.error('Erro ao adicionar livro:', erro);
    }
}

async function removerLivro(id) {
    try {
        const response = await fetch(`${API_URL}/remover_livro/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            carregarLivros();
        }
    } catch (erro) {
        console.error('Erro ao remover livro:', erro);
    }
}

function filtrarLivros() {
    const termo = document.getElementById('busca').value.toLowerCase();
    const livrosFiltrados = livros.filter(livro => 
        livro.titulo.toLowerCase().includes(termo) || 
        livro.autor.toLowerCase().includes(termo)
    );
    exibirLivros(livrosFiltrados); 
}