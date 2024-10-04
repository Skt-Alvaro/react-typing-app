import Results from "./utils/completed";
import Tooltip from "./utils/tooltip";
import ChevronRight from "../public/icons/chevron-right";
import ArrowPath from "../public/icons/arrow-path";
import { useHistory } from "../context/history";
import { endingActions } from "../utils/enum";

const Completed = () => {
  const { setCompleted, setEndingType } = useHistory();

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="block space-y-10 mt-10">
        <div className="flex items-center">
          <Results />
        </div>
        <div className="w-full flex justify-center gap-x-16">
          <Tooltip text="Next test">
            <ChevronRight
              className="w-7 cursor-pointer stroke-secondary"
              onClick={() => {
                setCompleted(false);
                setEndingType(endingActions.NEXT);
              }}
            />
          </Tooltip>
          <Tooltip text="Restart test">
            <ArrowPath
              className="w-7 cursor-pointer stroke-secondary"
              onClick={() => {
                setCompleted(false);
                setEndingType(endingActions.RESTART);
              }}
            />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default Completed;
