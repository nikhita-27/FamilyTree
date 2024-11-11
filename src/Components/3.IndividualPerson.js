import React, { useState } from "react";

const I_Person = ({ onAddPerson, parentId }) => {
  const [Surname, setSurname] = useState("");
  const [Gothram, setGothram] = useState("");
  const [Name, setName] = useState("");
  const [Origin, setOrigin] = useState("");

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a new family member object
    const newPerson = {
      Surname,
      Gothram,
      Name,
      Origin,
      parentId,
      id: new Date().getTime(),
      children: [],
    };

    // Call the parent function to add the member
    onAddPerson(newPerson);

    // Reset the input fields
    setSurname("");
    setGothram("");
    setName("");
    setOrigin("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Surname:
          <input
            type="text"
            value={Surname}
            onChange={(e) => setSurname(e.target.value)}
          />
        </label>

        <label>
          Gothram:
          <input
            type="text"
            value={Gothram}
            onChange={(e) => setGothram(e.target.value)}
          />
        </label>

        <label>
          Name:
          <input
            type="text"
            value={Name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label>
          Origin:
          <input
            type="text"
            value={Origin}
            onChange={(e) => setOrigin(e.target.value)}
          />
        </label>

        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export { I_Person };
