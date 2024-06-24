interface ModalProps {
  titleText: string;
  bodyText: string;
  isShareButtonModal: boolean;
  modalExitFunction: Function;
  date: string | undefined;
  theme: string | undefined;
  setAlertText: Function;
  setShowAlert: Function;
}

export const Modal = ({
  titleText,
  bodyText,
  isShareButtonModal,
  modalExitFunction,
  date,
  theme,
  setAlertText,
  setShowAlert,
}: ModalProps) => {
  return (
    <div className="modal">
      <div className="exitButtonContainer">
        <button className="exitButton" onClick={() => modalExitFunction()}>
          X
        </button>
      </div>
      <div className="modalContentContainer">
        <div className="modalTitle">{titleText}</div>
        <div
          className={`modalBody ${isShareButtonModal ? "resultBodyText" : ""}`}
        >
          {bodyText}
        </div>
        {isShareButtonModal && (
          <button
            className="modalButton"
            onClick={() => {
              navigator.clipboard.writeText(
                `Lyrical Miscellany\n${date}\nToday's theme: ${theme}\nMy result:\n${bodyText}`,
              );
              setAlertText("Copied to clipboard!");
              setShowAlert(true);
              setTimeout(() => setShowAlert(false), 1500);
            }}
          >
            Share Your Results
          </button>
        )}
      </div>
    </div>
  );
};
