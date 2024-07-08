interface AnswerOverlayProps {
  title: string;
  color: string;
  fullLyric: string;
}

export const AnswerOverlay = ({ title, color, fullLyric}: AnswerOverlayProps) => {
  return (
    <div className={`answerOverlay ${color}`}>
      <div className="answerTitle">{title}</div>
      <div className="answerLyric">{fullLyric}</div>
    </div>
  );
};
