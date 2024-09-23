import React from "react";
import { useConfig } from "../../context/config";

interface Props {
  visible: boolean;
  onClose: Function;
}

const Modal: React.FC<Props> = ({ visible, onClose }) => {
  const { wordsNumber, handleGenerateWords } = useConfig();
  const [value, setValue] = React.useState<number>(wordsNumber);
  const modalWrapperRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (inputRef.current) {
      if (visible) {
        setTimeout(() => {
          inputRef.current?.focus();
          inputRef.current?.select();
        }, 50);
      }
    }
  }, [visible, wordsNumber]);

  React.useEffect(() => {
    setValue(wordsNumber);
  }, [wordsNumber]);

  const backDropHandler = (e: any) => {
    if (!modalWrapperRef?.current?.contains(e.target)) {
      onClose();
      setTimeout(() => {
        setValue(wordsNumber);
      }, 100);
    }
  };

  const handleContinue = () => {
    handleGenerateWords(value);
    onClose();
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black/60 backdrop-blur-[3px] transition-all duration-200 ${
        visible ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      onClick={(e) => backDropHandler(e)}
    >
      <div ref={modalWrapperRef} className="sm:w-[500px] sm:mx-0 mx-5">
        <div className="bg-primary text-secondary h-full w-full rounded-lg px-4 pt-3 pb-5">
          <div className="flex flex-col gap-y-2">
            <p className="text-2xl font-bold">Custom word amount</p>
            <input
              ref={inputRef}
              value={value === 0 ? "" : value}
              onChange={(e) => setValue(Number(e.target.value))}
              type="number"
              className="w-full outline-none focus:ring-2 ring-white bg-footer text-footer-text rounded-lg h-10 px-2 mb-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none selection:bg-footer-text-hover"
            />
            <button
              onClick={() => handleContinue()}
              className="bg-footer h-10 rounded-lg text-footer-text"
            >
              continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
