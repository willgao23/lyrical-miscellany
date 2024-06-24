import { InfoButton } from "./InfoButton";
import { MistakeTracker } from "./MistakeTracker";
import { ShuffleButton } from "./ShuffleButton";

interface FooterProps {
  mistakeCount: number;
  setShowInfoModal: Function;
  setShouldShuffle: Function;
}

export const Footer = ({
  mistakeCount,
  setShowInfoModal,
  setShouldShuffle,
}: FooterProps) => {
  return (
    <div className="footer">
      <div className="buttonContainer">
        <InfoButton setShowInfoModal={setShowInfoModal} />
        <ShuffleButton setShouldShuffle={setShouldShuffle} />
      </div>
      <MistakeTracker mistakeCount={mistakeCount} />
    </div>
  );
};
