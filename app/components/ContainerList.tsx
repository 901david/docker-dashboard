import * as React from "react";
import styled from "styled-components";

import { Container, ContainerListItem } from "./ContainerListItem";

interface ContainerListProps {
  containers: Container[];
}

interface IContainerListWrapperProps {
  hasContainers: boolean;
}

const ContainerListWrapper = styled.div<IContainerListWrapperProps>`
  display: grid;
  grid-template-columns: repeat(3, minmax(100px, 1fr));
  grid-gap: 15px;
`;

export const ContainerList: React.FC<ContainerListProps> = ({ containers }) => {
  return (
    <ContainerListWrapper hasContainers={containers.length !== 0}>
      {containers.length === 0 && <h1>No containers to show</h1>}
      {containers.map(container => (
        <ContainerListItem key={container.name} {...container} />
      ))}
    </ContainerListWrapper>
  );
};
