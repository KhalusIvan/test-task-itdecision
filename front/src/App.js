import React from 'react';
import {Route, Switch} from "react-router-dom";
import { ListTodo } from './components/ListTodo';
import { Authorization } from './components/Authorization';
import { OneTodo } from './components/OneTodo';
import './index.css';

function App() {
  return (
    <div className="background">
      <Switch>
        <Route exact path='/' component={Authorization}/>
        <Route path='/tasks/:id' component={OneTodo}/>
        <Route path='/tasks' component={ListTodo}/>
      </Switch>
    </div>
  );
}

export default App;
