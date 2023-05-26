"use client";

import React, { useEffect, useRef, useState } from "react";
import { DataSet, Network } from "vis-network/standalone";

interface Node {
  id: string;
  name: string;
}

interface Edge {
  id: string;
  from: string;
  to: string;
}

const NetworkVisualization: React.FC = () => {
  const networkRef = useRef(null);
  const [data, setData] = useState<{
    nodes: DataSet<Node>;
    edges: DataSet<Edge>;
  }>({
    nodes: new DataSet<Node>([
      { id: "Node 1", name: "Alice" },
      { id: "Node 2", name: "Bob" },
      { id: "Node 3", name: "Carol" },
    ]),
    edges: new DataSet<Edge>([
      { id: "Edge 1", from: "Node 1", to: "Node 2" },
      { id: "Edge 2", from: "Node 2", to: "Node 3" },
    ]),
  });

  const [newNodeName, setNewNodeName] = useState<string>("");
  const [linkedNodeId, setLinkedNodeId] = useState<string>("");

  useEffect(() => {
    const container = networkRef.current;

    if (container) {
      const options = {
        nodes: {
          color: "steelblue",
        },
        edges: {
          color: "white",
        },
        physics: {
          enabled: true,
        },
      };

      const network = new Network(container, data, options);

      network.on("afterDrawing", (ctx) => {
        const nodes = data.nodes.get();
        nodes.forEach((node) => {
          const { x, y } = network.getPositions([node.id])[node.id];
          ctx.fillStyle = "white";
          ctx.font = "12px Arial";
          ctx.fillText(node.name, x, y);
        });
      });
    }
  }, [data]);

  const handleAddNode = () => {
    const newNodeId = `Node ${data.nodes.length + 1}`;
    const newNodes = new DataSet<Node>([
      ...data.nodes.get(),
      { id: newNodeId, name: newNodeName },
    ]);

    if (linkedNodeId !== "") {
      const newEdgeId = `Edge ${data.edges.length + 1}`;
      const newEdge = {
        id: newEdgeId,
        from: newNodeId,
        to: linkedNodeId,
      };
      const newEdges = new DataSet<Edge>([...data.edges.get(), newEdge]);

      setData({ nodes: newNodes, edges: newEdges });
    } else {
      setData({ nodes: newNodes, edges: data.edges });
    }

    setNewNodeName("");
    setLinkedNodeId("");
  };

  return (
    <div className="bg-slate-800 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4 text-black bg-slate-400 rounded-md">
        The Yin-Network
      </h1>
      <div className="bg-black w-96 h-96" ref={networkRef}></div>
      <div className="flex flex-col items-center mt-4">
        <input
          type="text"
          className="border border-gray-400 rounded-md px-2 py-1 mb-2 focus:outline-none text-black"
          placeholder="New Node Name"
          value={newNodeName}
          onChange={(e) => setNewNodeName(e.target.value)}
        />
        <select
          className="border-t border-b border-r border-gray-400 rounded-md px-2 py-1 mb-6 focus:outline-none text-slate-800"
          value={linkedNodeId}
          defaultValue={linkedNodeId}
          onChange={(e) => setLinkedNodeId(e.target.value)}
        >
          <option value="">Select Node To Link To</option>
          {data.nodes.get().map((node) => (
            <option key={node.id} value={node.id}>
              {node.name}
            </option>
          ))}
        </select>
        <button
          className="bg-blue-500 text-white px-4 py-2"
          disabled={!newNodeName || newNodeName.trim() === ""}
          onClick={handleAddNode}
        >
          Add Node
        </button>
      </div>
    </div>
  );
};

export default NetworkVisualization;
