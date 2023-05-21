"use client";
import { useEffect, useRef } from "react";
import { DataSet, Network } from "vis-network/standalone";

const NetworkVisualization: React.FC = () => {
  const networkRef = useRef(null);

  useEffect(() => {
    const data = {
      nodes: new DataSet([
        { id: "Node 1" },
        { id: "Node 2" },
        { id: "Node 3" },
      ]),
      edges: new DataSet([
        { id: "Edge 1", from: "Node 1", to: "Node 2" },
        { id: "Edge 2", from: "Node 2", to: "Node 3" },
      ]),
    };

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

      new Network(container, data, options);
    }
  }, []);

  return (
    <div className="bg-slate-800 h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4 text-black bg-slate-400 rounded-md">
        The Yin-Network
      </h1>
      <div className="bg-black w-500 h-500" ref={networkRef}></div>
    </div>
  );
};

export default NetworkVisualization;
