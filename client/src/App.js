import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NavBar from "./components/Nav";
import Audit from "./pages/Audit"
import CompareByTime from "./pages/CompareByTime"
import CompareTwoServers from "./pages/CompareTwoServers"
import NoMatch from "./pages/NoMatch"

function App() {
  return (
    <Router>
        <NavBar />
        <Switch>
          <Route exact path="/" component={Audit} />
          <Route exact path="/compareByTime" component={CompareByTime} />
          <Route exact path="/compareTwoServers" component={CompareTwoServers} />
          <Route component={NoMatch} />
        </Switch>
    </Router>
  );
}

export default App;
