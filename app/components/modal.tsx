import * as React from "react";

interface ModalProperties {
  id: string;
  title: string;
  buttonText?: string;
  onButtonClicked?: () => boolean | undefined;
}

export const Modal: React.FC<ModalProperties> = ({
  id,
  title,
  buttonText,
  onButtonClicked,
  children
}) => {
  const modalElementId = `#${id}`;

  const onPrimaryButtonClick = () => {
    //TODO: what?
    // Delegate to the generic button handler defined by the inheriting component
    if (onButtonClicked) {
      if (onButtonClicked() !== false) {
        $(modalElementId).modal("hide");
      }
    }
  };

  return (
    <div className="modal fade" id={id}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-hidden="true"
            >
              &times;
            </button>
            <h4 className="modal-title">{title}</h4>
          </div>
          <div className="modal-body">{children}</div>
          <div className="modal-footer">
            <button
              type="button"
              onClick={onPrimaryButtonClick}
              className="btn btn-primary"
            >
              {buttonText || "Ok"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
