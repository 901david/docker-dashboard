import * as React from "react";
import * as classNames from "classnames";
import * as io from "socket.io-client";

const socket = io.connect();

export interface Container {
  id: string;
  name: string;
  image: string;
  state: string;
  status: string;
}

export const ContainerListItem: React.FC<Container> = ({
  id,
  name,
  image,
  state,
  status
}) => {
  const isRunning = state === "running";

  const onActionButtonClick = () => {
    const evt = isRunning ? "container.stop" : "container.start";
    socket.emit(evt, { id });
  };

  const panelClass = isRunning ? "success" : "default";
  const classes = classNames("panel", `panel-${panelClass}`);
  const buttonText = isRunning ? "Stop" : "Start";

  return (
    <div className="col-sm-3">
      <div className={classes}>
        <div className="panel-heading">{name}</div>
        <div className="panel-body">
          Status: {status}
          <br />
          Image: {image}
        </div>
        <div className="panel-footer">
          <button onClick={onActionButtonClick} className="btn btn-default">
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};
