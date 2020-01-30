import * as React from "react";
import * as _ from "lodash";
import * as io from "socket.io-client";
import { useMappedState } from "react-use-mapped-state";

import { Container } from "./ContainerListItem";
import { ContainerList } from "./ContainerList";
import DropdownHeader from "./DropdownHeader";

interface DashboardProps {}
interface DashboardState {
  containers: Container[];
  stoppedContainers: Container[];
}

const initialState: DashboardState = {
  containers: [],
  stoppedContainers: []
};

const socket = io.connect();

export const Dashboard: React.FC<DashboardProps> = () => {
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
    <div>
      <DropdownHeader title={"Running"}>
        <ContainerList containers={containers} />
      </DropdownHeader>
      <DropdownHeader title={"Stopped containers"}>
        <ContainerList containers={stoppedContainers} />
      </DropdownHeader>
    </div>
  );
};

export default Dashboard;
