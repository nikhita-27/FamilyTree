import React, { useState, useCallback } from 'react';
import Tree from 'react-d3-tree';

export const FamilyMembers = ({ FamilyTree = [], onAddPerson }) => {
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const containerRef = useCallback(containerElem => {
    if (containerElem !== null) {
      const { width, height } = containerElem.getBoundingClientRect();
      setDimensions({ width, height });
      setTranslate({ x: width / 2, y: height / 4 }); // Adjusted y position for better initial view
    }
  }, []);

  // Move the data conversion function definition up
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

  // Create treeData before using it
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
      <circle r={15} fill="#4299e1" />
      <foreignObject
        {...foreignObjectProps}
        style={{
          overflow: 'visible', // Changed to visible to prevent content clipping
          pointerEvents: 'auto' // Ensures buttons are clickable
        }}
      >
        <div 
          className="node-container bg-white rounded-lg shadow-lg border border-gray-200"
          style={{
            position: 'relative',
            left: '-200px', // Center the card relative to the node
            top: '-140px', // Adjust vertical position
            width: '400px',
            minHeight: '280px',
            padding: '1rem',
            zIndex: 1 // Ensure nodes are above the lines
          }}
        >
          <div className="text-center">
            <h3 className="font-bold text-lg mb-2">{nodeDatum.name}</h3>
            <div className="text-sm text-gray-600 mb-4">
              {nodeDatum.attributes?.Gothram && <div>Gothram: {nodeDatum.attributes.Gothram}</div>}
              {nodeDatum.attributes?.Origin && <div>Origin: {nodeDatum.attributes.Origin}</div>}
            </div>
            <div className="flex flex-col gap-3">
              <button
                className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddNode(nodeDatum, 'parent');
                }}
              >
                Add Parent
              </button>
              <button
                className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddNode(nodeDatum, 'child');
                }}
              >
                Add Child
              </button>
              <button
                className="w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddNode(nodeDatum, 'sibling');
                }}
              >
                Add Sibling
              </button>
              {nodeDatum.children && nodeDatum.children.length > 0 && (
                <button
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
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
                width: 400,
                height: 280,
                x: 0,
                y: 0
              }
            })
          }
          pathFunc="step"
          separation={{ siblings: 4, nonSiblings: 4.5 }}
          zoom={0.6}
          enableLegacyTransitions={true}
          transitionDuration={800}
          nodeSize={{ x: 400, y: 400 }}
        />
      )}
    </div>
  );
};