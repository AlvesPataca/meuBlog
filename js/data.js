// Este arquivo simula um banco de dados ou uma API, guardando os dados dos posts.

const postsData = [
    {
        id: 1,
        title: "Desvendando o CSS Grid Layout",
        author: "Ana Coder",
        publishDate: "2025-09-15",
        tags: ["CSS", "Frontend", "Web Design"],
        imageUrl: `https://picsum.photos/800/400?random=1`,
        content: `
            <p>O CSS Grid Layout é uma das ferramentas mais poderosas do CSS moderno. Ele nos permite criar layouts complexos e responsivos com uma sintaxe surpreendentemente simples.</p>
            <h3>Por que usar Grid?</h3>
            <p>Ao contrário do Flexbox, que é unidimensional (linha ou coluna), o Grid é bidimensional. Isso significa que você pode alinhar elementos em linhas e colunas simultaneamente, abrindo um leque de possibilidades.</p>
            <blockquote>"Com grandes poderes vêm grandes responsabilidades." - E com Grid, vem um grande poder de layout.</blockquote>
            <p>Neste post, vamos explorar desde os conceitos básicos como <code>grid-template-columns</code> e <code>grid-gap</code> até técnicas mais avançadas como <code>grid-area</code> para criar layouts semânticos e fáceis de manter.</p>
        `
    },
    {
        id: 2,
        title: "JavaScript Assíncrono: Promises e Async/Await",
        author: "Beto Scripter",
        publishDate: "2025-09-12",
        tags: ["JavaScript", "Frontend", "Backend"],
        imageUrl: `https://picsum.photos/800/400?random=2`,
        content: `
            <p>Lidar com operações assíncronas é um desafio comum em JavaScript, especialmente ao fazer requisições a APIs ou ler arquivos. Antigamente, isso levava ao infame "Callback Hell".</p>
            <h3>A Evolução: Promises</h3>
            <p>Promises introduziram uma forma mais limpa e legível de lidar com código assíncrono. Um objeto Promise representa a eventual conclusão (ou falha) de uma operação.</p>
            <h3>A Sintaxe Moderna: Async/Await</h3>
            <p>Construído sobre Promises, <code>async/await</code> nos permite escrever código assíncrono que se parece e se comporta como código síncrono, tornando-o muito mais intuitivo. Vamos ver exemplos práticos de como refatorar código de Promises para usar essa sintaxe elegante.</p>
        `
    },
    {
        id: 3,
        title: "O Guia Definitivo de Acessibilidade Web (WCAG)",
        author: "Clara Dev",
        publishDate: "2025-09-10",
        tags: ["Acessibilidade", "HTML", "Boas Práticas"],
        imageUrl: `https://picsum.photos/800/400?random=3`,
        content: `<p>Acessibilidade não é um recurso extra, é um requisito fundamental. Garantir que seu site possa ser usado por todos, incluindo pessoas com deficiências, é nossa responsabilidade como desenvolvedores.</p><p>Neste guia, vamos cobrir os pilares do WCAG (Web Content Accessibility Guidelines) e mostrar como aplicar técnicas simples de HTML semântico, contraste de cores e navegação por teclado para criar uma web mais inclusiva.</p>`
    },
    {
        id: 4,
        title: "Construindo um Backend com Node.js e Express",
        author: "Davi Server",
        publishDate: "2025-09-08",
        tags: ["Node.js", "Backend", "JavaScript"],
        imageUrl: `https://picsum.photos/800/400?random=4`,
        content: `<p>Node.js revolucionou o desenvolvimento backend ao permitir que desenvolvedores usassem JavaScript no lado do servidor. Combinado com o framework Express, criar APIs RESTful se torna uma tarefa rápida e organizada.</p><p>Vamos criar um servidor do zero, definir rotas, lidar com requisições HTTP e conectar a um banco de dados simulado. Ao final, você terá uma base sólida para construir suas próprias aplicações backend.</p>`
    }
];

// Gerar mais posts para o exemplo
for (let i = 5; i <= 20; i++) {
    postsData.push({
        id: i,
        title: `Tópico Avançado em Web Dev ${i}`,
        author: `Autor ${i}`,
        publishDate: `2025-08-${25 - i}`,
        tags: ["JavaScript", "Boas Práticas", "Frontend"],
        imageUrl: `https://picsum.photos/800/400?random=${i}`,
        content: `<p>Este é o conteúdo detalhado do post número ${i}, explorando um tópico avançado sobre desenvolvimento web. A discussão aqui é aprofundada para oferecer insights valiosos.</p><blockquote>Aprender continuamente é a chave para o sucesso no mundo da tecnologia.</blockquote><p>Continuamos a análise com exemplos práticos e snippets de código para facilitar a compreensão.</p>`
    });
}
