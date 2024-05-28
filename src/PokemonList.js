import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PokemonCard from './PokemonCard'; // Import the PokemonCard component
import './PokemonList.css'; // Import the CSS for styling

const PokemonList = ({ allPokemon, searchTerm, currentPage, itemsPerPage, totalPokemonCount, onSearch, onPageChange }) => {
    const [displayedPokemon, setDisplayedPokemon] = useState([]);

    // Fetch displayed Pokemon whenever search, page, or allPokemon changes
    useEffect(() => {
        fetchDisplayedPokemon();
    }, [currentPage, searchTerm, allPokemon]);

    // Fetch displayed Pokemon based on search and pagination
    const fetchDisplayedPokemon = async () => {
        try {
            const filteredPokemon = allPokemon.filter(pokemon =>
                pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
            );

            const offset = (currentPage - 1) * itemsPerPage;
            const paginatedPokemon = filteredPokemon.slice(offset, offset + itemsPerPage);

            const pokemonData = await Promise.all(paginatedPokemon.map(async (pokemon) => {
                const pokeDetails = await axios.get(pokemon.url);
                return pokeDetails.data;
            }));

            setDisplayedPokemon(pokemonData);
        } catch (error) {
            console.error('Error fetching displayed Pokemon:', error);
        }
    };

    return (
        <>
            {displayedPokemon.map(pokemon => (
                <PokemonCard
                    key={pokemon.id}
                    pokemon={pokemon}
                />
            ))}
            <div className="pagination">
                {/* Pagination logic here */}
            </div>
        </>
    );
};

export default PokemonList;
