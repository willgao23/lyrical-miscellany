interface InfoButtonProps {
  setShowInfoModal: Function;
}

export const InfoButton = ({ setShowInfoModal }: InfoButtonProps) => {
  return (
    <button className="footerButton" onClick={() => setShowInfoModal(true)}>
      ?
    </button>
  );
};
