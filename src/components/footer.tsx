import React from "react";
import Modal from "./utils/modal";
import ClockIcon from "../public/icons/clock";
import WorldIcon from "../public/icons/world";
import GearIcon from "../public/icons/gear";
import { useConfig } from "../context/config";
import { useTheme } from "../context/theme";
import {
  themes,
  gameModes,
  wordsNumber as defaultWordsNumber,
} from "../utils/data";
import { gameModeEnum } from "../utils/enum";

const Footer = () => {
  const [visible, setVisible] = React.useState<boolean>(false);
  const { theme, toggleTheme } = useTheme();
  const { wordsNumber, mode, setMode, isTyping, handleGenerateWords } =
    useConfig();

  return (
    <>
      <div
        className={`absolute bottom-5 left-0 right-0 text-center mx-auto px-3 w-[95%] rounded-lg flex bg-footer text-footer-text shadow py-1 gap-x-3 transition-opacity ${
          isTyping ? "opacity-0 duration-150" : "opacity-100 duration-300"
        }`}
      >
        <select
          value={theme}
          className="px-2 py-1 rounded-lg bg-transparent hover:text-footer-text-hover cursor-pointer"
          onChange={(e) => toggleTheme(e.target.value)}
        >
          {themes.map((theme) => (
            <option className="text-black" value={theme.value}>
              {theme.label}
            </option>
          ))}
        </select>
        <div className="h-auto w-px my-1 bg-primary rounded-full" />
        <div className="flex items-center gap-x-4">
          {gameModes.map((gameMode) => (
            <div
              onClick={() => setMode(gameMode.toLowerCase() as gameModeEnum)}
              className={`flex gap-x-1 cursor-pointer transition-colors ${
                mode === gameMode.toLowerCase()
                  ? "text-footer-text-hover"
                  : "hover:text-footer-text-hover"
              }`}
            >
              {gameMode.toLowerCase() === gameModeEnum.WORDS ? (
                <WorldIcon width={20} height={20} />
              ) : (
                <ClockIcon width={20} height={20} />
              )}
              <span className="mb-px">{gameMode}</span>
            </div>
          ))}
        </div>
        <div className="h-auto w-px my-1 bg-primary rounded-full" />
        <div className="flex items-center gap-x-4">
          {defaultWordsNumber.map((number: number) => (
            <span
              onClick={() => handleGenerateWords(number)}
              className={`mb-px cursor-pointer transition-colors ${
                wordsNumber === number
                  ? "font-bold text-footer-text-hover"
                  : "hover:text-footer-text-hover"
              }`}
            >
              {number}
            </span>
          ))}
          <GearIcon
            width={20}
            height={20}
            className={`cursor-pointer hover:text-footer-text-hover ${
              !defaultWordsNumber.includes(wordsNumber) &&
              "font-bold text-footer-text-hover"
            }`}
            onClick={() => setVisible(true)}
          />
        </div>
      </div>
      <Modal visible={visible} onClose={() => setVisible(false)} />
    </>
  );
};

export default Footer;
