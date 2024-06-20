interface InfoButtonProps {
  setShowInfoModal: Function;
}

export const InfoButton = ({ setShowInfoModal }: InfoButtonProps) => {
  return (
    <button className="infoButton" onClick={() => setShowInfoModal(true)}>
      ?
    </button>
  );
};
