import React from 'react';
import './PokemonCard.css';

const PokemonCard = ({ pokemon, onClick }) => {
  // Function to capitalize the first letter of a string
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Function to generate CSS class names based on the Pokemon's type
  const getTypeClassName = () => {
    if (pokemon.types.length > 0) {
      // Return the first type of the Pokemon
      return pokemon.types[0].type.name;
    } else {
      // Return a default class if no type is available
      return 'default';
    }
  };

  return (
    <div className={`pokemon-card ${getTypeClassName()}`} onClick={onClick}>
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />
      <h2>{capitalizeFirstLetter(pokemon.name)}</h2>
      <p>Height: {pokemon.height}</p>
      <p>Weight: {pokemon.weight}</p>
    </div>
  );
};

export default PokemonCard;
