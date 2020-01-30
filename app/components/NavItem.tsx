import * as React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import { NavOption } from "./NavBar";

interface NavItemWrapperProps {
  isSelected: boolean;
}

const NavItemWrapper = styled.div<NavItemWrapperProps>`
  margin-left: 10px;
  margin-right: 10px;
  height: 33px;
  cursor: pointer;
  ${({ isSelected }) => isSelected && "border-bottom: 3px solid white"}
`;

interface INavItemProps {
  data: NavOption;
  isSelected: boolean;
}

const NavItem: React.FC<INavItemProps> = ({ data, isSelected }) => {
  return (
    <NavItemWrapper isSelected={isSelected}>
      <Link
        data-toggle={data.path.indexOf("/") === -1 ? "modal" : ""}
        to={data.path}
      >
        {data.title}
      </Link>
    </NavItemWrapper>
  );
};

export default NavItem;
