import * as React from "react";
import styled from "styled-components";
import { useMappedState } from "react-use-mapped-state";

interface SearchBarIconWrapperProps {
  closeIconColor: string;
  magnifyGlassBackground: string;
  magnifyGlassHandleColor: string;
  magnifyGlassBorderColor: string;
  disabled: boolean;
}

const SearchBarIconWrapper = styled.div<SearchBarIconWrapperProps>`
  position: relative;

  #search-input {
    display: none;
  }

  .text-input {
    visibility: hidden;
    width: 0px;
    opacity: 0;
    transition: all 0.5s;
    padding-top: 2.25px;
  }

  .text-input:focus,
  .text-input:active,
  .text-input:inactive {
    outline: none;
    border: none;
  }
  .close-icon-left {
    visibility: hidden;
    opacity: 0;
    background: ${({ closeIconColor }) => closeIconColor};
    transform: rotate(90deg);
    transition: all 0.2s;
  }
  .close-icon-right {
    visibility: hidden;
    opacity: 0;
    background: ${({ closeIconColor }) => closeIconColor};
    transform: rotate(-90deg);
    transition: all 0.2s;
  }
  .magnify-glass {
    background: ${({ magnifyGlassBackground }) => magnifyGlassBackground};
    display: block;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    border: 0.2rem solid
      ${({ magnifyGlassBorderColor, disabled }) =>
        !disabled ? magnifyGlassBorderColor : "#999"};
    transition: all 0.5s;
  }
  .magnify-glass-handle {
    display: block;
    opacity: 1;
    position: absolute;
    top: 2.5rem;
    left: 1.6rem;
    background: ${({ magnifyGlassHandleColor, disabled }) =>
      !disabled ? magnifyGlassHandleColor : "#999"};
    width: 2rem;
    height: 2px;
    transform: rotate(45deg);
    transition: all 0.2s cubic-bezier(0, 0.93, 0, 0.18);
  }
  #search-input:checked + #search-icon-label .magnify-glass-handle {
    visibility: hidden;
    opacity: 0;
    height: 0px;
  }
  #search-input:checked + #search-icon-label .magnify-glass {
    width: 50rem;
    height: 4rem;
    border-radius: 3px;
  }
  #search-input:checked + #search-icon-label .text-input {
    visibility: visible;
    width: 98%;
    height: 100%;
    opacity: 1;
  }
  #search-input:checked + #search-icon-label .close-icon-left {
    position: absolute;
    top: 0.5rem;
    right: 1rem;
    visibility: visible;
    opacity: 1;
    margin-left: 5px;
    transform: rotate(45deg);
  }
  #search-input:checked + #search-icon-label .close-icon-right {
    position: absolute;
    top: 0.5rem;
    right: 1rem;
    visibility: visible;
    opacity: 1;
    transform: rotate(-45deg);
  }
`;

interface SearchBarIconBaseProps {
  magnifyGlassBackground?: string;
  magnifyGlassHandleColor?: string;
  magnifyGlassBorderColor?: string;
  closeIconColor?: string;
  inputText: string;
  disabled: boolean;
  handleTextChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  searchClickHandler: (userInput: string) => void;
}

const SearchBarIcon: React.FC<SearchBarIconBaseProps> = props => {
  const magnifyGlassBackground = props.magnifyGlassBackground || "white";
  const magnifyGlassHandleColor = props.magnifyGlassHandleColor || "black";
  const magnifyGlassBorderColor = props.magnifyGlassBorderColor || "black";
  const closeIconColor = props.closeIconColor || "black";

  const enterPressHandler = (evt: any) => {
    if (evt.charCode === 13 && props.inputText.length > 0) {
      props.searchClickHandler(props.inputText);
    }
  };

  React.useEffect(() => {
    document.addEventListener("keypress", enterPressHandler);
    return () => {
      document.removeEventListener("keypress", enterPressHandler);
    };
  });

  return (
    <SearchBarIconWrapper
      disabled={props.disabled}
      magnifyGlassBackground={magnifyGlassBackground}
      magnifyGlassHandleColor={magnifyGlassHandleColor}
      magnifyGlassBorderColor={magnifyGlassBorderColor}
      closeIconColor={closeIconColor}
    >
      <div
        title={props.disabled && "Cannot search when no logs are present"}
        className={`search-container`}
      >
        <input type="checkbox" name="search-input" id="search-input" />
        <label
          htmlFor={!props.disabled ? "search-input" : ""}
          id="search-icon-label"
        >
          <span className="magnify-glass">
            <input
              className="text-input"
              onChange={props.handleTextChange}
              value={props.inputText}
            />
            <span className="close-icon-left">&nbsp;</span>
            <span className="close-icon-right">&nbsp;</span>
          </span>
          <span className="magnify-glass-handle">&nbsp;</span>
        </label>
      </div>
    </SearchBarIconWrapper>
  );
};

export default SearchBarIcon;
