import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PokemonCard from './Components/PokemonCard/PokemonCard';
import PokemonModal from './Components/PokemonModal/PokemonModal';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom'
import './App.css';

const App = () => {
    const [allPokemon, setAllPokemon] = useState([]);
    const [displayedPokemon, setDisplayedPokemon] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPokemonCount, setTotalPokemonCount] = useState(0);
    const [loading, isLoading] = useState(true)
    const itemsPerPage = 20;

    // Fetch all Pokemon on component mount
    useEffect(() => {
        fetchAllPokemon();
    }, []);

    // Fetch displayed Pokemon whenever search, page, or allPokemon changes
    useEffect(() => {
        fetchDisplayedPokemon();
    }, [currentPage, searchTerm, allPokemon]);

    // Fetch all Pokemon from the API
    const fetchAllPokemon = async () => {
        try {
            const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=2000');
            setAllPokemon(response.data.results);
            setTotalPokemonCount(response.data.results.length);
            isLoading(false)
        } catch (error) {
            console.error('Error fetching Pokemon:', error);
        }
    };

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
            setTotalPokemonCount(filteredPokemon.length);
        } catch (error) {
            console.error('Error fetching displayed Pokemon:', error);
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset to the first page on search
    };

    const handleCardClick = (pokemon) => {
        setSelectedPokemon(pokemon);
    };

    const handleCloseModal = () => {
        setSelectedPokemon(null);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Render page numbers for pagination
    const renderPageNumbers = () => {
        const totalPages = Math.ceil(totalPokemonCount / itemsPerPage);
        const pageNumbers = [];

        if (totalPages <= 6) {
            // Show all page numbers if there are 6 or fewer pages
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(
                    <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={currentPage === i ? 'active' : ''}
                    >
                        {i}
                    </button>
                );
            }
        } else {
            // Show first 3 pages, last 3 pages, and ellipsis for remaining pages
            for (let i = 1; i <= 3; i++) {
                pageNumbers.push(
                    <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={currentPage === i ? 'active' : ''}
                    >
                        {i}
                    </button>
                );
            }
            if (currentPage > 3 && currentPage < totalPages - 2) {
                pageNumbers.push(<span key="dots1">...</span>);
                pageNumbers.push(
                    <button
                        key={currentPage}
                        onClick={() => handlePageChange(currentPage)}
                        className="active"
                    >
                        {currentPage}
                    </button>
                );
                pageNumbers.push(<span key="dots2">...</span>);
            } else if (currentPage >= totalPages - 2) {
                pageNumbers.push(<span key="dots1">...</span>);
            }
            for (let i = totalPages - 2; i <= totalPages; i++) {
                pageNumbers.push(
                    <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={currentPage === i ? 'active' : ''}
                    >
                        {i}
                    </button>
                );
            }
        }
        return pageNumbers;
    };

    return (
        <>

            <Router>
                <div className="app">
                    <h1>Pokemon List</h1>
                    <input
                        type="text"
                        placeholder="Search Pokemon"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <div className="pokemon-container">
                     {loading ? <h1>Loading...</h1> : (
                          <Routes>
                          <Route
                              path="/"
                              element={displayedPokemon.map(pokemon => (
                                  <PokemonCard
                                      key={pokemon.id}
                                      pokemon={pokemon}
                                      onClick={() => handleCardClick(pokemon)}
                                  />
                              ))}
                          />
                      </Routes>
                    )}
                    </div>
                    <div className="pagination">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        {renderPageNumbers()}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === Math.ceil(totalPokemonCount / itemsPerPage)}
                        >
                            Next
                        </button>
                    </div>
                    {selectedPokemon && <PokemonModal pokemon={selectedPokemon} onClose={handleCloseModal} />}
                </div>
            </Router>
        </>

    );
};

export default App;