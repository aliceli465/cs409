import React, { useState, useEffect } from "react";
import { Tree } from "react-d3-tree";
import exampleGraph from "./test_graph.json";
//example output for test.c
//dict_items([('printf_hello', []), ('is_prime', []), ('fibonacci', []), ('main', ['printf_hello', 'is_prime'])])
//example data in test_Graph.json

const transformDependencyGraph = (graph) => {
  const createNode = (func) => ({
    name: func,
    children: (graph[func] || []).map(createNode),
  });

  return createNode("main"); //this mena smain has to exist for now
};

const DependencyGraph = () => {
  const [treeData, setTreeData] = useState(null);

  useEffect(() => {
    setTreeData(transformDependencyGraph(exampleGraph));
  }, []);

  if (!treeData) return <div>Loading...</div>;

  return (
    <div style={{ width: "100vh", height: "100vh" }}>
      <Tree
        data={treeData}
        orientation="vertical"
        translate={{ x: 300, y: 200 }}
        zoomable
        styles={{
          nodes: {
            node: {
              circle: { fill: "#88c0d0" },
              name: { fontSize: "12px", fontWeight: "bold" },
              attributes: { fontSize: "10px" },
            },
            leafNode: {
              circle: { fill: "#8fbcbb" },
            },
          },
        }}
      />
    </div>
  );
};

export default DependencyGraph;
