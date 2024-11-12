import { useState } from "react";
import { Route, Routes, Link } from "react-router-dom";
import { FamilyMembers } from "./Components/4.FamilyMember";
import { Register } from "./Components/1.Register";
import { Login } from "./Components/2.Login";

const App = () => {
  const [FamilyTree, setFamilyTree] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [RegisteredUsers, setRegisteredUsers] = useState([]);

  const findMemberById = (tree, id) => {
    for (let member of tree) {
      if (member.id === id) return member;
      if (member.children) {
        const found = findMemberById(member.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const handleRegister = (userData) => {
    setRegisteredUsers([...RegisteredUsers, userData]);
    alert("Registration Successfully!");
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

  const handleAddMember = (newPerson, memberId = null, type = null) => {
    const newMember = {
      ...newPerson,
      id: `${newPerson.Name}-${newPerson.Surname}-${Date.now()}`,
      children: [],
    };

    setFamilyTree((prevTree) => {
      if (!memberId) {
        return [...prevTree, newMember]; // Add root member
      }

      const updatedTree = JSON.parse(JSON.stringify(prevTree));

      if (type === "parent") {
        const currentMember = findMemberById(updatedTree, memberId);
        if (currentMember) {
          newMember.children = [currentMember];
          const replaceNodeInTree = (tree, oldNode, newNode) => {
            for (let i = 0; i < tree.length; i++) {
              if (tree[i].id === oldNode.id) {
                tree[i] = newNode;
                return true;
              }
              if (tree[i].children) {
                if (replaceNodeInTree(tree[i].children, oldNode, newNode)) {
                  return true;
                }
              }
            }
            return false;
          };
          replaceNodeInTree(updatedTree, currentMember, newMember);
        }
      } else if (type === "child") {
        const parent = findMemberById(updatedTree, memberId);
        if (parent) {
          if (!parent.children) parent.children = [];
          parent.children.push(newMember);
        }
      } else if (type === "sibling") {
        const parent = findMemberById(updatedTree, memberId);
        if (parent) {
          parent.children.push(newMember);
        }
      }

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

            <div className="bg-white rounded-lg shadow-lg p-4 min-h-[600px]">
              <FamilyMembers FamilyTree={FamilyTree} onAddPerson={handleAddMember} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
