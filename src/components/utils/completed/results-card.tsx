import React from "react";
import { WordsHistoryEnum } from "../../../utils/enum";

interface Props {
  accuracy: number;
  wpm: number;
  time: number;
  wordsHistory: number[];
}

const ResultsCard: React.FC<Props> = ({ accuracy, wpm, time, ...props }) => {
  return (
    <div className="p-4 rounded-lg">
      <div className="bg-footer text-footer-text-hover rounded-lg overflow-hidden animate-construct">
        <div className="px-6 py-4 space-y-4">
          <h2 className="text-xl font-bold">Typing Test Results</h2>

          <div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Accuracy</span>
              <span className="text-2xl font-bold">
                {Math.round(accuracy)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-footer-text-hover h-2.5 rounded-full transition-all duration-[2000ms]"
                style={{ width: `${Math.round(accuracy)}%` }}
              ></div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">WPM</span>
            <span className="text-2xl font-bold">{Math.round(wpm)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Time</span>
            <span className="text-2xl font-bold">{time}s</span>
          </div>

          <div>
            <span className="text-sm font-medium">Characters</span>
            <div className="mt-2 grid grid-cols-4 gap-2 text-center">
              <div className="bg-green-100 p-2 rounded">
                <div className="text-lg font-semibold">
                  {props.wordsHistory[WordsHistoryEnum.CORRECT]}
                </div>
                <div className="text-xs text-gray-600">Correct</div>
              </div>
              <div className="bg-red-100 p-2 rounded">
                <div className="text-lg font-semibold">
                  {props.wordsHistory[WordsHistoryEnum.INCORRECT]}
                </div>
                <div className="text-xs text-gray-600">Incorrect</div>
              </div>
              <div className="bg-yellow-100 p-2 rounded">
                <div className="text-lg font-semibold">
                  {props.wordsHistory[WordsHistoryEnum.EXTRA]}
                </div>
                <div className="text-xs text-gray-600">Extra</div>
              </div>
              <div className="bg-gray-100 p-2 rounded">
                <div className="text-lg font-semibold">
                  {props.wordsHistory[WordsHistoryEnum.MISSED]}
                </div>
                <div className="text-xs text-gray-600">Missed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
    @keyframes construct {
      0% {
        clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
      }
      100% {
        clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
      }
    }
    .animate-construct {
      animation: construct 2s ease-out forwards;
    }
  `}</style>
    </div>
  );
};

export default ResultsCard;
