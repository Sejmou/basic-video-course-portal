import classNames from "classnames";
import { MouseEventHandler } from "react";

type Props = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  className?: string;
};

const IconButton = ({ onClick, children, className }: Props) => {
  return (
    <button className={classNames("h-6 w-6", className)} onClick={onClick}>
      <svg viewBox="0 0 24 24">{children}</svg>
    </button>
  );
};
export default IconButton;
