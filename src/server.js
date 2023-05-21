const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

app.get("/api/nodes", async (req, res) => {
  const nodes = await prisma.node.findMany();
  res.json(nodes);
});

app.post("/api/nodes", async (req, res) => {
  const { name } = req.body;
  try {
    const node = await prisma.node.create({ data: { name } });
    res.json(node);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create node" });
  }
});

app.get("/api/links", async (req, res) => {
  const links = await prisma.link.findMany({
    include: { node: true },
  });
  res.json(links);
});

app.post("/api/links", async (req, res) => {
  const { source, target } = req.body;
  try {
    const link = await prisma.link.create({
      data: { source, target, node: { connect: { name: source } } },
      include: { node: true },
    });
    res.json(link);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create link" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});


// const express = require('express');
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// const app = express();
// app.use(express.json());

// app.get('/data', async (req, res) => {
//   const nodes = await prisma.node.findMany();
//   const links = await prisma.link.findMany();
//   res.json({ nodes, links });
// });

// app.post('/network', async (req, res) => {
//     const { nodeName, connectedTo } = req.body;
    
//     // Input validation
//     if (!nodeName || !connectedTo) {
//       res.status(400).json({ error: 'Invalid request. Node name and connectedTo are required.' });
//       return;
//     }
  
//     // Find the existing node that the new node will be connected to
//     const existingNode = await prisma.node.findUnique({
//       where: {
//         name: connectedTo,
//       },
//     });
  
//     if (!existingNode) {
//       res.status(400).json({ error: `Node with name "${connectedTo}" not found in current network.` });
//       return;
//     }
  
//     // Create a new node and a link to the existing node
//     const newNode = await prisma.node.create({
//       data: {
//         name: nodeName,
//       },
//     });
  
//     const newLink = await prisma.link.create({
//       data: {
//         sourceNodeId: existingNode.id,
//         targetNodeId: newNode.id,
//       },
//     });
  
//     // Return the new node and link
//     res.json({ newNode, newLink });
//   });
  
// app.listen(3000, () => console.log('Server is running on http://localhost:3000'));
