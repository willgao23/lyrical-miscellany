import { MistakeDot } from "./MistakeDot";

interface MistakeTrackerProps {
  mistakeCount: number;
}

export const MistakeTracker = ({ mistakeCount }: MistakeTrackerProps) => {
  return (
    <div className="mistakeTracker">
      <MistakeDot isFilled={mistakeCount >= 1 ? "filled" : "unfilled"} />
      <MistakeDot isFilled={mistakeCount >= 2 ? "filled" : "unfilled"} />
      <MistakeDot isFilled={mistakeCount >= 3 ? "filled" : "unfilled"} />
      <MistakeDot isFilled={mistakeCount >= 4 ? "filled" : "unfilled"} />
    </div>
  );
};
