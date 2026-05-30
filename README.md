# Poké Universe 

> **Projeto acadêmico desenvolvido para a disciplina de Web Programming Front End (2025/2026).**

O **Poké Universe** é uma aplicação web interativa e responsiva baseada no universo Pokémon. O objetivo principal do projeto foi explorar o desenvolvimento Front-End moderno utilizando apenas **JavaScript Nativo (Vanilla JS)** para realizar o consumo assíncrono de dados em tempo real através da **PokéAPI**.

---

## Funcionalidades

* **Renderização 100% Dinâmica:** Cards gerados em tempo real na memória do navegador utilizando manipulação avançada do DOM (evitando o uso massivo de `innerHTML` por questões de performance e segurança).
* **Consumo Assíncrono:** Integração com a [PokéAPI](https://pokeapi.co/) via `fetch` e `async/await`.
* **Carregamento Otimizado:** Uso de `Promise.all()` para agrupar requisições paralelas de detalhes e imagens de alta definição (`official-artwork`).
* **Busca em Tempo Real:** Filtro instantâneo por nome conforme o usuário digita.
* **Filtro por Tipo:** Seleção dinâmica que exibe apenas Pokémon de categorias específicas (Fogo, Água, Grama, etc.).
* **Paginação Customizada:** Controle de paginação configurável (20, 50, 100 itens ou ver todos) para limitar e gerenciar o volume de dados na tela.
* **Modal de Detalhes:** Ao clicar em um card, um modal do Bootstrap exibe informações detalhadas do Pokémon, incluindo barras de status base, habilidades e a descrição oficial traduzida para português (PT-BR).

---

## Tecnologias Utilizadas

* **HTML5:** Estruturação semântica da página.
* **CSS3 Customizado:** Estilização com variáveis CSS (`--type-color`) para adaptar as cores dos cards e badges de acordo com o elemento do Pokémon.
* **Bootstrap 5.3:** Framework de CSS utilizado para garantir a responsividade (Grid System) e componentes de interface (Cards, Modals e Spinners).
* **FontAwesome 6.3:** Iconografia do projeto.
* **JavaScript (ES6+ / Vanilla JS):** Lógica de programação pura, sem dependência de frameworks externos (como React ou Vue).

---

## Técnicas de Performance Implementadas

De acordo com as boas práticas de desenvolvimento web aplicadas no projeto, destacam-se:

* **`document.createElement()` & `append()`:** Criação estruturada de nós na árvore do DOM antes de injetá-los na tela, reduzindo o *reflow* do navegador.
* **`replaceChildren()`:** Utilizado na paginação e nos filtros para limpar o container de forma extremamente rápida diretamente da memória, substituindo o tradicional e mais pesado `innerHTML = ""`.
* **Controle de Requisições:** Busca inicial intencionalmente limitada a 200 registros (`?limit=200`) para respeitar as boas práticas da API e garantir uma usabilidade fluida.

---

## Como Executar o Projeto

Como o projeto foi desenvolvido em JavaScript puro, você não precisa instalar nenhuma dependência de servidor (como Node.js). 

1. Clone este repositório ou baixe os arquivos:
   ```
   git clone https://github.com/AdrianoMoura618/Web-Front


2. Navegue até a pasta do projeto.
3. Abra o arquivo `home.html` diretamente em qualquer navegador web (Chrome, Edge, Firefox, Safari) ou utilize uma extensão como a **Live Server** no VS Code para rodar localmente.

---

## Estrutura de Arquivos

```text
├── home.html        # Estrutura HTML principal da aplicação e do Modal.
├── estilo.css       # Estilizações customizadas e variáveis de cores dos tipos.
├── script.js        # Lógica de consumo da API, filtros, paginação e manipulação do DOM.
└── README.md        # Documentação do projeto.
└── Relatório - Web  # Relatório/Parte Teórica
```

---

## Link do Vídeo de Demonstração

https://youtu.be/-9FAbz4W6ZE?si=EewskgUFM-Co8dg6
