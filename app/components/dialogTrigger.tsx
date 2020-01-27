import * as React from "react";

export interface DialogTriggerProperties {
  id: string;
  buttonText: string;
}

export const DialogTrigger: React.FC<DialogTriggerProperties> = ({
  id,
  buttonText
}) => {
  const href = `#${id}`;
  return (
    <a className="btn btn-primary" data-toggle="modal" href={href}>
      {buttonText}
    </a>
  );
};
