const pokemonContainer = document.getElementById("pokemon-container");
const searchInput = document.getElementById("search-input");
const typeFilter = document.getElementById("type-filter");
const itemsPerPageSelect = document.getElementById("items-per-page");
const paginationContainer = document.getElementById("pagination-container");
const limit = 200; 
let allPokemons = []; 
let filteredPokemons = []; 
let currentPage = 1;
let itemsPerPage = 50;

async function initApp() {
    try {
        showLoading();
        await fetchPokemons();
        setupRealTimeSearch();
    } catch (error) {
        showError("Não foi possível conectar à PokéAPI. Verifique sua conexão com a internet.");
        console.error("Erro na inicialização:", error);
    }
}

function setupRealTimeSearch() {
    searchInput.addEventListener('input', () => {
        currentPage = 1; 
        filterPokemons();
    });
    typeFilter.addEventListener('change', () => {
        currentPage = 1; 
        filterPokemons();
    });
    itemsPerPageSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        itemsPerPage = val === "all" ? filteredPokemons.length : parseInt(val);
        currentPage = 1; 
        renderPaginationDOM();
    });
}

async function fetchPokemons() {
    showLoading();
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
        if (!response.ok) throw new Error("Erro ao carregar dados da API");
        
        const data = await response.json();
        const promises = data.results.map(pokemon => fetch(pokemon.url).then(res => res.json()));
        allPokemons = await Promise.all(promises);
        
        filteredPokemons = [...allPokemons];
        renderPaginationDOM();
    } catch (error) {
        showError("Ocorreu um erro ao carregar os Pokémon. Tente novamente mais tarde.");
        console.error("Erro ao carregar Pokémon:", error);
    }
}

function filterPokemons() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedType = typeFilter.value.toLowerCase();
    
    filteredPokemons = allPokemons.filter(pokemon => {
        const nameMatch = pokemon.name.toLowerCase().includes(searchTerm);
        const typeMatch = !selectedType || pokemon.types.some(type => type.type.name === selectedType);
        return nameMatch && typeMatch;
    });
    
    if (itemsPerPageSelect.value === "all") {
        itemsPerPage = filteredPokemons.length;
    }
    
    renderPaginationDOM();
}

function renderPaginationDOM() {
    pokemonContainer.replaceChildren(); 
    paginationContainer.replaceChildren();
    
    if (filteredPokemons.length === 0) {
        const noResults = document.createElement("div");
        noResults.className = "col-12 text-center";
        noResults.innerHTML = `
            <p class="mt-4">Nenhum Pokémon encontrado com os filtros aplicados.</p>
            <button class="btn btn-primary mt-2" onclick="resetFilters()">
                <i class="fas fa-sync-alt me-2"></i>Limpar filtros
            </button>
        `;
        pokemonContainer.appendChild(noResults);
        return;
    }

    const totalPages = Math.ceil(filteredPokemons.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pokemonsPageChunk = filteredPokemons.slice(startIndex, endIndex);
    
    displayPokemonCards(pokemonsPageChunk);
    
    if (totalPages > 1) {
        buildPaginationButtons(totalPages);
    }
}

function displayPokemonCards(pokemons) {
    pokemons.forEach(pokemon => {
        const col = document.createElement("div");
        col.className = "col";

        const card = document.createElement("div");
        card.className = "card pokemon-card h-100";
        card.addEventListener("click", () => showPokemonDetails(pokemon.id));

        const mainType = pokemon.types[0].type.name;
        card.style.borderTop = `5px solid var(--type-${mainType}, #dc3545)`;

        const cardHeader = document.createElement("div");
        cardHeader.className = "card-header bg-light text-end";
        cardHeader.innerHTML = `<small class="pokemon-id">#${pokemon.id.toString().padStart(3, '0')}</small>`;

        const img = document.createElement("img");
        img.className = "card-img-top";
        img.alt = pokemon.name;
        img.src = pokemon.sprites.other["official-artwork"].front_default || 
                  pokemon.sprites.front_default || 
                  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
        
        const cardBody = document.createElement("div");
        cardBody.className = "card-body";

        const h5 = document.createElement("h5");
        h5.className = "pokemon-name";
        h5.textContent = pokemon.name;
        
        const typesDiv = document.createElement("div");
        typesDiv.className = "mt-2";
        pokemon.types.forEach(type => {
            const badge = document.createElement("span");
            badge.className = `type-badge ${type.type.name}`;
            badge.textContent = type.type.name;
            typesDiv.appendChild(badge);
        });
        
        cardBody.appendChild(h5);
        cardBody.appendChild(typesDiv);
        
        const cardFooter = document.createElement("div");
        cardFooter.className = "card-footer bg-light d-flex justify-content-between";
        cardFooter.innerHTML = `
            <small>HP: ${getPokemonStat(pokemon, 'hp')}</small>
            <small>Velocidade: ${getPokemonStat(pokemon, 'speed')}</small>
        `;
        
        card.append(cardHeader, img, cardBody, cardFooter);
        col.appendChild(card);
        pokemonContainer.appendChild(col);
    });
}

function buildPaginationButtons(totalPages) {
    const prevLi = document.createElement("li");
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" aria-label="Anterior">&laquo;</a>`;
    if (currentPage > 1) {
        prevLi.addEventListener("click", (e) => {
            e.preventDefault();
            currentPage--;
            renderPaginationDOM();
        });
    }
    paginationContainer.appendChild(prevLi);

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement("li");
        li.className = `page-item ${currentPage === i ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        
        li.addEventListener("click", (e) => {
            e.preventDefault();
            currentPage = i;
            renderPaginationDOM();
        });
        paginationContainer.appendChild(li);
    }

    const nextLi = document.createElement("li");
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" aria-label="Próximo">&raquo;</a>`;
    if (currentPage < totalPages) {
        nextLi.addEventListener("click", (e) => {
            e.preventDefault();
            currentPage++;
            renderPaginationDOM();
        });
    }
    paginationContainer.appendChild(nextLi);
}

function getPokemonStat(pokemon, statName) {
    const stat = pokemon.stats.find(s => s.stat.name === statName);
    return stat ? stat.base_stat : 'N/A';
}

function resetFilters() {
    searchInput.value = "";
    typeFilter.value = "";
    itemsPerPageSelect.value = "50";
    itemsPerPage = 50;
    currentPage = 1;
    filteredPokemons = [...allPokemons];

    const modalElement = document.getElementById('pokemonModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
        modalInstance.hide();
    }

    renderPaginationDOM();
}

function showLoading() {
    pokemonContainer.innerHTML = `
        <div class="col-12 text-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Carregando...</span>
            </div>
            <p class="mt-2">Carregando Pokémon...</p>
        </div>
    `;
}

function showError(message) {
    pokemonContainer.innerHTML = `
        <div class="col-12 text-center">
            <div class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-triangle me-2"></i>
                ${message}
            </div>
        </div>
    `;
}

async function showPokemonDetails(id) {
    const modalTitle = document.querySelector(".modal-title");
    const modalId = document.querySelector(".modal-pokemon-id");
    const modalBody = document.getElementById("pokemon-details");
    
    modalTitle.textContent = "";
    modalId.textContent = "";
    modalBody.innerHTML = `
        <div class="text-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Carregando...</span>
            </div>
        </div>
    `;
    
    const modal = new bootstrap.Modal(document.getElementById('pokemonModal'));
    modal.show();
    
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const pokemon = await response.json();
        
        const speciesResponse = await fetch(pokemon.species.url);
        const species = await speciesResponse.json();
        
        let description = "Descrição não disponível.";
        const ptBrDesc = species.flavor_text_entries.find(
            entry => entry.language.name === "pt-br" || entry.language.name === "pt"
        );
        
        if (ptBrDesc) {
            description = ptBrDesc.flavor_text.replace(/\f/g, ' ');
        } else {
            const enDesc = species.flavor_text_entries.find(entry => entry.language.name === "en");
            if (enDesc) {
                description = enDesc.flavor_text.replace(/\f/g, ' ');
            }
        }
        
        modalTitle.textContent = pokemon.name;
        modalId.textContent = `#${pokemon.id.toString().padStart(3, '0')}`;
        
        const types = pokemon.types.map(t => 
            `<span class="type-badge ${t.type.name}">${t.type.name}</span>`
        ).join("");

        const abilities = pokemon.abilities.map(a => 
            `<span class="badge bg-light text-dark me-1">${a.ability.name}</span>`
        ).join("");
        
        modalBody.innerHTML = `
            <div class="row">
                <div class="col-md-12 text-center">
                    <img src="${pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default}" 
                         class="pokemon-image mb-3" alt="${pokemon.name}">
                    <div class="pokemon-types-modal mb-3">${types}</div>
                </div>
                <div class="col-md-6">
                    <div class="card mb-3">
                        <div class="card-header bg-light">Descrição</div>
                        <div class="card-body">
                            <p>${description}</p>
                        </div>
                    </div>
                    <div class="card mb-3">
                        <div class="card-header bg-light">Habilidades</div>
                        <div class="card-body">
                            ${abilities}
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <h5 class="mt-3">Status Base</h5>
                    ${pokemon.stats.map(stat => `
                        <div class="mb-2">
                            <span class="stat-label">${stat.stat.name}</span>
                            <div class="progress">
                                <div class="progress-bar bg-success" role="progressbar" 
                                     style="width: ${Math.min(stat.base_stat, 100)}%" 
                                     aria-valuenow="${stat.base_stat}" aria-valuemin="0" aria-valuemax="200">
                                    ${stat.base_stat}
                                </div>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>
        `;
    } catch (error) {
        modalBody.innerHTML = `
            <div class="alert alert-danger" role="alert">
                Erro ao carregar detalhes do Pokémon. Por favor, tente novamente.
            </div>
        `;
        console.error("Erro ao mostrar detalhes:", error);
    }
}

initApp();