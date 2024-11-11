import { useState } from "react";
import { Route, Routes, Link, Navigate } from "react-router-dom";
import { FamilyMembers } from "./Components/4.FamilyMember";
import { Register } from "./Components/1.Register";
import { Login } from "./Components/2.Login";
import { Relation } from "./Components/5.Relationship";
import { Data } from "./Components/6.Data";

const App = () => {
  const [FamilyTree, setFamilyTree] = useState([]); // Stores entire family tree
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [RegisteredUsers, setRegisteredUsers] = useState([]);
  const [selectedParentId, setSelectedParentId] = useState(null); //track of selected parent ID

  // Handle registration
  const handleRegister = (userData) => {
    setRegisteredUsers([...RegisteredUsers, userData]);
    alert("Registration Successfully!");
  };

  // Handle login
  const handleLogin = (email, password) => {
    const user = RegisteredUsers.find(
      (user) => user.email === email && user.password === password
    );
    if (user) {
      setIsLoggedIn(true);
      alert("Successfully Logged IN!");
    } else {
      alert("Invalid credentials - - -");
    }
  };

  // Add family member either as root or under parent
  const handleAddMember = (newPerson, parentId = null) => {
    const newMember = {
      ...newPerson,
      id: `${newPerson.Name}-${newPerson.Surname}-${Date.now()}`, // Unique ID using timestamp
      isExpanded: false,
      children: [],
    };

    if (parentId) {
      // Add as child of a parent
      setFamilyTree((prevTree) => {
        const updatedTree = [...prevTree];
        const parent = findMemberById(updatedTree, parentId); // Find parent by ID
        if (parent) {
          // Add new member as a child of the found parent
          parent.children.push(newMember);
        } else {
          alert("Parent not found. Please enter a valid parent ID.");
        }
        return updatedTree; // Return the updated family tree
      });
    } else {
      // Add as a root member
      setFamilyTree((prevTree) => [...prevTree, newMember]);
    }
  };

  // Recursive function to find a member by ID (search across all children too)
  const findMemberById = (tree, id) => {
    for (let member of tree) {
      if (member.id === id) return member; // If the ID matches, return the member
      if (member.children) {
        const found = findMemberById(member.children, id); // Recursively search children
        if (found) return found;
      }
    }
    return null; // Return null if no member found
  };

  // Toggle expansion/collapse for a member and its children
  const toggleMember = (id) => {
    setFamilyTree((prevTree) => {
      const updatedTree = [...prevTree];
      toggleMemberRecursively(updatedTree, id);
      return updatedTree; // Return the updated family tree with the toggled member
    });
  };

  // Recursive function to toggle the expansion state
  const toggleMemberRecursively = (tree, id) => {
    for (let member of tree) {
      if (member.id === id) {
        member.isExpanded = !member.isExpanded; // Toggle expansion
        return;
      }
      if (member.children) {
        toggleMemberRecursively(member.children, id);
      }
    }
  };

  return (
    <div>
      <h1>My FamilyTree APP</h1>

      {!isLoggedIn ? (
        <div>
          <nav>
            <Link to="/register">Register</Link>
            <br />
            <Link to="/login">Login</Link>
          </nav>

          <Routes>
            <Route path="/register" element={<Register onRegister={handleRegister} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
          </Routes>
        </div>
      ) : (
        <div>
          <h2>Welcome! You are logged in.</h2>

          {/* Add Root Members */}
          <button
            onClick={() => {
              const name = prompt("Enter Root's name:");
              const surname = prompt("Enter Root's surname:");
              const gothram = prompt("Enter Root's gothram:");
              const origin = prompt("Enter Root's origin:");
              if (name && surname && gothram && origin) {
                handleAddMember({
                  Name: name,
                  Surname: surname,
                  Gothram: gothram,
                  Origin: origin,
                });
              }
            }}
          >
            Add Root Member
          </button>

          {/* Display Root Members and Select Parent */}
          <h3>Select a Parent to ADD a CHILD</h3>
          <select onChange={(e) => setSelectedParentId(e.target.value)} value={selectedParentId}>
            <option value="">Select Parent</option>
            {FamilyTree.map((member) => (
              <option key={member.id} value={member.id}>
                {member.Name} {member.Surname}
              </option>
            ))}
          </select>

          {/* Add Member Under the Selected Parent */}
          <button
            onClick={() => {
              if (selectedParentId) {
                const name = prompt("Enter member's first name:");
                const surname = prompt("Enter member's surname:");
                const gothram = prompt("Enter member's gothram:");
                const origin = prompt("Enter member's origin:");
                if (name && surname && gothram && origin) {
                  handleAddMember(
                    { Name: name, Surname: surname, Gothram: gothram, Origin: origin },
                    selectedParentId // Use selected parent ID
                  );
                }
              } else {
                alert("Please select a parent to add the child under.");
              }
            }}
          >
            Add Member Under Selected Parent
          </button>

          {/* Family Tree Display and Interaction */}
          <FamilyMembers
            FamilyTree={FamilyTree}
            toggleMember={toggleMember}
            onAddPerson={handleAddMember}
          />
          <Relation />
          <Data />
        </div>
      )}
    </div>
  );
};

export default App;
