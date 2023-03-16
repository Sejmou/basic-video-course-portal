import classNames from "classnames";

type Props = {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "transparent";
  size?: "extra-small" | "small" | "medium" | "large";
};
const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "medium",
}: Props) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <button
        className={classNames(
          "px- rounded-full font-semibold text-white no-underline transition",
          { "bg-purple-700 hover:bg-purple-900": variant === "primary" },
          { "bg-white/10 hover:bg-white/20": variant === "transparent" },
          { "py-1 px-4 text-xs": size === "extra-small" },
          { "py-2 px-8 text-sm": size === "small" },
          { "px-10 py-3": size === "medium" || size === "large" },
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
