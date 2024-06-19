interface ModalProps {
  titleText: string;
  bodyText: string;
  isShareButtonModal: boolean;
  setShowInfoModal: Function
}

export const Modal = ({
  titleText,
  bodyText,
  isShareButtonModal,
  setShowInfoModal
}: ModalProps) => {
  return (
    <div className="modal">
      <div className="exitButtonContainer">
        <button className="exitButton" onClick={() => setShowInfoModal(false)}>X</button>
      </div>
      <div className="modalContentContainer">
        <div className="modalTitle">{titleText}</div>
        <div className="modalBody">{bodyText}</div>
        {isShareButtonModal && (
          <button className="modalButton">Share Your Results</button>
        )}
      </div>
    </div>
  );
};
