import * as React from "react";
import * as _ from "lodash";
import * as io from "socket.io-client";
import { useMappedState } from "react-use-mapped-state";
import styled, { css } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExpandAlt,
  faPaste,
  faCheckCircle,
  faFolderPlus,
  faFilter,
  faTrashAlt,
  faTachometerAlt
} from "@fortawesome/free-solid-svg-icons";

import SearchIcon from "./SearchIcon";
import StartStopIcon from "./StartStop";

const socket = io.connect();

interface IContainerListItemWrapperProps {
  isLarge: boolean;
}

const ContainerListItemWrapper = styled.div<IContainerListItemWrapperProps>`
  border: 3px solid #666;
  box-shadow: 5px 5px 8px rgba(102, 102, 102, 0.3);
  border-radius: 10px;
  margin: 15px;
  overflow: auto;
  transition: all 0.75s;
  ${({ isLarge }) => isLarge && "grid-column: 1 / -1"};
`;

interface ILogsHeaderWrapperProps {
  filtersDisabled: boolean;
  isShowing: boolean;
}

const LogsHeaderWrapper = styled.div<ILogsHeaderWrapperProps>`
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  svg {
    font-size: 25px;
  }

  .stream-logs-on {
    color: rgb(45, 201, 55);
    cursor: pointer;
  }

  .stream-logs-off {
    color: rgb(204, 50, 50);
    cursor: pointer;
  }

  .open-filter {
    cursor: ${({ filtersDisabled }) =>
      filtersDisabled ? "not-allowed" : "pointer"};
    color: ${({ filtersDisabled }) => (filtersDisabled ? "#999" : "black")};
  }

  .quick-filters {
    cursor: ${({ filtersDisabled }) =>
      filtersDisabled ? "not-allowed" : "pointer"};
    color: ${({ isShowing, filtersDisabled }) =>
      !filtersDisabled
        ? isShowing
          ? "rgb(204,50,50)"
          : "rgb(45,201,55)"
        : "#999"};
  }
`;

interface IContainerHeaderProps {
  bgColor?: string;
}

const ContainerHeader = styled.div<IContainerHeaderProps>`
  background: rgb(${({ bgColor }) => bgColor || "102,102,102"});
  min-height: 100px;
  display: flex;
  justify-content: space-between;
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

  .expand-card {
    margin-right: 15px;
  }

  .remove-container {
    width: 33px;
    height: 33px;
  }
`;

const ContainerIdWrapper = styled.div`
  display: flex;

  .success-icon {
    opacity: 0;
    transition: all 1s;
    color: #4bb543;
    margin-left: 3px;
  }

  .clipboard-icon {
    margin-left: 3px;
  }
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

type QuickFilterData = {
  [key: string]: boolean;
};

const quickFilterDataStarterState: {
  [key: string]: boolean;
} = {
  INFO: false,
  SEVERE: false,
  WARN: false
};

interface IContainerListItemInitialState {
  logStreams: Array<string>;
  isStreaming: boolean;
  isLarge: boolean;
  inputText: string;
  filterTriggeredByIcon: boolean;
  quickFilterData: QuickFilterData;
  quickFiltersOpen: boolean;
}

const ContainerListItemInitialState: IContainerListItemInitialState = {
  logStreams: [],
  isStreaming: false,
  isLarge: false,
  inputText: "",
  filterTriggeredByIcon: false,
  quickFilterData: quickFilterDataStarterState,
  quickFiltersOpen: false
};

const SubHeaderWrapper = styled.div`
  display: flex;
  color: white;
  align-items: center;
  margin: 2px;
  margin-left: 15px;
`;

const HiddenInput = styled.input`
  display: none;
  position: absolute;
  left: -3000px;
`;

interface IContainerStatusProps {
  isRunning: boolean;
}

const ContainerStatus = styled.p<IContainerStatusProps>`
  background: rgb(
    ${({ isRunning }) => (isRunning ? "45,201,55" : "204,50,50")}
  );
  color: ${({ isRunning }) => (isRunning ? "black" : "white")};
  padding: 2px;
  border-radius: 5px;
`;

const MountsWrapper = styled.div`
  margin-left: 25px;
`;

const PortsWrapper = styled.div`
  margin-left: 25px;
`;

interface IQuickFiltersWrapperProps {
  isShowing: boolean;
}

const QuickFiltersWrapper = styled.div<IQuickFiltersWrapperProps>`
  height: ${({ isShowing }) => (isShowing ? " 25px" : "0")};
  overflow: hidden;
  display: flex;
  justify-content: space-around;
  transition: all 0.5s;
`;

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
    {
      logStreams,
      isStreaming,
      isLarge,
      inputText,
      filterTriggeredByIcon,
      quickFilterData,
      quickFiltersOpen
    },
    valueSetter
  ] = useMappedState(ContainerListItemInitialState);

  const logRef: React.RefObject<HTMLDivElement> = React.createRef();
  const idRef: React.RefObject<HTMLInputElement> = React.createRef();
  const copySuccessRef: React.RefObject<HTMLSpanElement> = React.createRef();
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

  const infoQFApplied = quickFiltersOpen && quickFilterData.INFO;
  const warnQFApplied = quickFiltersOpen && quickFilterData.WARN;
  const severeQFApplied = quickFiltersOpen && quickFilterData.SEVERE;
  const infoQFReg = infoQFApplied ? "INFO" : "";
  const warnQFReg = warnQFApplied ? "WARN" : "";
  const severeQFReg = severeQFApplied ? "SEVERE" : "";
  const quickFiltersApplied = infoQFApplied || warnQFApplied || severeQFApplied;

  const filterToUse = [inputText, infoQFReg, warnQFReg, severeQFReg].filter(
    filter => filter !== ""
  );

  const reg = new RegExp(`${filterToUse.join("|")}`, "g");

  const dataToUse =
    inputText.length !== 0 || quickFiltersApplied
      ? logStreams.filter((stream: string) =>
          stream.match(reg) ? stream.match(reg).length > 0 : false
        )
      : logStreams;

  const changeSize = (isLarge: boolean) => {
    valueSetter("isLarge", !isLarge);
  };

  const copyToClipboard = (
    inputRef: React.RefObject<HTMLInputElement>,
    copySuccessRef: React.RefObject<HTMLSpanElement>
  ) => {
    if (inputRef.current !== null && copySuccessRef.current !== null) {
      inputRef.current.style.display = "block";
      inputRef.current.select();
      document.execCommand("copy");
      inputRef.current.style.display = "none";
      copySuccessRef.current.style.opacity = "1";
      setTimeout(() => {
        copySuccessRef.current.style.opacity = "0";
      }, 2000);
    }
  };

  const quickFilterSelect = (
    evt: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    valueSetter("quickFilterData", {
      ...quickFilterData,
      [name]: evt.target.checked
    });
  };

  const handleTextChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    valueSetter("inputText", evt.target.value);
  };
  console.log("logs length", logStreams.length);

  const handleFilterClick = () => {
    valueSetter("filterTriggeredByIcon", true);
    setTimeout(() => {
      valueSetter("filterTriggeredByIcon", false);
    }, 1000);
  };

  const clearQuickFilters = () => {
    valueSetter("quickFilterData", quickFilterDataStarterState);
  };

  const clearFiltering = () => {
    valueSetter("inputText", "");
  };

  const handleQuickFilterShow = () => {
    if (!quickFiltersOpen === false) {
      clearQuickFilters();
    }
    valueSetter("quickFiltersOpen", !quickFiltersOpen);
  };

  return (
    <ContainerListItemWrapper isLarge={isLarge} className="give-transition">
      <ContainerHeaderWrapper>
        <ContainerHeader>
          <SubHeaderWrapper>
            <span>{name}</span>
            <StartStopIcon
              handleAction={onActionButtonClick}
              type={isRunning ? "stop" : "start"}
            />
            {!isRunning && (
              <StartStopIcon
                classToAdd="remove-container"
                handleAction={onRemoveContainer}
                type="stop"
                icon={faTrashAlt}
              />
            )}
          </SubHeaderWrapper>
          <FontAwesomeIcon
            className="expand-card"
            onClick={() => changeSize(isLarge)}
            icon={faExpandAlt}
          />
        </ContainerHeader>
      </ContainerHeaderWrapper>
      <div style={{ transition: "all 1s", height: "300px", overflow: "auto" }}>
        <div style={{ padding: "25px" }}>
          <ContainerStatus isRunning={isRunning}>
            <strong>Status:</strong> {status || "N/A"}
          </ContainerStatus>
          <ContainerIdWrapper>
            <p>
              <strong>Id:</strong>
            </p>{" "}
            <span title={id}>{id.slice(0, 20) + "..."}</span>
            {document.queryCommandSupported("copy") && (
              <div>
                <HiddenInput ref={idRef} type="text" value={id} />
                <span
                  className="clipboard-icon"
                  onClick={() => copyToClipboard(idRef, copySuccessRef)}
                >
                  <FontAwesomeIcon title="Copy to Clipboard" icon={faPaste} />
                </span>
                <span className="success-icon" ref={copySuccessRef}>
                  <FontAwesomeIcon title="Success" icon={faCheckCircle} />
                </span>
              </div>
            )}
          </ContainerIdWrapper>
          <p>
            <strong>Image:</strong> {image}
          </p>
          <p>
            <strong>Volumes:</strong>
            <span>{volumes.length > 0 ? volumes.join(", ") : "N/A"}</span>
          </p>
          <span>
            <p>
              <strong>Mounts:</strong>
            </p>
            <MountsWrapper>
              {mounts.length > 0
                ? mounts.map(
                    ({ Type, Source, Destination, Mode, RW, Propagation }) => (
                      <>
                        <p>
                          <strong>Type:</strong> {Type}
                        </p>
                        <p>
                          <strong>Source:</strong> {Source}
                        </p>
                        <p>
                          <strong>Destination:</strong> {Destination}
                        </p>
                        <p>
                          <strong>Mode:</strong> {Mode}
                        </p>
                        <p>
                          <strong>RW:</strong> {RW}
                        </p>
                        <p>
                          <strong>Propagation:</strong> {Propagation}
                        </p>
                      </>
                    )
                  )
                : "  N/A"}
            </MountsWrapper>
          </span>
          <span>
            <p>
              <strong>Ports:</strong>
            </p>
            <PortsWrapper>
              {ports.length > 0
                ? ports.map((portObj: Port) => {
                    return Object.keys(portObj).map((portData: keyof Port) => {
                      return <span style={{ margin: "3px" }}>{portData}</span>;
                    });
                  })
                : "  N/A"}
            </PortsWrapper>
          </span>
          <span>
            <p>
              <strong>Command:</strong>
            </p>
            <span>{command || "N/A"}</span>
          </span>
        </div>
      </div>

      <div>
        <div>
          <LogsHeaderWrapper
            isShowing={quickFiltersOpen}
            filtersDisabled={logStreams.length === 0}
          >
            <h4>Logs</h4>
            {!isStreaming && (
              <span onClick={onPipeLogs} className="stream-logs-on">
                <FontAwesomeIcon
                  title="Start Streaming Logs"
                  icon={faFolderPlus}
                />
              </span>
            )}
            {isStreaming && (
              <span onClick={onStopPipeLogs} className="stream-logs-off">
                <FontAwesomeIcon
                  title="Stop Streaming Logs"
                  icon={faFolderPlus}
                />
              </span>
            )}
            <span onClick={handleQuickFilterShow} className="quick-filters">
              <FontAwesomeIcon
                title={
                  logStreams.length !== 0
                    ? "Open Quick Filters"
                    : "No Logs to Filter, Start Streaming first"
                }
                icon={faTachometerAlt}
              />
            </span>
            <span onClick={handleFilterClick} className="open-filter">
              <FontAwesomeIcon
                title={
                  logStreams.length !== 0
                    ? "Filter Logs"
                    : "No Logs to Filter, Start Streaming first"
                }
                icon={faFilter}
              />
            </span>

            {/* TODO:  Clear filters button and a X for remove logs */}
          </LogsHeaderWrapper>
          <QuickFiltersWrapper isShowing={quickFiltersOpen}>
            {Object.keys(quickFilterData).map(filterKey => {
              const { value } = quickFilterData[filterKey];
              return (
                <>
                  <input
                    id={filterKey}
                    type="checkbox"
                    onChange={value => quickFilterSelect(value, filterKey)}
                    checked={value}
                  />
                  <label htmlFor={filterKey}>{filterKey}</label>
                </>
              );
            })}
          </QuickFiltersWrapper>
          <SearchIcon
            clearFilter={clearFiltering}
            isLarge={isLarge}
            uniqueId={_.uniqueId("container-")}
            manualTrigger={filterTriggeredByIcon}
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
