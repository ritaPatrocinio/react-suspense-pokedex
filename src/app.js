import React, { useDeferredValue, useState, useTransition } from "react";
import ErrorBoundary from "./error-boundary";
import {
  suspensify,
  fetchPokemon,
  fetchPokemonList,
  fetchNextPokemonList,
} from "./api";
import List from "./ui/List";
import DelaySpinner from "./ui/DelaySpinner";
import { PokemonContext } from "./pokemon";
import "./styles.css";

const PokemonDetail = React.lazy(() => import("./pokemon-detail"));

const initialPokemon = suspensify(fetchPokemon(1));
const initialPokemonCollection = suspensify(fetchPokemonList());

export default function App() {
  const [pokemonResource, setPokemonResource] = useState(initialPokemon);
  const [pokemonCollection, setPokemonCollection] = useState(
    initialPokemonCollection
  );
  const [startTransition, isPending] = useTransition({ timeoutMs: 3000 });
  const deferedPokemonResource = useDeferredValue(pokemonResource, {
    timeoutMs: 3000,
  });

  const pokemonIsPending = deferedPokemonResource !== pokemonResource;

  const pokemonState = {
    pokemon: deferedPokemonResource,
    isPending: pokemonIsPending,
    setPokemon: (id) =>
      startTransition(() => setPokemonResource(suspensify(fetchPokemon(id)))),
  };

  return (
    <div className="container">
      <h1>Pokedex</h1>
      <PokemonContext.Provider value={pokemonState}>
        <React.SuspenseList revealOrder="forwards" tail="collapsed">
          <React.Suspense fallback={<div>Fetching Pokemon stats...</div>}>
            <ErrorBoundary fallback="Couldn't catch them all.">
              <PokemonDetail />
            </ErrorBoundary>
          </React.Suspense>
          <React.Suspense fallback={<div>Connecting to database...</div>}>
            <ErrorBoundary fallback="Couldn't catch them all.">
              <div className="flex">
                <button
                  className="next"
                  type="button"
                  disabled={pokemonIsPending}
                  onClick={() =>
                    pokemonCollection.read().previous &&
                    startTransition(() =>
                      setPokemonCollection(
                        suspensify(
                          fetchNextPokemonList(
                            pokemonCollection.read().previous
                          )
                        )
                      )
                    )
                  }
                >
                  Previous
                </button>
                <button
                  className="next"
                  type="button"
                  disabled={pokemonIsPending}
                  onClick={() =>
                    startTransition(() =>
                      setPokemonCollection(
                        suspensify(
                          fetchNextPokemonList(pokemonCollection.read().next)
                        )
                      )
                    )
                  }
                >
                  Next
                </button>
                {isPending && <DelaySpinner />}
              </div>

              <PokemonContext.Consumer>
                {({ setPokemon }) => (
                  <PokemonCollection
                    pokemonCollection={pokemonCollection}
                    as={"ul"}
                    display={(pokemon) => (
                      <li key={pokemon.name}>
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => setPokemon(pokemon.id)}
                        >
                          {pokemon.name}
                        </button>
                      </li>
                    )}
                  />
                )}
              </PokemonContext.Consumer>
            </ErrorBoundary>
          </React.Suspense>
        </React.SuspenseList>
      </PokemonContext.Provider>
    </div>
  );
}

const PokemonCollection = (props) => {
  return (
    <List items={props.pokemonCollection.read().results} {...props}></List>
  );
};
