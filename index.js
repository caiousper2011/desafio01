const express = require("express");

const server = express();

server.use(express.json());

let requestCount = 0;
let projects = [];

function printResquestCount(req, res, next) {
  console.log(`Method: ${req.method}, URL: ${req.url}, Called: ${++requestCount}`);
  return next();
}

function checkProjectExists(req, res, next) {
  const { id: projectId } = req.params;
  const project = projects.filter((project, index) => {
    req.projectIndex = index;
    return project.id = projectId
  })[0];
  if (!project) {
    return res.json({ error: 'Project does not exists' });
  }
  req.project = project;
  return next();
}

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.post('/projects', (req, res) => {
  const project = req.body;
  projects.push(project);
  return res.json({ message: `${project.title} project successfully created` });
})

server.put('/projects/:id', checkProjectExists, (req, res) => {
  const project = req.project;
  const { title } = req.body;
  project.title = title;
  return res.json({ message: `${title} project successfully updated` });
})

server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { project } = req;
  projects.splice(req.projectIndex, 1);
  return res.json({ message: `${project.title} project successfully deleted` });
})

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  let { project } = req;
  const { title: task } = req.body;
  project.tasks.push(task);
  return res.json({
    message: `${task} task successfully created in ${project.title} project`
  });
})

server.listen(3333);