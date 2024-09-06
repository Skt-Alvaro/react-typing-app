import { useTheme } from "../context/theme";
import { themes, wordsNumber } from "../utils/data";

const Footer = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="absolute bottom-5 left-0 right-0 text-center mx-auto px-3 w-[95%] rounded-lg flex opacity-55 bg-footer text-white shadow py-1 gap-x-3">
      <select
        value={theme}
        className="px-2 py-1 rounded-lg bg-transparent"
        onChange={(e) => toggleTheme(e.target.value)}
      >
        {themes.map((theme) => (
          <option className="text-black" value={theme.value}>
            {theme.label}
          </option>
        ))}
      </select>
      <div className="h-auto w-1.5 my-1 bg-primary rounded-full" />
      <div className="flex items-center gap-x-4">
        <div className="flex gap-x-1">
          <img
            src={require("../public/icons/world.svg").default}
            alt="World icon"
            width={20}
            height={20}
          />
          <span className="mb-px">Words</span>
        </div>
        <div className="flex gap-x-1">
          <img
            src={require("../public/icons/clock.svg").default}
            alt="Clock icon"
            width={20}
            height={20}
          />
          <span className="mb-px">Time</span>
        </div>
      </div>
      <div className="h-auto w-1.5 my-1 bg-primary rounded-full" />
      <div className="flex items-center gap-x-5">
        {wordsNumber.map((number) => (
          <span className="mb-px cursor-pointer">{number}</span>
        ))}
        <img
          src={require("../public/icons/gear.svg").default}
          alt="Gear icon"
          width={20}
          height={20}
        />
      </div>
    </div>
  );
};

export default Footer;
