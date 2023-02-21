import React from "react";

const List = ({
  items = [],
  as: As = React.Fragment,
  display = (pokemon) => <div>{pokemon.name}</div>,
}) => {
  return <As>{items.map((pokemon) => display(pokemon))}</As>;
};

export default List;
