import * as React from "react";
import * as _ from "lodash";
import * as io from "socket.io-client";
import { useMappedState } from "react-use-mapped-state";

import { Container } from "./ContainerListItem";
import { ContainerList } from "./ContainerList";
import { NewContainerDialog } from "./newContainerModal";
import { DialogTrigger } from "./dialogTrigger";

interface AppProps {}
interface AppMappedState {
  containers: Container[];
  stoppedContainers: Container[];
}

const initialState: AppMappedState = {
  containers: [],
  stoppedContainers: []
};

const socket = io.connect();

export const AppComponent: React.FC<AppProps> = () => {
  const [{ containers, stoppedContainers }, valueSetter] = useMappedState(
    initialState
  );

  const mapContainer = (container: { [key: string]: any }): Container => {
    const {
      Id: id,
      Names,
      State: state,
      Status,
      Image: image,
      Mounts: mounts,
      Volumes,
      Command: command,
      Ports: ports
    } = container;
    const volumes = Volumes ? Object.keys(Volumes) : [];
    const name = _.chain(Names)
      .map((n: string) => n.substr(1))
      .join(", ")
      .value();
    const status = `${state} (${Status})`;
    return {
      id,
      name,
      state,
      status,
      image,
      mounts,
      volumes,
      ports,
      command
    };
  };

  const onRunImage = (name: String): void => {
    socket.emit("image.run", { name });
  };

  React.useEffect(() => {
    socket.emit("containers.list");

    socket.on("image.error", (args: any) => {
      alert(args.message.json.message);
    });

    socket.on("containers.list", (containers: any) => {
      const partitioned = _.partition(
        containers,
        (c: any) => c.State == "running"
      );

      valueSetter("containers", partitioned[0].map(mapContainer));
      valueSetter("stoppedContainers", partitioned[1].map(mapContainer));
    });
  }, []);

  return (
    <div className="container">
      <h1 className="page-header">Docker Dashboard</h1>
      <DialogTrigger id="newContainerModal" buttonText="New container" />
      <ContainerList title="Running" containers={containers} />
      <ContainerList
        title="Stopped containers"
        containers={stoppedContainers}
      />

      <NewContainerDialog id="newContainerModal" onRunImage={onRunImage} />
    </div>
  );
};
