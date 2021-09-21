import Home from "./components/Home";
import SignUp from "./components/SignUp";
import Login from './components/Login'
import Dashboard from "./components/Dashboard";
import UpdateUser from "./components/UpdateUser";
import { Route, Switch } from "react-router-dom";
import { Redirect } from "react-router";
import { AppBar, Toolbar, Typography } from "@material-ui/core";


function App() {

  return (
    <div>
      <AppBar position="static" style={{ backgroundColor: "#37afe2" }}>
        <Toolbar>
          <Typography variant="h5" component="h1" style={{ color: "#c8d9ea" }}>
            Auth in MERN Stack
          </Typography>
        </Toolbar>
      </AppBar>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/signup" component={SignUp}>
          {localStorage.token && <Redirect to='/dashboard'/>}
        </Route>
        <Route exact path="/login" component={Login}>
          {localStorage.token && <Redirect to='/dashboard'/>}
        </Route>
        <Route exact path="/dashboard" component={Dashboard}>
          {!localStorage.token && <Redirect to='/login'/>}
        </Route>
        <Route exact path="/admin/:userid" component={UpdateUser}>
          {!localStorage.token && <Redirect to='/dashboard'/>}
        </Route>
      </Switch>
    </div>
  );
}

export default App;
