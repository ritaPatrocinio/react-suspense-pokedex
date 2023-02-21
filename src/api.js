import sleep from "sleep-promise";

export const suspensify = (promise) => {
  let status = "pending";
  let result;

  const suspender = promise.then(
    (response) => {
      status = "success";
      result = response;
    },
    (error) => {
      status = "error";
      result = error;
    }
  );

  return {
    read() {
      if (status === "pending") throw suspender;

      if (status === "error") throw result;

      if (status === "success") return result;
    },
  };
};

export const fetchPokemon = (id) =>
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then((response) => response.json())
    .then(sleep(1500));

export const fetchPokemonList = () =>
  fetch(`https://pokeapi.co/api/v2/pokemon/`)
    .then((response) => response.json())
    .then((res) => ({
      ...res,
      results: res.results.map((pokemon) => ({
        ...pokemon,
        id: pokemon.url.split("/")[6],
      })),
    }))
    .then(sleep(3000));

export const fetchNextPokemonList = (url) =>
  fetch(url)
    .then((response) => response.json())
    .then((res) => ({
      ...res,
      results: res.results.map((pokemon) => ({
        ...pokemon,
        id: pokemon.url.split("/")[6],
      })),
    }))
    .then(sleep(3000));
