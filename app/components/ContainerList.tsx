import * as React from "react";
import { Container, ContainerListItem } from "./ContainerListItem";

interface ContainerListProps {
  containers: Container[];
}

export const ContainerList: React.FC<ContainerListProps> = ({ containers }) => {
  return (
    <>
      <div className="row">
        {containers.length === 0 && <p>"No containers to show"</p>}
        {containers.map(container => (
          <ContainerListItem key={container.name} {...container} />
        ))}
      </div>
    </>
  );
};
