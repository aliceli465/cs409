import React, { useState, useEffect } from "react";
import { Tree } from "react-d3-tree";
// import exampleGraph from "./test_graph.json";
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

const DependencyGraph = ({ value }) => {
  const [treeData, setTreeData] = useState(null);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        // Send the codes content to the backend
        const response = await fetch(
          "https://cs409-flask.vercel.app//graph-dependencies",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ value }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch dependency graph");
        }

        const data = await response.json();
        console.log(data);
        setTreeData(transformDependencyGraph(data));
      } catch (error) {
        console.error("Error fetching dependency graph:", error);
      }
    };

    if (value) {
      fetchGraph();
    }
  }, [value]);

  if (!value) return <div>No code provided</div>;
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
