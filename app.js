const data = {
    nodes: [
      { id: 'Node 1' },
      { id: 'Node 2' },
      { id: 'Node 3' }
    ],
    links: [
      { source: 'Node 1', target: 'Node 2' },
      { source: 'Node 2', target: 'Node 3' }
    ]
  };
  
  const svg = d3.select('#network')
    .append('svg')
    .attr('width', 500)
    .attr('height', 500);

svg.style('background-color', 'black'); // Set the background color to black

  
  const simulation = d3.forceSimulation(data.nodes)
    .force('link', d3.forceLink(data.links).id(d => d.id).distance(100))
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(250, 150));
  
  const link = svg.selectAll('.link')
    .data(data.links)
    .enter()
    .append('line')
    .attr('class', 'link')
    .attr('stroke', 'white');
  
  const node = svg.selectAll('.node')
    .data(data.nodes)
    .enter()
    .append('circle')
    .attr('class', 'node')
    .attr('r', 10)
    .attr('fill', 'steelblue')
    .style('stroke', 'white') // Set the color of the node borders to white
    .call(drag(simulation)); // Enable dragging for the nodes
  
  simulation.on('tick', () => {
    link.attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
  
    node.attr('cx', d => d.x)
      .attr('cy', d => d.y);
  });
  
  // Drag function for nodes
  function drag(simulation) {
    function dragStarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
  
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
  
    function dragEnded(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  
    return d3.drag()
      .on('start', dragStarted)
      .on('drag', dragged)
      .on('end', dragEnded);
  }
  