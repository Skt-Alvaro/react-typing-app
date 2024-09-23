import React from "react";

interface Props {
  children: React.ReactNode;
  text: string;
  className?: string;
}

const Tooltip: React.FC<Props> = ({ children, text, className }) => {
  return (
    <div className={`relative inline-block group ${className}`}>
      {children}
      <div
        className="absolute z-10 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-md shadow-sm 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300
                      bottom-full left-1/2 transform -translate-x-1/2 mb-2 whitespace-nowrap"
      >
        <span>{text}</span>
        <div
          className="absolute w-2 h-2 bg-gray-900 transform rotate-45 
                        bottom-[-4px] left-1/2 -translate-x-1/2"
        ></div>
      </div>
    </div>
  );
};

export default Tooltip;
