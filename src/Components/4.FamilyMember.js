import React, { useState, useCallback } from 'react';
import Tree from 'react-d3-tree';

export const FamilyMembers = ({ FamilyTree = [], onAddPerson }) => {
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Get container dimensions and adjust tree position
  const containerRef = useCallback(containerElem => {
    if (containerElem !== null) {
      const { width, height } = containerElem.getBoundingClientRect();
      setDimensions({ width, height });
      setTranslate({ x: width / 2, y: height / 10 }); // Center the tree in the container
    }
  }, []);

  const convertToTreeData = (members) => {
    if (!Array.isArray(members) || members.length === 0) {
      return [];
    }

    return members.map(member => ({
      ...member,
      name: `${member.Name} ${member.Surname}`,
      attributes: {
        Gothram: member.Gothram,
        Origin: member.Origin,
        id: member.id
      },
      children: member.children ? convertToTreeData(member.children) : []
    }));
  };

  const treeData = convertToTreeData(FamilyTree);

  const handleAddNode = (nodeDatum, type) => {
    const numberOfNodes = type === 'parent' || type === 'sibling'
      ? parseInt(prompt(`How many ${type}s would you like to add?`)) || 1
      : 1;

    for (let i = 0; i < numberOfNodes; i++) {
      const nodeNumber = numberOfNodes > 1 ? ` ${i + 1}` : '';
      const name = prompt(`Enter name for ${type}${nodeNumber}:`);
      const surname = prompt(`Enter surname for ${type}${nodeNumber}:`);
      const gothram = prompt(`Enter gothram for ${type}${nodeNumber}:`);
      const origin = prompt(`Enter origin for ${type}${nodeNumber}:`);

      if (name && surname && gothram && origin) {
        const newPerson = {
          Name: name,
          Surname: surname,
          Gothram: gothram,
          Origin: origin
        };

        // Call the parent function to update the tree with the new person
        onAddPerson(newPerson, nodeDatum.attributes.id, type);
      }
    }
  };

  const renderForeignObjectNode = ({
    nodeDatum,
    toggleNode,
    foreignObjectProps
  }) => (
    <g>
      <circle r={20} fill="#4299e1" />
      <foreignObject {...foreignObjectProps}>
        <div className="absolute p-4 bg-white rounded-lg shadow-lg border border-gray-200"
             style={{
               width: '400px', // Increased width to ensure content fits
               height: 'auto', // Let the height grow based on content
               maxHeight: '400px', // Limit the height of nodes
               transform: 'translate(-50%, -50%)',
               overflow: 'auto', // Enable scrolling if content overflows
             }}>
          <div className="text-center">
            <h3 className="font-bold text-lg">{nodeDatum.name}</h3>
            <div className="text-sm text-gray-600">
              {nodeDatum.attributes?.Gothram && `Gothram: ${nodeDatum.attributes.Gothram}`}<br />
              {nodeDatum.attributes?.Origin && `Origin: ${nodeDatum.attributes.Origin}`}
            </div>
            <div className="flex flex-col gap-2 mt-2"> {/* Stack the buttons vertically */}
              <button
                className="bg-purple-500 text-white px-4 py-2 rounded text-sm hover:bg-purple-600"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddNode(nodeDatum, 'parent'); // Add Parent
                }}
              >
                Add Parent
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddNode(nodeDatum, 'child'); // Add Child
                }}
              >
                Add Child
              </button>
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded text-sm hover:bg-yellow-600"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddNode(nodeDatum, 'sibling'); // Add Sibling
                }}
              >
                Add Sibling
              </button>
              {nodeDatum.children && nodeDatum.children.length > 0 && (
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleNode(); // Expand or Collapse the node
                  }}
                >
                  {nodeDatum.__rd3t.collapsed ? 'Expand' : 'Collapse'}
                </button>
              )}
            </div>
          </div>
        </div>
      </foreignObject>
    </g>
  );

  return (
    <div ref={containerRef} className="w-full h-screen">
      {dimensions.width > 0 && (
        <Tree
          data={treeData.length > 0 ? treeData[0] : { name: 'No Data', children: [] }}
          translate={translate}
          orientation="vertical"
          renderCustomNodeElement={(rd3tProps) =>
            renderForeignObjectNode({
              ...rd3tProps,
              foreignObjectProps: {
                width: 400, // Increased width for better content fitting
                height: 280, // Increased height for the node
                x: -50, // Center node horizontally
                y: -40 // Center node vertically
              }
            })
          }
          pathFunc="step"
          separation={{ siblings: 3, nonSiblings: 3.5 }} // Increase separation for better visibility
          zoom={0.75} // Adjust zoom to fit the tree inside the screen
          enableLegacyTransitions={true}
          transitionDuration={800}
        />
      )}
    </div>
  );
};
