document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('pokemon-container');
    const typeSelector = document.getElementById('type-selector');
    const baseURL = 'https://pokeapi.co/api/v2';
    const pokemonLimit = 1017; // Número total de Pokémon disponibles

    // Función para obtener y mostrar los tipos de Pokémon
    const fetchTypes = async () => {
        try {
            const response = await fetch(`${baseURL}/type`);
            const data = await response.json();
            populateTypeSelector(data.results);
        } catch (error) {
            console.error('Error fetching types:', error);
        }
    };

    // Llenar el selector de tipos con opciones
    const populateTypeSelector = (types) => {
        types.forEach(type => {
            const option = document.createElement('option');
            option.value = type.name;
            option.textContent = type.name.charAt(0).toUpperCase() + type.name.slice(1);
            typeSelector.appendChild(option);
        });
    };

    // Función para obtener y mostrar Pokémon de un tipo específico
    const fetchPokemonsByType = async (type) => {
        try {
            container.innerHTML = ''; // Limpiar el contenedor
            if (!type) {
                return; // No mostrar nada si no se selecciona un tipo
            }
            const response = await fetch(`${baseURL}/type/${type}`);
            const data = await response.json();
            const pokemonList = data.pokemon.map(p => p.pokemon);
            displayPokemons(pokemonList);
        } catch (error) {
            console.error('Error fetching Pokémon by type:', error);
        }
    };

    // Mostrar los Pokémon en el contenedor
    const displayPokemons = async (pokemons) => {
        for (const pokemon of pokemons) {
            const pokemonData = await fetch(pokemon.url).then(res => res.json());
            const pokemonCard = document.createElement('div');
            pokemonCard.classList.add('pokemon-card');

            pokemonCard.innerHTML = `
                <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
                <h2>${pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}</h2>
                <p>Height: ${pokemonData.height / 10} m</p>
                <p>Weight: ${pokemonData.weight / 10} kg</p>
            `;

            container.appendChild(pokemonCard);
        }
    };

    // Inicializar el selector de tipos y manejar cambios
    fetchTypes();
    typeSelector.addEventListener('change', (e) => {
        const selectedType = e.target.value;
        fetchPokemonsByType(selectedType);
    });
});
