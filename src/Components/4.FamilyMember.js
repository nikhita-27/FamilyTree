import React, { useState, useCallback } from 'react';
import Tree from 'react-d3-tree';

const convertToTreeData = (members) => {
  if (!Array.isArray(members) || members.length === 0) {
    return [];
  }

  const processNode = (member) => {
    let children = [];
    
    // Process regular children
    if (member.children && member.children.length > 0) {
      children = member.children.map(child => processNode(child));
    }

    // Base node data
    const nodeData = {
      name: `${member.Name} ${member.Surname}`,
      attributes: {
        Gothram: member.Gothram,
        Origin: member.Origin,
        id: member.id,
        hasSpouse: !!member.spouse,
        spouseData: member.spouse ? {
          name: `${member.spouse.Name} ${member.spouse.Surname}`,
          Gothram: member.spouse.Gothram,
          Origin: member.spouse.Origin,
          id: member.spouse.id
        } : null
      }
    };

    // If the node has parents, create a parent branch above it
    if (member.parents && member.parents.length > 0) {
      const parentGroup = {
        name: "Parents",
        attributes: { isParentGroup: true },
        children: member.parents.map(parent => ({
          name: `${parent.Name} ${parent.Surname}`,
          attributes: {
            Gothram: parent.Gothram,
            Origin: parent.Origin,
            id: parent.id,
            isParent: true,
            hasSpouse: !!parent.spouse,
            spouseData: parent.spouse ? {
              name: `${parent.spouse.Name} ${parent.spouse.Surname}`,
              Gothram: parent.spouse.Gothram,
              Origin: parent.spouse.Origin,
              id: parent.spouse.id
            } : null
          },
          children: []
        }))
      };
      return {
        ...parentGroup,
        children: [...parentGroup.children, { ...nodeData, children }]
      };
    }

    return { ...nodeData, children };
  };

  // Process all root level members
  return [{
    name: "Family Tree",
    attributes: {},
    children: members.map(member => processNode(member))
  }];
};

export const FamilyMembers = ({ FamilyTree, onAddPerson }) => {
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const containerRef = useCallback(containerElem => {
    if (containerElem !== null) {
      const { width, height } = containerElem.getBoundingClientRect();
      setDimensions({ width, height });
      setTranslate({ x: width / 2, y: height / 4 });
    }
  }, []);

  const handleAddNode = async (nodeDatum, type) => {
    const { id } = nodeDatum.attributes;
    
    if (!id) {
      alert("Please select a specific family member to add relative.");
      return;
    }

    const name = prompt("Enter name:");
    if (!name) return;
    
    const surname = prompt("Enter surname:");
    if (!surname) return;
    
    const gothram = prompt("Enter gothram:");
    if (!gothram) return;
    
    const origin = prompt("Enter origin:");
    if (!origin) return;

    const newPerson = {
      Name: name,
      Surname: surname,
      Gothram: gothram,
      Origin: origin,
      children: [],
      parents: []
    };

    onAddPerson(newPerson, id, type);
  };

  const renderNodeCard = (nodeDatum, isSpouse = false) => {
    return (
      <div
        className="node-container bg-white rounded-lg shadow-lg border border-gray-200"
        style={{
          position: 'relative',
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
            {nodeDatum.attributes?.isParent && <div className="text-purple-600">Parent</div>}
            {isSpouse && <div className="text-purple-600">Spouse</div>}
          </div>
          {!isSpouse && (
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
              {!nodeDatum.attributes?.hasSpouse && (
                <button
                  className="w-full bg-pink-500 text-white px-3 py-1.5 rounded hover:bg-pink-600 transition-colors text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddNode(nodeDatum, 'spouse');
                  }}
                >
                  Add Spouse
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderForeignObjectNode = ({ nodeDatum, toggleNode, foreignObjectProps }) => {
    // Parent group node
    if (nodeDatum.attributes?.isParentGroup) {
      return (
        <g>
          <circle r={15} fill="#9f7aea" />
          <foreignObject
            x="-60"
            y="-10"
            width="120"
            height="20"
          >
            <div className="text-center text-sm font-medium">
              {nodeDatum.name}
            </div>
          </foreignObject>
        </g>
      );
    }

    if (!nodeDatum.attributes?.id) {
      return null;
    }

    const spouseData = nodeDatum.attributes.spouseData;

    return (
      <g>
        <circle r={15} fill={nodeDatum.attributes.isParent ? "#9f7aea" : "#4299e1"} />
        
        {/* Main Node */}
        <foreignObject
          {...foreignObjectProps}
          style={{
            overflow: 'visible',
            pointerEvents: 'auto',
          }}
        >
          <div style={{
            position: 'relative',
            left: spouseData ? '-320px' : '-150px',
            top: '-120px',
          }}>
            {renderNodeCard(nodeDatum)}
          </div>
        </foreignObject>

        {/* Spouse Node */}
        {spouseData && (
          <>
            <path
              d="M 30,0 H 150"
              stroke="#9f7aea"
              strokeWidth="2"
              fill="none"
            />
            
            <circle cx="180" cy="0" r={15} fill="#9f7aea" />
            
            <foreignObject
              x="180"
              y="-120"
              width="300"
              height="240"
            >
              <div style={{
                position: 'relative',
                left: '20px',
              }}>
                {renderNodeCard({ 
                  name: spouseData.name,
                  attributes: {
                    Gothram: spouseData.Gothram,
                    Origin: spouseData.Origin,
                    id: spouseData.id
                  }
                }, true)}
              </div>
            </foreignObject>
          </>
        )}

        {/* Expand/Collapse Button */}
        {nodeDatum.children && nodeDatum.children.length > 0 && (
          <foreignObject
            x="-50"
            y="20"
            width="100"
            height="30"
          >
            <button
              className="w-full bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 transition-colors text-sm"
              onClick={(e) => {
                e.stopPropagation();
                toggleNode();
              }}
            >
              {nodeDatum.__rd3t.collapsed ? 'Expand' : 'Collapse'}
            </button>
          </foreignObject>
        )}
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
          separation={{ siblings: 4, nonSiblings: 5 }}
          zoom={0.6}
          enableLegacyTransitions={true}
          transitionDuration={800}
          nodeSize={{ x: 500, y: 400 }}
          scaleExtent={{ min: 0.2, max: 2 }}
          collapsible={true}
          initialDepth={3}
        />
      )}
    </div>
  );
};

export default FamilyMembers;