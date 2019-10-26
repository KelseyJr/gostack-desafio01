const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

function checkIfProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if(!project) {
    return res.status(400).json({ error: 'Project does not exist' });
  }

  req.project = project;
  return next();
}

function checkIfTitleIsInBody(req, res, next) {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Must have title in the body' });
  }
  req.title = title;
  return next();
}

function countAllRequests(req, res, next) {
  console.count('Requisições realizadas até o momento');
  return next();
}

server.use(countAllRequests);

// Add project to array
server.post('/projects', checkIfTitleIsInBody, (req, res) => {
  const project = {
    id: projects.length + 1,
    title: req.title,
    tasks: []
  };
  projects.push(project);

  return res.json(projects);
});

// List all projects
server.get('/projects', (req, res) => {
  return res.json(projects);
});

// Update single project
server.put('/projects/:id', checkIfProjectExists, checkIfTitleIsInBody, (req, res) => {
  const project = req.project;
  project.title = req.title;

  return res.json(projects);
});

// Delete a single project
server.delete('/projects/:id', checkIfProjectExists, (req, res) => {
  const project = req.project;
  projects.splice(project, 1);

  return res.send();
});

// Add task to project
server.post('/projects/:id/tasks', checkIfProjectExists, checkIfTitleIsInBody, (req, res) => {
  const project = req.project;
  project.tasks.push(req.title);

  return res.json(projects);
})

server.listen(3333);
