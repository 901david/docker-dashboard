import * as React from "react";
import { Container, ContainerListItem } from "./ContainerListItem";

export class ContainerListProps {
  containers: Container[];
  title?: string;
}

export const ContainerList: React.FC<ContainerListProps> = ({
  containers,
  title
}) => {
  return (
    <div>
      <h3>{title}</h3>
      <p>{containers.length == 0 ? "No containers to show" : ""}</p>
      <div className="row">
        {containers.map(container => (
          <ContainerListItem key={container.name} {...container} />
        ))}
      </div>
    </div>
  );
};
