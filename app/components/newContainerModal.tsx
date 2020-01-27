import * as React from "react";
import * as classNames from "classnames";
import { useMappedState, valueSetter } from "react-use-mapped-state";

import { Modal } from "./modal";

interface ModalProps {
  id: string;
  onRunImage?: (name: string) => void;
}

interface IModalInitialMappedState {
  imageName: string;
  isValid: boolean;
}

const ModalInitialMappedState: IModalInitialMappedState = {
  imageName: "",
  isValid: false
};

export const NewContainerDialog: React.FC<ModalProps> = ({
  id,
  onRunImage
}) => {
  const [{ imageName, isValid }, valueSetter] = useMappedState(
    ModalInitialMappedState
  );

  const onImageNameChange = (event: any) => {
    const { value: name } = event.target;
    valueSetter("imageName", name);
    valueSetter("isValid", name.length > 0);
  };

  const runImage = () => {
    if (isValid && onRunImage) onRunImage(imageName);

    return isValid;
  };

  const inputClass = classNames({
    "form-group": true,
    "has-error": !isValid
  });

  return (
    <Modal
      id="newContainerModal"
      buttonText="Run"
      title="Create a new container"
      onButtonClicked={runImage}
    >
      <form className="form-horizontal">
        <div className={inputClass}>
          <label htmlFor="imageName" className="col-sm-3 control-label">
            Image name
          </label>
          <div className="col-sm-9">
            <input
              type="text"
              className="form-control"
              onChange={onImageNameChange}
              id="imageName"
              placeholder="e.g mongodb:latest"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};
