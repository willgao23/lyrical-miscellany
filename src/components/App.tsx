import { useEffect, useState } from "react";
import "../App.css";
import { Footer } from "./Footer";
import { Game } from "./Game";
import { Header } from "./Header";
import { GameState } from "../types/GameState";
import { Alert } from "./Alert";
import { Modal } from "./Modal";

const App = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [correctGuesses, setCorrectGuesses] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [history, setHistory] = useState<string[][]>([]);
  const [prevHistoryLength, setPrevHistoryLength] = useState(0);
  const [guessGridText, setGuessGridText] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/game")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setGameState(data);
        console.log("".concat(String.fromCodePoint(0x1f7e8)));
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  useEffect(() => {
    console.log(history);
    if (history.length !== prevHistoryLength) {
      const colorEmojiMapping: Map<string, number> = new Map();
      colorEmojiMapping.set("yellow", 0x1f7e8);
      colorEmojiMapping.set("green", 0x1f7e9);
      colorEmojiMapping.set("blue", 0x1f7e6);
      colorEmojiMapping.set("orange", 0x1f7e7);
      let guessRow = "";
      for (let j = 0; j < 4; j++) {
        const emojiMapping = colorEmojiMapping.get(
          history[history.length - 1][j],
        );
        if (emojiMapping) {
          guessRow = guessRow.concat(String.fromCodePoint(emojiMapping));
        }
        console.log(guessRow);
      }
      guessRow = guessRow.concat("\n");
      const updatedGuessGridText = guessGridText.concat(guessRow);
      setGuessGridText(updatedGuessGridText);
      setPrevHistoryLength(prevHistoryLength + 1);
      console.log(guessGridText);
    }
  }, [history, guessGridText, prevHistoryLength]);

  useEffect(() => {
    if (mistakeCount >= 4) {
      setShowGameOverModal(true);
    }
  }, [mistakeCount]);

  return (
    <>
      {showAlert && (
        <div className="alertContainer">
          <Alert />
        </div>
      )}
      {showInfoModal && (
        <div className="modalContainer">
          <Modal
            titleText={"How to Play"}
            bodyText={
              "Unscramble the lyrics from four different songs!\n\n To make your guess, select four tiles from the game grid.\n\n Each set of lyrics will contain the daily theme word at least once.\n\n  Try to group all of the lyrics before making four mistakes!"
            }
            isShareButtonModal={false}
            modalExitFunction={() => setShowInfoModal(false)}
            date={gameState?.["date"]}
            theme={gameState?.["theme"]}
          />
        </div>
      )}
      {showGameOverModal && (
        <div className="modalContainer">
          <Modal
            titleText={"Better luck next time..."}
            bodyText={`Streak: 0${String.fromCodePoint(0x1f525)}\n\n ${guessGridText}`}
            isShareButtonModal={true}
            modalExitFunction={() => setShowGameOverModal(false)}
            date={gameState?.["date"]}
            theme={gameState?.["theme"]}
          />
        </div>
      )}
      <div className="app">
        <Header theme={gameState?.["theme"]} />
        <Game
          gameState={gameState}
          mistakeCount={mistakeCount}
          setMistakeCount={setMistakeCount}
          setShowAlert={setShowAlert}
          correctGuesses={correctGuesses}
          setCorrectGuesses={setCorrectGuesses}
          history={history}
          setHistory={setHistory}
        />
        <Footer
          mistakeCount={mistakeCount}
          setShowInfoModal={setShowInfoModal}
        />
      </div>
    </>
  );
};

export default App;
