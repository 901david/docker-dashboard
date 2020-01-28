import * as React from "react";
import styled from "styled-components";
import { useMappedState } from "react-use-mapped-state";

interface SearchBarIconWrapperProps {
  closeIconColor: string;
  magnifyGlassBackground: string;
  magnifyGlassHandleColor: string;
  magnifyGlassBorderColor: string;
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
      ${({ magnifyGlassBorderColor }) => magnifyGlassBorderColor};
    transition: all 0.5s;
  }
  .magnify-glass-handle {
    display: block;
    opacity: 1;
    position: absolute;
    top: 2.5rem;
    left: 1.6rem;
    background: ${({ magnifyGlassHandleColor }) => magnifyGlassHandleColor};
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
    width: 18rem;
    height: 2rem;
    border-radius: 3px;
  }
  #search-input:checked + #search-icon-label .text-input {
    visibility: visible;
    width: 85%;
    margin: 0px 0.5%;
    opacity: 1;
  }
  #search-input:checked + #search-icon-label .close-icon-left {
    position: absolute;
    top: 0.5rem;
    right: 1rem;
    visibility: visible;
    opacity: 1;
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
  searchClickHandler: (userInput: string) => void;
}

const SearchBarIcon: React.FC<SearchBarIconBaseProps> = props => {
  const [
    {
      inputText,
      magnifyGlassBackground,
      magnifyGlassHandleColor,
      magnifyGlassBorderColor,
      closeIconColor
    },
    valueSetter
  ] = useMappedState({
    magnifyGlassBackground: props.magnifyGlassBackground || "white",
    magnifyGlassHandleColor: props.magnifyGlassHandleColor || "black",
    magnifyGlassBorderColor: props.magnifyGlassBorderColor || "black",
    closeIconColor: props.closeIconColor || "black",
    inputText: ""
  });
  const enterPressHandler = (evt: any) => {
    if (evt.charCode === 13 && inputText.length > 0) {
      props.searchClickHandler(inputText);
      valueSetter("inputText", "");
    }
  };

  const handleChange = (evt: any) => {
    const { value: inputText } = evt.target;
    valueSetter("inputText", inputText);
  };

  React.useEffect(() => {
    document.addEventListener("keypress", enterPressHandler);
    return () => {
      document.removeEventListener("keypress", enterPressHandler);
    };
  });

  return (
    <SearchBarIconWrapper
      magnifyGlassBackground={magnifyGlassBackground}
      magnifyGlassHandleColor={magnifyGlassHandleColor}
      magnifyGlassBorderColor={magnifyGlassBorderColor}
      closeIconColor={closeIconColor}
    >
      <div className={`search-container`}>
        <input type="checkbox" name="search-input" id="search-input" />
        <label htmlFor="search-input" id="search-icon-label">
          <span className="magnify-glass">
            <input
              className="text-input"
              onChange={handleChange}
              value={inputText}
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
