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
    todos: []
  }

  users.push(user);

  return response.status(201).json(user);

});

app.get('/todos', checksExistsUserAccount, (request, response) => {

  const { user } = request;
  console.log(user);

  return response.status(201).json(user.todos);

});

app.post('/todos', checksExistsUserAccount, (request, response) => {

  const { title, deadline } = request.body;
  const { user } = request;

  

  const newTodo = {
    title,
    done: false,
    deadline
  }

  user.todos.push(newTodo);

  return response.status(201).json(newTodo);

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const { title, deadline } = request.body;

  if(user.todos[0].id !== id){
    return response.status(400).json({error: 'Id not exist!'});
  }

  user.todos[0].title = title;
  user.todos[0].deadline = deadline;

  return response.status(201).json(user.todos);

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  if(user.todos[0].id !== id){
    return response.status(400).json({error: 'Id not exist!'});
  }

  user.todos.splice(user.todos[0], 1);

  return response.json(user.todos);
});

module.exports = app;