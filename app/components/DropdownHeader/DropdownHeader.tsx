import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useMappedState } from "react-use-mapped-state";

const MainContainer = styled.div`
  h1 {
    margin-left: 2vw;
    margin-top: 1vh;
  }
`;

interface IHeaderContainerProps {
  isOpen: boolean;
}

const HeaderContainer = styled.div<IHeaderContainerProps>`
  display: flex;
  align-items: center;

  svg {
    margin-left: 10px;
    font-size: 45px;
    transition: all 0.3s;
    transform: rotate(0);
    ${({ isOpen }) => isOpen && "transform: rotate(-180deg)"}
  }
`;

const ContainerListContainer = styled.div`
  height: 0;
  transition: all 0.5s;
  overflow: auto;
`;

interface DropdownHeaderProps {
  title: string;
  children?: JSX.Element;
}

interface IinitialDropdownHeaderState {
  isOpen: boolean;
}
const initialDropdownHeaderState: IinitialDropdownHeaderState = {
  isOpen: false
};

const DropdownHeader: React.FC<DropdownHeaderProps> = ({ title, children }) => {
  const containerListRef: React.RefObject<HTMLDivElement> = React.createRef();

  const [{ isOpen }, valueSetter] = useMappedState(initialDropdownHeaderState);

  const handleArrowClick = (): void => {
    containerListRef.current.style.height = isOpen ? "0" : "70rem";
    valueSetter("isOpen", !isOpen);
  };

  return (
    <MainContainer>
      <HeaderContainer isOpen={isOpen}>
        <h1>{title}</h1>
        <FontAwesomeIcon onClick={handleArrowClick} icon={faChevronDown} />
      </HeaderContainer>
      <ContainerListContainer ref={containerListRef}>
        {children}
      </ContainerListContainer>
    </MainContainer>
  );
};

export default DropdownHeader;
