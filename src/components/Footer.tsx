import { InfoButton } from "./InfoButton";
import { MistakeTracker } from "./MistakeTracker";

interface FooterProps {
  mistakeCount: number;
  setShowInfoModal: Function;
}

export const Footer = ({ mistakeCount, setShowInfoModal }: FooterProps) => {
  return (
    <div className="footer">
      <InfoButton setShowInfoModal={setShowInfoModal} />
      <MistakeTracker mistakeCount={mistakeCount} />
    </div>
  );
};
