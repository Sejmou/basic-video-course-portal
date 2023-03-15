import { Switch } from "@headlessui/react";

type Props = {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  text?: string;
};

const Toggle = ({ enabled, onChange, text }: Props) => {
  return (
    <div className="flex gap-1">
      <Switch
        checked={enabled}
        onChange={onChange}
        className={`${enabled ? "bg-purple-900" : "bg-purple-700"}
            relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={`${enabled ? "translate-x-5" : "translate-x-0"}
              pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
        />
      </Switch>
      <span>{text}</span>
    </div>
  );
};

export default Toggle;
