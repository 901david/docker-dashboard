import * as React from "react";
import * as classNames from "classnames";
import * as io from "socket.io-client";
import { useMappedState } from "react-use-mapped-state";
import styled from "styled-components";

import SearchIcon from "./SearchIcon";
import StartStopIcon from "./StartStop";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpandAlt } from "@fortawesome/free-solid-svg-icons";

const socket = io.connect();

interface IContainerListItemWrapperProps {
  isLarge: boolean;
}

const ContainerListItemWrapper = styled.div<IContainerListItemWrapperProps>`
  border: 3px solid #666;
  box-shadow: 5px 5px 8px rgba(102, 102, 102, 0.3);
  border-radius: 10px;
  margin: 25px;
  overflow: auto;
  transition: all 0.75s;
  ${({ isLarge }) => isLarge && "grid-column: 1 / -1"};
`;

interface IContainerHeaderProps {
  bgColor?: string;
}

const ContainerHeader = styled.div<IContainerHeaderProps>`
  background: rgb(${({ bgColor }) => bgColor || "102,102,102"});
  min-height: 50px;
  display: flex;
  align-items: center;

  > svg {
    font-size: 35px;
    justify-self: flex-end;
    margin-right: 5px;
  }

  > span {
    margin-left: 5px;
  }
`;

const ContainerHeaderWrapper = styled.div`
  border-radius: 10px;
  border: 2px solid #f5f5f5;
`;

interface Mount {
  Type: string;
  Source: string;
  Destination: string;
  Mode: string;
  RW: boolean;
  Propagation: string;
}

interface Port {
  IP?: string;
  PrivatePort?: number;
  PublicPort?: number;
  Type: string;
}

export interface Container {
  id: string;
  name: string;
  image: string;
  state: string;
  status: string;
  ports: Array<Port>;
  volumes: Array<string>;
  mounts: Array<Mount>;
  command: string;
}

interface IContainerListItemInitialState {
  logStreams: Array<string>;
  isStreaming: boolean;
  isLarge: boolean;
  copySuccess: boolean;
  inputText: string;
}

const ContainerListItemInitialState: IContainerListItemInitialState = {
  logStreams: [],
  isStreaming: false,
  isLarge: false,
  copySuccess: false,
  inputText: ""
};

export const ContainerListItem: React.FC<Container> = ({
  id,
  name,
  image,
  state,
  status,
  ports,
  volumes,
  mounts,
  command
}) => {
  const [
    { logStreams, isStreaming, isLarge, copySuccess, inputText },
    valueSetter
  ] = useMappedState(ContainerListItemInitialState);

  const logRef: React.RefObject<HTMLDivElement> = React.createRef();
  const idRef: React.RefObject<HTMLInputElement> = React.createRef();
  const isRunning = state === "running";

  const onActionButtonClick = () => {
    const evt = isRunning ? "container.stop" : "container.start";
    socket.emit(evt, { id });
  };

  const onPipeLogs = () => {
    socket.emit("container.pipe_logs", { id });
    valueSetter("isStreaming", true);
  };

  const onStopPipeLogs = () => {
    socket.emit("container.stop_pipe_logs", { id });
    valueSetter("isStreaming", false);
  };

  const updateLogScroll = () => {
    if (logRef.current !== null)
      logRef.current.scrollTop = logRef.current.scrollHeight;
  };

  const onRemoveContainer = () => {
    socket.emit("container.remove", { id });
  };

  React.useEffect(() => {
    socket.on(
      `container.return_piped_logs.${id}`,
      (logStreamsNew: { results: Array<string> }, err: any) => {
        if (err) throw err;
        if (logStreamsNew.results) {
          valueSetter("logStreams", logStreams.concat(logStreamsNew.results));
        }
      }
    );

    socket.on("container.removed_success", (data: any, err: any) => {
      //clear circular check;
      console.log(data, err);
    });

    socket.on("container.removed_fail", (data: any, err: any) => {
      //clear circular check;
      console.log(data, err);
    });
  }, []);

  const logStyles = {
    overflow: "scroll"
  };

  React.useEffect(() => {
    updateLogScroll();
  }, [logStreams]);

  const reg = new RegExp(`${inputText}`, "g");

  const dataToUse =
    inputText.length !== 0
      ? logStreams.filter((stream: string) =>
          stream.match(reg) ? stream.match(reg).length > 0 : false
        )
      : logStreams;

  const changeSize = (isLarge: boolean) => {
    valueSetter("isLarge", !isLarge);
  };

  const copyToClipboard = (ref: React.RefObject<HTMLInputElement>) => {
    if (ref.current !== null) {
      ref.current.style.display = "block";
      ref.current.select();
      document.execCommand("copy");
      ref.current.style.display = "none";
      valueSetter("copySuccess", true);
      setTimeout(() => {
        valueSetter("copySuccess", false);
      }, 2000);
    }
  };

  const handleTextChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    valueSetter("inputText", evt.target.value);
  };

  return (
    <ContainerListItemWrapper isLarge={isLarge} className="give-transition">
      <div style={{ transition: "all 1s", height: "300px", overflow: "auto" }}>
        <ContainerHeaderWrapper>
          <ContainerHeader bgColor={isRunning ? "45,201,55" : "204,50,50"}>
            <span>{name}</span>
            <StartStopIcon
              handleAction={onActionButtonClick}
              type={isRunning ? "stop" : "start"}
            />
            <FontAwesomeIcon
              onClick={() => changeSize(isLarge)}
              icon={faExpandAlt}
            />
          </ContainerHeader>
          <ContainerHeader>
            {!isStreaming && (
              <button onClick={onPipeLogs} className="btn btn-default">
                Start Streaming Logs
              </button>
            )}

            {isStreaming && (
              <button onClick={onStopPipeLogs} className="btn btn-default">
                Stop Streaming Logs
              </button>
            )}
            {!isRunning && (
              <button onClick={onRemoveContainer} className="btn btn-default">
                Remove
              </button>
            )}
          </ContainerHeader>
        </ContainerHeaderWrapper>
        <div style={{ padding: "25px" }}>
          Id: <span title={id}>{id.slice(0, 16) + "..."}</span>{" "}
          {document.queryCommandSupported("copy") && (
            <div>
              <input
                style={{
                  display: "none",
                  position: "absolute",
                  left: "-3000px"
                }}
                ref={idRef}
                type="text"
                value={id}
              />
              <button onClick={() => copyToClipboard(idRef)}>Copy</button>
              {copySuccess && <span>Copied!</span>}
            </div>
          )}
          <br />
          Status: {status}
          <br />
          Image: {image}
          <br />
          Volumes: <span>{volumes.join(", ")}</span>
          <br />
          Mounts:{" "}
          {mounts.map(
            ({ Type, Source, Destination, Mode, RW, Propagation }) => (
              <>
                <p>Type: {Type}</p>
                <p>Source: {Source}</p>
                <p>Destination: {Destination}</p>
                <p>Mode: {Mode}</p>
                <p>RW: {RW}</p>
                <p>Propagation: {Propagation}</p>
              </>
            )
          )}
          <br />
          Ports:{" "}
          {ports.map((portObj: Port) => {
            return Object.keys(portObj).map((portData: keyof Port) => {
              return <span style={{ margin: "3px" }}>{portData}</span>;
            });
          })}
          <br />
          Command: <span>{command}</span>
        </div>
      </div>

      <div>
        <div
          style={{ display: "flex", alignItems: "center" }}
          className="panel-heading"
        >
          <h3 style={{ marginRight: "5px" }}>Logs</h3>
          <SearchIcon
            disabled={logStreams.length === 0}
            handleTextChange={handleTextChange}
            inputText={inputText}
            searchClickHandler={data => console.log(data)}
          />
        </div>
        <div ref={logRef} style={logStyles} className="panel-body">
          {dataToUse.length === 0 && <h1>No logs to show currently</h1>}
          {dataToUse.map((log: string, index: number) => {
            return <p key={index}>{log}</p>;
          })}
        </div>
      </div>
    </ContainerListItemWrapper>
  );
};
