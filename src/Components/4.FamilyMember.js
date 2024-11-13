import React, { useState, useCallback } from 'react';
import Tree from 'react-d3-tree';

// Function to convert family data into the format required by react-d3-tree
const convertToTreeData = (members) => {
  if (!Array.isArray(members) || members.length === 0) {
    return [];
  }

  // Create a virtual root to hold all top-level nodes
  const virtualRoot = {
    name: "Family Tree",
    attributes: {},
    children: members.map(member => ({
      name: `${member.Name} ${member.Surname}`,
      attributes: {
        Gothram: member.Gothram,
        Origin: member.Origin,
        id: member.id
      },
      children: member.children ? convertToTreeData(member.children)[0]?.children || [] : []
    }))
  };

  return [virtualRoot];
};

export const FamilyMembers = ({ FamilyTree, onAddPerson }) => {
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const containerRef = useCallback(containerElem => {
    if (containerElem !== null) {
      const { width, height } = containerElem.getBoundingClientRect();
      setDimensions({ width, height });
      setTranslate({ x: width / 2, y: height / 4 }); // Adjusted to position higher
    }
  }, []);

  // Handle adding new nodes (parent, child, sibling)
  const handleAddNode = async (nodeDatum, type) => {
    const { id } = nodeDatum.attributes;
    
    // Don't allow adding to virtual root
    if (!id) {
      alert("Please select a specific family member to add relative.");
      return;
    }

    const name = prompt("Enter name:");
    const surname = prompt("Enter surname:");
    const gothram = prompt("Enter gothram:");
    const origin = prompt("Enter origin:");

    if (name && surname && gothram && origin) {
      const newPerson = {
        Name: name,
        Surname: surname,
        Gothram: gothram,
        Origin: origin,
        id: `${name}-${surname}-${Date.now()}`,
        children: [],
      };

      onAddPerson(newPerson, id, type);
    }
  };

  // Function to render custom node elements
  const renderForeignObjectNode = ({ nodeDatum, toggleNode, foreignObjectProps }) => {
    // Don't render UI for virtual root
    if (!nodeDatum.attributes?.id) {
      return null;
    }

    return (
      <g>
        <circle r={15} fill="#4299e1" />
        <foreignObject
          {...foreignObjectProps}
          style={{
            overflow: 'visible',
            pointerEvents: 'auto',
          }}
        >
          <div
            className="node-container bg-white rounded-lg shadow-lg border border-gray-200"
            style={{
              position: 'relative',
              left: '-150px',
              top: '-120px',
              width: '300px',
              minHeight: '240px',
              padding: '0.75rem',
              zIndex: 1
            }}
          >
            <div className="text-center">
              <h3 className="font-bold text-lg mb-2">{nodeDatum.name}</h3>
              <div className="text-sm text-gray-600 mb-3">
                {nodeDatum.attributes?.Gothram && <div>Gothram: {nodeDatum.attributes.Gothram}</div>}
                {nodeDatum.attributes?.Origin && <div>Origin: {nodeDatum.attributes.Origin}</div>}
              </div>
              <div className="flex flex-col gap-2">
                <button
                  className="w-full bg-purple-500 text-white px-3 py-1.5 rounded hover:bg-purple-600 transition-colors text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddNode(nodeDatum, 'parent');
                  }}
                >
                  Add Parent
                </button>
                <button
                  className="w-full bg-green-500 text-white px-3 py-1.5 rounded hover:bg-green-600 transition-colors text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddNode(nodeDatum, 'child');
                  }}
                >
                  Add Child
                </button>
                <button
                  className="w-full bg-yellow-500 text-white px-3 py-1.5 rounded hover:bg-yellow-600 transition-colors text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddNode(nodeDatum, 'sibling');
                  }}
                >
                  Add Sibling
                </button>
                {nodeDatum.children && nodeDatum.children.length > 0 && (
                  <button
                    className="w-full bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 transition-colors text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleNode();
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
  };

  const treeData = convertToTreeData(FamilyTree);

  return (
    <div ref={containerRef} className="w-full h-[800px]">
      {dimensions.width > 0 && (
        <Tree
          data={treeData[0] || { name: 'No Data', children: [] }}
          translate={translate}
          orientation="vertical"
          renderCustomNodeElement={(rd3tProps) =>
            renderForeignObjectNode({
              ...rd3tProps,
              foreignObjectProps: {
                width: 300,
                height: 240,
                x: 0,
                y: 0
              }
            })
          }
          pathFunc="step"
          separation={{ siblings: 2, nonSiblings: 2.5 }}
          zoom={0.8}
          enableLegacyTransitions={true}
          transitionDuration={800}
          nodeSize={{ x: 320, y: 320 }}
          scaleExtent={{ min: 0.3, max: 1.5 }}
          initialDepth={1}
        />
      )}
    </div>
  );
};