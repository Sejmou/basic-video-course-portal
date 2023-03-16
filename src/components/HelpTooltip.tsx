import IconButton from "./IconButton";

type Props = { text: string };
const HelpTooltip = ({ text }: Props) => {
  return (
    <div className="group relative flex fill-current text-gray-500 hover:text-gray-700">
      <IconButton>
        <QuestionMark />
      </IconButton>
      <span className="absolute top-4 z-50 hidden w-72 rounded bg-gray-800 p-2 text-xs text-white opacity-80 group-hover:block group-hover:scale-100 dark:bg-black">
        {text}
      </span>
    </div>
  );
};
export default HelpTooltip;

const QuestionMark = () => (
  <path d="M 12.1 17.825 q 0.4 0 0.675 -0.275 t 0.275 -0.675 q 0 -0.4 -0.275 -0.675 t -0.675 -0.275 q -0.4 0 -0.675 0.275 t -0.275 0.675 q 0 0.4 0.275 0.675 t 0.675 0.275 Z m -0.875 -3.65 h 1.475 q 0 -0.65 0.1625 -1.1875 T 13.875 11.75 q 0.775 -0.65 1.1 -1.275 q 0.325 -0.625 0.325 -1.375 q 0 -1.325 -0.8625 -2.125 t -2.2875 -0.8 q -1.225 0 -2.1625 0.6125 T 8.625 8.475 l 1.325 0.5 q 0.275 -0.7 0.825 -1.0875 q 0.55 -0.3875 1.3 -0.3875 q 0.85 0 1.375 0.4625 t 0.525 1.1875 q 0 0.55 -0.325 1.0375 q -0.325 0.4875 -0.95 1.0125 q -0.75 0.65 -1.1125 1.2875 q -0.3625 0.6375 -0.3625 1.6875 Z M 12 22 q -2.05 0 -3.875 -0.7875 q -1.825 -0.7875 -3.1875 -2.15 q -1.3625 -1.3625 -2.15 -3.1875 Q 2 14.05 2 12 q 0 -2.075 0.7875 -3.9 q 0.7875 -1.825 2.15 -3.175 q 1.3625 -1.35 3.1875 -2.1375 Q 9.95 2 12 2 q 2.075 0 3.9 0.7875 q 1.825 0.7875 3.175 2.1375 q 1.35 1.35 2.1375 3.175 Q 22 9.925 22 12 q 0 2.05 -0.7875 3.875 q -0.7875 1.825 -2.1375 3.1875 t -3.175 2.15 Q 14.075 22 12 22 Z m 0 -1.5 q 3.55 0 6.025 -2.4875 Q 20.5 15.525 20.5 12 q 0 -3.55 -2.475 -6.025 Q 15.55 3.5 12 3.5 q -3.525 0 -6.0125 2.475 Q 3.5 8.45 3.5 12 q 0 3.525 2.4875 6.0125 Q 8.475 20.5 12 20.5 Z m 0 -8.5 Z" />
);
