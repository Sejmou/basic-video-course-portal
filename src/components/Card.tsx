import classNames from "classnames";

type Props = {
  children: React.ReactNode;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
};
const Card = ({ children, clickable, onClick, className }: Props) => {
  return (
    <div
      className={classNames(
        "flex h-full w-full flex-col rounded-lg border border-gray-200 bg-white p-6 text-black shadow dark:bg-gray-800 dark:text-white",
        {
          "hover:cursor-pointer hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700":
            clickable,
        },
        className
      )}
      onClick={() => void onClick?.()}
    >
      {children}
    </div>
  );
};
export default Card;
