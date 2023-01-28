import React from "react";
import { Route, Switch } from "react-router-dom";
import SocketPost from "./socketPost";

function App() {
  return (
    <React.Fragment>
      <Switch>
        <Route path="/" exact component={SocketPost} />
      </Switch>
    </React.Fragment>
  );
}

export default App;
