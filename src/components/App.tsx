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

  return (
    <>
      {showAlert && (
        <div className="alertContainer">
          <Alert />
        </div>
      )}
      {showInfoModal && <div className="modalContainer">
        <Modal titleText={"How to Play"} bodyText={"Unscramble the lyrics from four different songs!\n\n To make your guess, select four tiles from the game grid.\n\n Each set of lyrics will contain the daily theme word at least once.\n\n  Try to group all of the lyrics before making four mistakes!"} isShareButtonModal={false} setShowInfoModal={setShowInfoModal}/>
      </div>}
      <div className="app">
        <Header theme={gameState?.["theme"]} />
        <Game
          gameState={gameState}
          mistakeCount={mistakeCount}
          setMistakeCount={setMistakeCount}
          setShowAlert={setShowAlert}
          correctGuesses={correctGuesses}
          setCorrectGuesses={setCorrectGuesses}
        />
        <Footer mistakeCount={mistakeCount} setShowInfoModal={setShowInfoModal} />
      </div>
    </>
  );
};

export default App;
