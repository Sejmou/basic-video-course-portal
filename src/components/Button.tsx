import classNames from "classnames";

type Props = {
  onClick: () => void;
  children: React.ReactNode;
  colored?: boolean;
  size?: "small" | "medium" | "large";
};
const Button = ({ children, onClick, colored, size }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <button
        className={classNames(
          "px- rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20",
          { "bg-purple-700 hover:bg-purple-900": colored },
          { "py-2 px-8 text-sm": size === "small" },
          { "text-base": size === "medium" },
          { "text-lg": size === "large" }
        )}
        onClick={onClick}
      >
        {children}
      </button>
    </div>
  );
};
export default Button;
