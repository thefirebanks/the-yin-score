'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function NetworkPage() {
  const ref = useRef();

  useEffect(() => {
    if (!ref.current) {
      console.log("SVG not available yet");
      return;
    }

    const data = {
      nodes: [{ id: 'User 1' }, { id: 'User 2' }],
      links: [{ source: 'User 1', target: 'User 2' }],
    };

    if (!data.nodes.length || !data.links.length) {
      console.log("Data is empty");
      return;
    }

    const svg = d3.select(ref.current)
      .attr('width', 800)
      .attr('height', 600)
      .style('background-color', 'black');  // set SVG background to black

    const link = svg.append('g')
      .selectAll('line')
      .data(data.links)
      .join('line')
      .attr('stroke', 'white');  // set link color to white

    const node = svg.append('g')
      .selectAll('circle')
      .data(data.nodes)
      .join('circle')
      .attr('r', 10)  // increase node size
      .attr('fill', 'blue');  // set node color to blue

    // Add text labels to nodes
    const label = svg.append('g')
      .selectAll('text')
      .data(data.nodes)
      .join('text')
      .text(d => d.id)
      .style('fill', 'white');

    const simulation = d3.forceSimulation(data.nodes)
      .force('link', d3.forceLink(data.links).id(d => d.id))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(800 / 2, 600 / 2));

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
        
      label
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    });
  }, []);

  return (
    <div>
      <h1>User Network</h1>
      <svg ref={ref}></svg>
    </div>
  );
}

export default NetworkPage;
