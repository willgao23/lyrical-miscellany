import { useEffect, useState } from "react";
import "../App.css";
import { Footer } from "./Footer";
import { Game } from "./Game";
import { Header } from "./Header";
import { GameState } from "../types/GameState";
import { Alert } from "./Alert";
import { Modal } from "./Modal";
import { Answer } from "../types/Answer";

const App = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [correctGuesses, setCorrectGuesses] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [history, setHistory] = useState<string[][]>([]);
  const [prevHistoryLength, setPrevHistoryLength] = useState(0);
  const [guessGridText, setGuessGridText] = useState("");
  const [titles, setTitles] = useState<Answer[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/game")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setGameState(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  useEffect(() => {
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
      }
      guessRow = guessRow.concat("\n");
      const updatedGuessGridText = guessGridText.concat(guessRow);
      setGuessGridText(updatedGuessGridText);
      setPrevHistoryLength(prevHistoryLength + 1);
    }
  }, [history, guessGridText, prevHistoryLength]);

  useEffect(() => {
    const colorMapping = ["yellow", "green", "blue", "orange"];
    if (mistakeCount >= 4 && gameState && titles.length < 4) {
      const updatedTitles = [...titles];

      for (let i = 0; i < 4; i++) {
        const answer = {
          title: gameState["songs"][i]["title"],
          color: colorMapping[i],
        };
        let answerInTitles = false;
        for (let j = 0; j < titles.length; j++) {
          if (titles[j]["title"] === gameState["songs"][i]["title"]) {
            answerInTitles = true;
          }
        }
        if (!answerInTitles) {
          updatedTitles.push(answer);
          console.log(updatedTitles);
        }
      }
      setTitles(updatedTitles);
      setCorrectGuesses(5);
      setTimeout(() => setShowGameOverModal(true), 2000);
    }
  }, [mistakeCount, gameState, titles, correctGuesses]);

  useEffect(() => {
    if (correctGuesses === 4) {
      setShowVictoryModal(true);
    }
  }, [correctGuesses]);

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
            bodyText={`Streak: 0${String.fromCodePoint(0x1f525)}\n\n${guessGridText}`}
            isShareButtonModal={true}
            modalExitFunction={() => setShowGameOverModal(false)}
            date={gameState?.["date"]}
            theme={gameState?.["theme"]}
          />
        </div>
      )}
      {showVictoryModal && (
        <div className="modalContainer">
          <Modal
            titleText={"Lyrical savant!"}
            bodyText={`Streak: 0${String.fromCodePoint(0x1f525)}\n\n${guessGridText}`}
            isShareButtonModal={true}
            modalExitFunction={() => setShowVictoryModal(false)}
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
          titles={titles}
          setTitles={setTitles}
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
