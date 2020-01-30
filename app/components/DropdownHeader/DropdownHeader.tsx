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

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;

  svg {
    margin-left: 10px;
    font-size: 45px;
  }
`;

const ContainerListContainer = styled.div`
  height: 0;
  transition: all 0.5s;
  overflow: hidden;
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
    containerListRef.current.style.height = isOpen ? "0" : "50vh";
    valueSetter("isOpen", !isOpen);
  };

  return (
    <MainContainer>
      <HeaderContainer>
        <h1>{title}</h1>
        <FontAwesomeIcon
          onClick={handleArrowClick}
          icon={!isOpen ? faChevronDown : faChevronUp}
        />
      </HeaderContainer>
      <ContainerListContainer ref={containerListRef}>
        {children}
      </ContainerListContainer>
    </MainContainer>
  );
};

export default DropdownHeader;
