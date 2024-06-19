interface AnswerOverlayProps {
  title: string;
  color: string;
}

export const AnswerOverlay = ({ title, color }: AnswerOverlayProps) => {
  return (
    <div className={`answerOverlay ${color}`}>
      <div className="textBox">{title}</div>
    </div>
  );
};
