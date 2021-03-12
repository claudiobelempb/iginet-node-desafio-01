const express = require('express');
const cors = require('cors');

const { v4: uuid } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

/**
{ 
	id: 'uuid', // precisa ser um uuid
	name: 'Danilo Vieira', 
	username: 'danilo', 
	todos: []
}
 */

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const user = users.find(user => user.username === username);
  if(!user) {
    return response.status(400).json({error: 'User already in our database'});
  }
  request.user = user;
  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;
  
  const userExists = users.some(user => user.username === username);

  if(userExists){
    return response.status(400).json({error: 'User already in our database'});
  }

  const user = {
    id: uuid(),
    name,
    username,
    todo: []
  }

  users.push(user);

  return response.status(201).json(user);

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  const todos = user.todo;

  return response.status(201).json(todos);

});

app.post('/todos', checksExistsUserAccount, (request, response) => {

  const { title, deadline } = request.body;
  const { user } = request;

  const todo = {
    id: uuid(),
    title,
    done: false,
    deadline: new Date(),
    created_at: new Date(),
  }


  user.todo.push(todo);

  return response.status(201).json(todo);

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;