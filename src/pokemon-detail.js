import React, { useContext } from "react";
import DelaySpinner from "./ui/DelaySpinner";
import { PokemonContext } from "./pokemon";

export default function PokemonDetail() {
  const { pokemon: resource, isPending } = useContext(PokemonContext);

  const pokemon = resource.read();

  return (
    <>
      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        width="300"
      ></img>
      <div>
        <p>
          {pokemon.name}
          {isPending && <DelaySpinner />}
        </p>
      </div>
    </>
  );
}
