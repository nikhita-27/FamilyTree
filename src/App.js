import { useState } from "react";
import { Route, Routes, Link } from "react-router-dom";
import { FamilyMembers } from "./Components/4.FamilyMember";
import { Register } from "./Components/1.Register";
import { Login } from "./Components/2.Login";

const App = () => {
  const [FamilyTree, setFamilyTree] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [RegisteredUsers, setRegisteredUsers] = useState([]);

  const handleRegister = (userData) => {
    setRegisteredUsers((prev) => [...prev, userData]);
    alert("Registration Successful!");
  };

  const handleLogin = (email, password) => {
    const user = RegisteredUsers.find(
      (user) => user.email === email && user.password === password
    );
    if (user) {
      setIsLoggedIn(true);
      alert("Successfully Logged In!");
    } else {
      alert("Invalid credentials");
    }
  };

  const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

  const findNodeById = (tree, id) => {
    for (let i = 0; i < tree.length; i++) {
      if (tree[i].id === id) {
        return { node: tree[i], index: i, parent: null };
      }
      if (tree[i].children && tree[i].children.length > 0) {
        for (let j = 0; j < tree[i].children.length; j++) {
          if (tree[i].children[j].id === id) {
            return { node: tree[i].children[j], index: j, parent: tree[i] };
          }
          // Search deeper in the tree
          const deepSearch = findNodeById([tree[i].children[j]], id);
          if (deepSearch.node) {
            return deepSearch;
          }
        }
      }
    }
    return { node: null, index: -1, parent: null };
  };

  const handleAddMember = (newPerson, targetId = null, type = null) => {
    const newMember = {
      ...newPerson,
      id: `${newPerson.Name}-${newPerson.Surname}-${Date.now()}`,
      children: [],
      parents: [], // Add parents array to track multiple parents
    };
  
    setFamilyTree((prevTree) => {
      let updatedTree = deepClone(prevTree);
  
      if (!targetId) {
        return [...updatedTree, newMember];
      }
  
      const updateNode = (nodes) => {
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].id === targetId) {
            switch (type) {
              case "parent": {
                // Instead of replacing, add to parents array
                if (!nodes[i].parents) {
                  nodes[i].parents = [];
                }
                nodes[i].parents.push(newMember);
                return true;
              }
              case "child": {
                if (!nodes[i].children) {
                  nodes[i].children = [];
                }
                nodes[i].children.push(newMember);
                return true;
              }
              case "sibling": {
                nodes.push(newMember);
                return true;
              }
              case "spouse": {
                nodes[i].spouse = newMember;
                return true;
              }
              default:
                return false;
            }
          }
          if (nodes[i].children) {
            const foundInChildren = updateNode(nodes[i].children);
            if (foundInChildren) return true;
          }
        }
        return false;
      };
  
      updateNode(updatedTree);
      return updatedTree;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center py-6">My Family Tree App</h1>

        {!isLoggedIn ? (
          <div className="max-w-md mx-auto">
            <nav className="space-x-4 text-center mb-8">
              <Link to="/register" className="text-blue-500 hover:text-blue-700">Register</Link>
              <br />
              <Link to="/login" className="text-blue-500 hover:text-blue-700">Login</Link>
            </nav>

            <Routes>
              <Route path="/register" element={<Register onRegister={handleRegister} />} />
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
            </Routes>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-6 text-center">Welcome! You are logged in.</h2>
            <div className="text-center mb-6">
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
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                Add Root Member
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-4 min-h-[800px]">
              <FamilyMembers FamilyTree={FamilyTree} onAddPerson={handleAddMember} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;