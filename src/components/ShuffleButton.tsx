interface ShuffleButtonProps {
    setShouldShuffle: Function
}

export const ShuffleButton = ({setShouldShuffle}: ShuffleButtonProps) => {
    return (
        <button className="footerButton" onClick={() => setShouldShuffle(true)}>
          <img className="shuffleIcon" src="shuffleIcon.png" alt="Shuffle icon"></img>
        </button>
    );
}