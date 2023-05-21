// Initialize the network
updateVisualization();

// Define the initial nodes and links
const initialNodes = [
  { id: "Node 1", name: "Alice" },
  { id: "Node 2", name: "Bob" },
  { id: "Node 3", name: "Carol" },
];

const initialLinks = [
  { source: "Node 1", target: "Node 2" },
  { source: "Node 2", target: "Node 3" },
];

// Update the data object with the initial nodes and links
data = {
  nodes: initialNodes,
  links: initialLinks,
};

// Call the updateVisualization() function again to display the initial network
updateVisualization();

// Fetch nodes data
fetch('/api/nodes')
  .then(response => response.json())
  .then(nodes => {
    data.nodes = nodes;
    updateVisualization();
  })
  .catch(error => console.error(error));

// Fetch links data
fetch('/api/links')
  .then(response => response.json())
  .then(links => {
    data.links = links;
    updateVisualization();
  })
  .catch(error => console.error(error));

// Container for the network
const svg = d3
.select("#network")
.append("svg")
.attr("width", 500)
.attr("height", 500);

svg.style("background-color", "black"); // Set the background color to black

const simulation = d3
.forceSimulation(data.nodes)
.force(
  "link",
  d3
    .forceLink(data.links)
    .id((d) => d.id)
    .distance(100)
)
.force("charge", d3.forceManyBody())
.force("center", d3.forceCenter(250, 150));

// Container for the links
const linkGroup = svg.append("g").attr("class", "links");

// Container for the nodes
const nodeGroup = svg.append("g").attr("class", "nodes");


function updateVisualization() {
  link = linkGroup
    .selectAll(".link")
    .data(data.links)
    .enter()
    .append("line")
    .attr("class", "link")
    .attr("stroke", "white");

  node = nodeGroup
    .selectAll(".node")
    .data(data.nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .call(drag(simulation))
    .each(function (d) {
      const textWidth = getTextWidth(d.name);
      const nodeRadius = textWidth / 2 + 4;
      d.radius = nodeRadius;
    });

  node
    .append("circle")
    .attr("r", (d) => d.radius)
    .style("fill", "steelblue")
    .style("stroke", "white");

  node
    .append("text")
    .attr("dy", 4)
    .attr("text-anchor", "middle")
    .style("fill", "white")
    .style("font-size", "12px")
    .text((d) => d.name);

  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("transform", (d) => `translate(${d.x},${d.y})`);
  });
}

// Function to calculate the width of the text
function getTextWidth(text) {
const tempText = svg.append("text").text(text).style("opacity", 0);
const width = tempText.node().getComputedTextLength();
tempText.remove();
return width;
}

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

return d3
  .drag()
  .on("start", dragStarted)
  .on("drag", dragged)
  .on("end", dragEnded);
}

// SECOND VERSION OF THE CODE

// // Prompt user for their name
// const user_name = prompt("Please enter your name:");
// if (user_name) {
// const connectedTo = prompt(
//   "Who are you connected to? (Enter the name of an existing node):"
// );
// const existingNode = data.nodes.find((node) => node.name === connectedTo);

// if (existingNode) {
//   const newNode = { id: "Node " + (data.nodes.length + 1), name: user_name };
//   const textWidth = getTextWidth(newNode.name); // Calculate the width of the text label
//   const nodeRadius = textWidth / 2 + 4; // Adjust the radius based on the text width
//   newNode.radius = nodeRadius; // Store the radius in the newNode data for later use
//   data.nodes.push(newNode);

//   const newLink = { source: existingNode.id, target: newNode.id };
//   data.links.push(newLink);

//   // Update the simulation with the new data
//   simulation.nodes(data.nodes);
//   simulation.force("link").links(data.links);
//   simulation.alpha(1).restart();

//   // Redraw the links
//   linkGroup
//     .selectAll(".link")
//     .data(data.links)
//     .join("line")
//     .attr("class", "link")
//     .attr("stroke", "white");

//   // Redraw the nodes
//   const nodesSelection = nodeGroup
//     .selectAll(".node")
//     .data(data.nodes, (d) => d.id)
//     .join(
//       (enter) =>
//         enter.append("g").attr("class", "node").call(drag(simulation)),
//       (update) => update,
//       (exit) => exit.remove()
//     );

//   nodesSelection
//     .selectAll("circle")
//     .data((d) => [d])
//     .join("circle")
//     .attr("r", (d) => (d.radius = getTextWidth(d.name) / 2 + 4))
//     .style("fill", "steelblue")
//     .style("stroke", "white");

//   nodesSelection
//     .selectAll("text")
//     .data((d) => [d])
//     .join("text")
//     .attr("dy", 4)
//     .attr("text-anchor", "middle")
//     .style("fill", "white")
//     .style("font-size", "12px")
//     .text((d) => d.name);

//   simulation.on("tick", () => {
//     svg
//       .selectAll(".link")
//       .attr("x1", (d) => d.source.x)
//       .attr("y1", (d) => d.source.y)
//       .attr("x2", (d) => d.target.x)
//       .attr("y2", (d) => d.target.y);

//     svg
//       .selectAll(".node")
//       .attr("transform", (d) => `translate(${d.x},${d.y})`);
//   });
// } else {
//   alert("The specified node does not exist in the graph.");
// }
// }

//   });

// FIRST VERSION OF THE CODE THAT WORKS

// // Data
// const data = {
//   nodes: [
//     { id: "Node 1", name: "Alice" },
//     { id: "Node 2", name: "Bob" },
//     { id: "Node 3", name: "Carol" },
//   ],
//   links: [
//     { source: "Node 1", target: "Node 2" },
//     { source: "Node 2", target: "Node 3" },
//   ],
// };

// // Container for the network
// const svg = d3
//   .select("#network")
//   .append("svg")
//   .attr("width", 500)
//   .attr("height", 500);

// svg.style("background-color", "black"); // Set the background color to black

// const simulation = d3
//   .forceSimulation(data.nodes)
//   .force(
//     "link",
//     d3
//       .forceLink(data.links)
//       .id((d) => d.id)
//       .distance(100)
//   )
//   .force("charge", d3.forceManyBody())
//   .force("center", d3.forceCenter(250, 150));

// // Container for the links
// const linkGroup = svg.append("g").attr("class", "links");

// // Container for the nodes
// const nodeGroup = svg.append("g").attr("class", "nodes");

// const link = linkGroup
//   .selectAll(".link")
//   .data(data.links)
//   .enter()
//   .append("line")
//   .attr("class", "link")
//   .attr("stroke", "white");

// const node = nodeGroup
//   .selectAll(".node")
//   .data(data.nodes)
//   .enter()
//   .append("g")
//   .attr("class", "node")
//   .call(drag(simulation)) // Enable dragging for the nodes
//   .each(function (d) {
//     const textWidth = getTextWidth(d.name); // Calculate the width of the text label
//     const nodeRadius = textWidth / 2 + 4; // Adjust the radius based on the text width
//     d.radius = nodeRadius; // Store the radius in the node data for later use
//   });

// // Append circles for the nodes
// node
//   .append("circle")
//   .attr("r", (d) => d.radius)
//   .style("fill", "steelblue")
//   .style("stroke", "white");

// // Append text labels for the node names
// node
//   .append("text")
//   .attr("dy", 4)
//   .attr("text-anchor", "middle")
//   .style("fill", "white")
//   .style("font-size", "12px") // Adjust the font size if needed
//   .text((d) => d.name);

// simulation.on("tick", () => {
//   link
//     .attr("x1", (d) => d.source.x)
//     .attr("y1", (d) => d.source.y)
//     .attr("x2", (d) => d.target.x)
//     .attr("y2", (d) => d.target.y);

//   node.attr("transform", (d) => `translate(${d.x},${d.y})`); // Add the transform attribute
// });

// // Function to calculate the width of the text
// function getTextWidth(text) {
//   const tempText = svg.append("text").text(text).style("opacity", 0);
//   const width = tempText.node().getComputedTextLength();
//   tempText.remove();
//   return width;
// }

// // Drag function for nodes
// function drag(simulation) {
//   function dragStarted(event, d) {
//     if (!event.active) simulation.alphaTarget(0.3).restart();
//     d.fx = d.x;
//     d.fy = d.y;
//   }

//   function dragged(event, d) {
//     d.fx = event.x;
//     d.fy = event.y;
//   }

//   function dragEnded(event, d) {
//     if (!event.active) simulation.alphaTarget(0);
//     d.fx = null;
//     d.fy = null;
//   }

//   return d3
//     .drag()
//     .on("start", dragStarted)
//     .on("drag", dragged)
//     .on("end", dragEnded);
// }

// // Prompt user for their name
// const user_name = prompt("Please enter your name:");
// if (user_name) {
//   const connectedTo = prompt(
//     "Who are you connected to? (Enter the name of an existing node):"
//   );
//   const existingNode = data.nodes.find((node) => node.name === connectedTo);

//   if (existingNode) {
//     const newNode = { id: "Node " + (data.nodes.length + 1), name: user_name };
//     const textWidth = getTextWidth(newNode.name); // Calculate the width of the text label
//     const nodeRadius = textWidth / 2 + 4; // Adjust the radius based on the text width
//     newNode.radius = nodeRadius; // Store the radius in the newNode data for later use
//     data.nodes.push(newNode);

//     const newLink = { source: existingNode.id, target: newNode.id };
//     data.links.push(newLink);

//     // Update the simulation with the new data
//     simulation.nodes(data.nodes);
//     simulation.force("link").links(data.links);
//     simulation.alpha(1).restart();

//     // Redraw the links
//     linkGroup
//       .selectAll(".link")
//       .data(data.links)
//       .join("line")
//       .attr("class", "link")
//       .attr("stroke", "white");

//     // Redraw the nodes
//     const nodesSelection = nodeGroup
//       .selectAll(".node")
//       .data(data.nodes, (d) => d.id)
//       .join(
//         (enter) =>
//           enter.append("g").attr("class", "node").call(drag(simulation)),
//         (update) => update,
//         (exit) => exit.remove()
//       );

//     nodesSelection
//       .selectAll("circle")
//       .data((d) => [d])
//       .join("circle")
//       .attr("r", (d) => (d.radius = getTextWidth(d.name) / 2 + 4))
//       .style("fill", "steelblue")
//       .style("stroke", "white");

//     nodesSelection
//       .selectAll("text")
//       .data((d) => [d])
//       .join("text")
//       .attr("dy", 4)
//       .attr("text-anchor", "middle")
//       .style("fill", "white")
//       .style("font-size", "12px")
//       .text((d) => d.name);

//     simulation.on("tick", () => {
//       svg
//         .selectAll(".link")
//         .attr("x1", (d) => d.source.x)
//         .attr("y1", (d) => d.source.y)
//         .attr("x2", (d) => d.target.x)
//         .attr("y2", (d) => d.target.y);

//       svg
//         .selectAll(".node")
//         .attr("transform", (d) => `translate(${d.x},${d.y})`);
//     });
//   } else {
//     alert("The specified node does not exist in the graph.");
//   }
// }
