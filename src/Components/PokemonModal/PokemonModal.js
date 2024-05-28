import React from 'react';
import ReactModal from 'react-modal';
import './PokemonModal.css';

ReactModal.setAppElement('#root');

const PokemonModal = ({ pokemon, onClose }) => {
  // Function to get the CSS class name based on the first type of the Pokemon
  const getModalClassName = () => {
    if (pokemon.types.length > 0) {
      // Return the first type of the Pokemon as the class name
      return pokemon.types[0].type.name;
    } else {
      // Return a default class name if no type is available
      return 'default';
    }
  };

  return (
    <ReactModal
      isOpen={!!pokemon}
      onRequestClose={onClose}
      contentLabel="Pokemon Details"
      className={`pokemon-modal ${getModalClassName()}`}
      overlayClassName="pokemon-modal-overlay"
    >
      <button className="close-button" onClick={onClose}>X</button>
      <div className="pokemon-details">
        <img src={pokemon.sprites.front_default} alt={pokemon.name} />
        <h2>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
        <p>Height: {pokemon.height}</p>
        <p>Weight: {pokemon.weight}</p>
        <p>Base Experience: {pokemon.base_experience}</p>
        <p>Abilities:</p>
        <ul>
          {pokemon.abilities.map(ability => (
            <li key={ability.ability.name}>{ability.ability.name}</li>
          ))}
        </ul>
        <p>Types:</p>
        <ul>
          {pokemon.types.map(type => (
            <li key={type.type.name}>{type.type.name}</li>
          ))}
        </ul>
      </div>
    </ReactModal>
  );
};

export default PokemonModal;
