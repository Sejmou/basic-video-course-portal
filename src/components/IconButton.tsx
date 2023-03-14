import classNames from "classnames";
import { MouseEventHandler } from "react";

type Props = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  className?: string;
  light?: boolean;
};

const IconButton = ({ onClick, children, className, light }: Props) => {
  return (
    <button
      className={classNames("h-6 w-6", { "text-white": light }, className)}
      onClick={onClick}
    >
      <svg
        viewBox="0 0 24 24"
        className={classNames({ "fill-current": light })}
      >
        {children}
      </svg>
    </button>
  );
};
export default IconButton;
