import * as React from "react";
import styled, { css } from "styled-components";
import { useMappedState } from "react-use-mapped-state";

interface SearchBarIconWrapperProps {
  closeIconColor: string;
  magnifyGlassBackground: string;
  magnifyGlassHandleColor: string;
  magnifyGlassBorderColor: string;
  disabled: boolean;
  uniqueId: string;
  parentWidth: number;
}

const SearchBarIconWrapper = styled.div<SearchBarIconWrapperProps>`
  position: relative;
  margin-left: 15px;

  ${({ uniqueId }) => `#${uniqueId}-search-input {
      display: none;
    }
  `}

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
    top: 2.4rem;
    left: 1.4rem;
    background: ${({ magnifyGlassHandleColor, disabled }) =>
      !disabled ? magnifyGlassHandleColor : "#999"};
    width: 2rem;
    height: 2px;
    transform: rotate(45deg);
    transition: all 0.2s cubic-bezier(0, 0.93, 0, 0.18);
  }
  ${({ uniqueId }) =>
    `#${uniqueId}-search-input`}:checked + #search-icon-label .magnify-glass-handle {
    visibility: hidden;
    opacity: 0;
    height: 0px;
  }
  ${({ uniqueId }) =>
    `#${uniqueId}-search-input`}:checked + #search-icon-label .magnify-glass {
    width: ${({ parentWidth }) => {
      return css`
        ${parentWidth - 65}px
      `;
    }};
    height: 4rem;
    border-radius: 3px;
  }
  ${({ uniqueId }) =>
    `#${uniqueId}-search-input`}:checked + #search-icon-label .text-input {
    visibility: visible;
    width: ${({ parentWidth }) => {
      return css`
        ${parentWidth - 69}px
      `;
    }};
    height: 100%;
    opacity: 1;
  }
  ${({ uniqueId }) =>
    `#${uniqueId}-search-input`}:checked + #search-icon-label .close-icon-left {
    position: absolute;
    top: 0;
    left: ${({ parentWidth }) => {
      return css`
        ${parentWidth - 61}px
      `;
    }};
    visibility: visible;
    opacity: 1;
    margin-left: 5px;
    transform: rotate(45deg);
  }
  ${({ uniqueId }) =>
    `#${uniqueId}-search-input`}:checked + #search-icon-label .close-icon-right {
    position: absolute;
    top: 0;
    left: ${({ parentWidth }) => {
      return css`
        ${parentWidth - 56}px
      `;
    }};
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
  manualTrigger?: boolean;
  uniqueId: string;
  clearFilter: () => void;
}

const SearchBarIcon: React.FC<SearchBarIconBaseProps> = props => {
  const [{ parentWidth }, valueSetter] = useMappedState({
    parentWidth: 0
  });
  const magnifyLabelRef: React.RefObject<HTMLLabelElement> = React.createRef();
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

  React.useEffect(() => {
    if (props.manualTrigger && magnifyLabelRef.current !== null)
      magnifyLabelRef.current.click();
  }, [props.manualTrigger]);

  React.useEffect(() => {
    const parentEl = document.querySelector(".give-transition");
    if (parentEl) {
      valueSetter("parentWidth", parentEl.getBoundingClientRect().width);
    }
  }, [parentWidth]);

  const handleClose = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (!evt.target.checked) props.clearFilter();
  };

  return (
    <SearchBarIconWrapper
      parentWidth={parentWidth}
      disabled={props.disabled}
      magnifyGlassBackground={magnifyGlassBackground}
      magnifyGlassHandleColor={magnifyGlassHandleColor}
      magnifyGlassBorderColor={magnifyGlassBorderColor}
      closeIconColor={closeIconColor}
      uniqueId={props.uniqueId}
    >
      <div
        title={props.disabled && "Cannot search when no logs are present"}
        className={`search-container`}
      >
        <input
          onChange={handleClose}
          type="checkbox"
          name="search-input"
          id={
            props.uniqueId ? `${props.uniqueId}-search-input` : "search-input-"
          }
        />
        <label
          ref={magnifyLabelRef}
          htmlFor={!props.disabled ? `${props.uniqueId}-search-input` : ""}
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
