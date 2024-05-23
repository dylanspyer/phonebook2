import { useState, useEffect } from "react";
import axios from "axios";
import personsService from "./services/persons.js";

const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }

  return <div className={type}>{message}</div>;
};

const PersonForm = (props) => {
  return (
    <form onSubmit={props.handleAddName}>
      <div>
        <p>
          name:{" "}
          <input value={props.newName} onChange={props.handleNameChange} />
        </p>
        <p>
          number:{" "}
          <input value={props.newNumber} onChange={props.handleNumberChange} />
        </p>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = (props) => {
  console.log(props);
  return (
    <div>
      {props.filteredPersons.length > 0
        ? props.filteredPersons.map((person) => (
            <p key={person.name}>
              {person.name}:{" "}
              {person.number ? `${person.number}` : `No number listed`}
              <button onClick={() => props.handleDeleteButton(person.id)}>
                delete
              </button>
            </p>
          ))
        : "..."}
    </div>
  );
};

const Filter = (props) => {
  return (
    <p>
      filter shower with
      <input onChange={props.handleFilterPerson} />
    </p>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filteredPersons, setFilteredPersons] = useState(persons);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

  useEffect(() => {
    personsService.getAll().then((persons) => {
      setPersons(persons);
      setFilteredPersons(persons);
    });
  }, []);

  const handleAddName = (event) => {
    event.preventDefault();
    const newNameObj = {
      name: newName,
      number: newNumber,
    };

    if (personExists(newName)) {
      if (
        window.confirm(
          `${newName} is already added to the phonebook, replace the old number with a new one?`
        )
      ) {
        const index = persons.findIndex(
          (person) => person.name.toLowerCase() === newName.toLowerCase()
        );
        const id = persons[index].id;
        personsService.updatePerson(id, newNameObj).then((updatedPerson) => {
          setPersons(
            persons.map((person) =>
              person.id !== updatedPerson.id ? person : updatedPerson
            )
          );
          setFilteredPersons(
            persons.map((person) =>
              person.id !== updatedPerson.id ? person : updatedPerson
            )
          );
        });
      }
    } else {
      personsService.createPerson(newNameObj).then((newPerson) => {
        setPersons(persons.concat(newPerson));
        setFilteredPersons(persons.concat(newPerson));
        setMessage(`Added ${newPerson.name}`);
        setMessageType("success");
        setTimeout(() => {
          setMessage(null);
          setMessageType(null);
        }, 4000);
      });
    }

    setNewName("");
    setNewNumber("");
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const personExists = (name) =>
    persons.some((person) => person.name.toLowerCase() === name.toLowerCase());

  const filterForCharacters = (characters) =>
    persons.filter((person) => {
      person = person.name.slice(0, characters.length).toLowerCase();
      return characters === person;
    });

  const handleFilterPerson = (event) => {
    if (filterForCharacters(event.target.value)) {
      setFilteredPersons(filterForCharacters(event.target.value));
    }
  };

  const handleDeleteButton = (id) => {
    const person = persons.find((person) => person.id === id);

    if (window.confirm(`Delete ${person.name}?`)) {
      personsService
        .deletePerson(id)
        .then((deletedPerson) => {
          const index = persons.findIndex((person) => person.id === id);
          const newPersons = persons.toSpliced(index, 1);
          setPersons(newPersons);
          setFilteredPersons(newPersons);
          setMessageType("success");
          setMessage(`Removed ${person.name}`);
          setTimeout(() => {
            setMessageType(null);
            setMessage(null);
          }, 4000);
        })
        .catch((error) => {
          setMessageType("error");
          setMessage(
            `Information of ${person.name} has already been removed from server`
          );
          const index = persons.findIndex((person) => person.id === id);
          const newPersons = persons.toSpliced(index, 1);
          setPersons(newPersons);
          setFilteredPersons(newPersons);
          setTimeout(() => {
            setMessage(null);
            setMessageType(null);
          }, 4000);
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} type={messageType} />
      <Filter handleFilterPerson={handleFilterPerson} />
      <h2>add a new </h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        handleNameChange={handleNameChange}
        handleAddName={handleAddName}
      />
      <h2>Numbers</h2>
      <Persons
        filteredPersons={filteredPersons}
        handleDeleteButton={handleDeleteButton}
      />
    </div>
  );
};

export default App;

// user types into filter input field
// as user types, if those letters are in names in the phonebook, render the matches
// if not, render the entire list
// check this every time a new character is entered
