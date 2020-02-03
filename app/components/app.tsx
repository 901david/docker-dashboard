import * as React from "react";
import * as _ from "lodash";
import * as io from "socket.io-client";

import styled from "styled-components";
import { Route, BrowserRouter as Router, Redirect } from "react-router-dom";

import NavBar from "./NavBar";
import Dashboard from "./Dashboard";
import { NewContainerDialog } from "./newContainerModal";

const Header = styled.div`
  background: black;
  width: 100vw;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 25px;
  padding-right: 25px;

  img {
    width: 100px;
    height: 100px;
    margin-left: 10%;
  }
`;

const AppTitle = styled.h1`
  color: white;
  font-size: 45px;
`;

const socket = io.connect();

export const AppComponent: React.FC<{}> = () => {
  const onRunImage = (name: String): void => {
    socket.emit("image.run", { name });
  };
  return (
    <Router>
      <div>
        <Header>
          <AppTitle>DockHand</AppTitle>
          <img src="https://i.ya-webdesign.com/images/transparent-whale-docker-2.png" />
        </Header>
        <NavBar />
        <Route exact path="/" component={() => <Redirect to="/dashboard" />} />
        <Route exact path="/dashboard" component={() => <Dashboard />} />
        {/* <Route
          exact
          path="/new/container"
          component={() => <p>New Container just trigger model</p>}
        /> */}
        <Route
          exact
          path="/cluster/start"
          component={() => <p>Cluster Start</p>}
        />
        <Route
          exact
          path="/cluster/create"
          component={() => <p>Cluster Create</p>}
        />
        <NewContainerDialog id="newContainerModal" onRunImage={onRunImage} />
      </div>
    </Router>
  );
};
