import { useState, useEffect } from "react";
import Image from "next/image";
import styled from "styled-components";

export default function Home() {
  const [characters, setCharacters] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [filterDead, setFilterDead] = useState(false);
  const [filterAlive, setFilterAlive] = useState(false);
  const [page, setPage] = useState(1);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    async function getCharacters() {
      try {
        const response = await fetch(
          `https://rickandmortyapi.com/api/character?page=${page}`
        );

        if (response.ok) {
          const data = await response.json();
          setCharacters(data.results);
          setInfo(data.info);
        } else {
          console.log("An error occurred");
        }
      } catch (error) {
        console.error(error);
      }
    }
    getCharacters();
  }, [page]);

  useEffect(() => {
    setPage(1);
  }, [searchName, filterDead, filterAlive]);

  const handleSearchNameChange = (event) => {
    setSearchName(event.target.value);
  };

  const handleFilterDeadChange = () => {
    setFilterDead(!filterDead);
  };

  const handleFilterAliveChange = () => {
    setFilterAlive(!filterAlive);
  };

  const handlePreviousPage = () => {
    if (info?.prev) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (info?.next) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const filteredCharacters = characters.filter((character) => {
    const isNameMatched = character.name
      .toLowerCase()
      .includes(searchName.toLowerCase());
    const isStatusMatched =
      (!filterDead || character.status === "Dead") &&
      (!filterAlive || character.status === "Alive");
    return isNameMatched && isStatusMatched;
  });

  return (
    <div>
      <h1>Rick and Morty</h1>

      <div>
        <label htmlFor="searchName">Search by Name:</label>
        <input
          type="text"
          id="searchName"
          value={searchName}
          onChange={handleSearchNameChange}
        />

        <label htmlFor="filterDead">Filter Dead:</label>
        <input
          type="checkbox"
          id="filterDead"
          checked={filterDead}
          onChange={handleFilterDeadChange}
        />

        <label htmlFor="filterAlive">Filter Alive:</label>
        <input
          type="checkbox"
          id="filterAlive"
          checked={filterAlive}
          onChange={handleFilterAliveChange}
        />
      </div>

      <ul>
        {filteredCharacters.length === 0 ? (
          <p>No characters found.</p>
        ) : (
          filteredCharacters.map((character) => (
            <StyledCard key={character.id}>
              <Image
                src={character.image}
                alt={character.name}
                width={300}
                height={300}
              />
              <h2>{character.name}</h2>
              <p>status: {character.status}</p>
              <p>species: {character.species}</p>
              <p>gender: {character.gender}</p>
              <p>origin: {character.origin.name}</p>
              <p>location: {character.location.name}</p>
            </StyledCard>
          ))
        )}
      </ul>

      <div>
        <button onClick={handlePreviousPage} disabled={!info?.prev}>
          Previous
        </button>
        <button onClick={handleNextPage} disabled={!info?.next}>
          Next
        </button>
      </div>
    </div>
  );
}

const StyledCard = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: solid 1px black;
  border-radius: 5px;
  width: 450px;
  padding: 10px;
  margin: 10px;

  background-color: #f5f5f5;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
`;
