import React from "react";
import Tree from "react-d3-tree";

const FamilyMembers = ({ FamilyTree, toggleMember }) => {

  // Custom node rendering function
  const renderCustomNode = ({ nodeDatum }) => {
    return (
      <g onClick={() => toggleMember(nodeDatum.id)} style={{ cursor: 'pointer' }}>
        <circle r="15" fill="lightblue" />
        <text fill="black" x="20" dy="0">
          {nodeDatum.name}
        </text>
        {nodeDatum.attributes?.Origin && (
          <text fill="gray" x="20" dy="20">
            Origin: {nodeDatum.attributes.Origin}
          </text>
        )}
        <text fill="red" x="20" dy="40">
          {nodeDatum.isExpanded ? 'Collapse' : 'Expand'}
        </text>
      </g>
    );
  };

  // Recursive function to format the family tree data, including children if expanded
  const formatTreeData = (members) => {
    return members.map((member) => ({
      name: `${member.Name} (${member.Surname}, ${member.Gothram})`, // Format the name for display
      id: member.id, // unique ID for each member
      attributes: {
        Origin: member.Origin, // Include Origin in attributes
      },
      isExpanded: member.isExpanded, // Include the expanded state
      children: member.isExpanded ? formatTreeData(member.children) : [], // Recursively format children if expanded
    }));
  };

  // Format the tree data by recursively processing the FamilyTree
  const data = {
    name: "Me", // Root name (can be customized)
    children: formatTreeData(FamilyTree), // Format the family tree with children data
  };

  // Helper function to get details of a member by ID
  const getMemberDetails = (id) => {
    const member = findMemberById(FamilyTree, id);
    return member ? (
      <div style={{ marginTop: "10px", padding: "10px", backgroundColor: "#f2f2f2" }}>
        <h4>Member Details</h4>
        <p><strong>Name:</strong> {member.Name} {member.Surname}</p>
        <p><strong>Gothram:</strong> {member.Gothram}</p>
        <p><strong>Origin:</strong> {member.Origin}</p>
      </div>
    ) : null;
  };

  // Recursive function to find a member by ID
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

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <Tree
        data={data}
        orientation="vertical"
        renderCustomNodeElement={renderCustomNode} // Custom rendering function for each node
        pathFunc="step"
      />

      {/* Display details of the selected member if expanded */}
      {FamilyTree.map((member) => (
        member.isExpanded && getMemberDetails(member.id) // Only show details if the member is expanded
      ))}
    </div>
  );
};

export { FamilyMembers };
