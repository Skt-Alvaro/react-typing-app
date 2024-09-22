import React from "react";

interface Props {
  data: any;
}

const ResultsCard: React.FC<Props> = ({ data }) => {
  const wpm = 65;
  const time = 60; // seconds
  const characterCounts = {
    correct: 300,
    incorrect: 20,
    extra: 5,
    missed: 10,
  };

  return (
    <div className="p-4">
      <div className="bg-white border shadow-xl rounded-lg overflow-hidden animate-construct">
        <div className="px-6 py-4 space-y-4">
          <h2 className="text-xl font-bold">Typing Test Results</h2>

          <div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Accuracy</span>
              <span className="text-2xl font-bold">{80}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${80}%` }}
              ></div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">WPM</span>
            <span className="text-2xl font-bold">{wpm}</span>
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
                  {characterCounts.correct}
                </div>
                <div className="text-xs text-gray-600">Correct</div>
              </div>
              <div className="bg-red-100 p-2 rounded">
                <div className="text-lg font-semibold">
                  {characterCounts.incorrect}
                </div>
                <div className="text-xs text-gray-600">Incorrect</div>
              </div>
              <div className="bg-yellow-100 p-2 rounded">
                <div className="text-lg font-semibold">
                  {characterCounts.extra}
                </div>
                <div className="text-xs text-gray-600">Extra</div>
              </div>
              <div className="bg-gray-100 p-2 rounded">
                <div className="text-lg font-semibold">
                  {characterCounts.missed}
                </div>
                <div className="text-xs text-gray-600">Missed</div>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600 text-center">
            {characterCounts.correct}/{characterCounts.incorrect}/
            {characterCounts.extra}/{characterCounts.missed}
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
