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
  const [alertText, setAlertText] = useState("");
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [history, setHistory] = useState<string[][]>([]);
  const [prevHistoryLength, setPrevHistoryLength] = useState(0);
  const [guessGridText, setGuessGridText] = useState("");
  const [titles, setTitles] = useState<Answer[]>([]);
  const [syncHistory, setSyncHistory] = useState(false);
  const [historyIsSynched, setHistoryIsSynched] = useState(false);
  const [shouldShuffle, setShouldShuffle] = useState(false);
  const [underMaintenance, setUnderMaintenance] = useState(false);

  useEffect(() => {
    const dateObject = new Date();
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1;
    const day = dateObject.getDate();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    fetch(
      "https://lyrical-miscellany-backend.ta0ncc8o1ashc.ca-central-1.cs.amazonlightsail.com/game",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          year: year,
          month: month,
          day: day,
        }),
      },
    )
      .then((response) => response.json())
      .then((data) => {
        setGameState(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
      const savedStreak = localStorage.getItem("streak");
      const lastPlayed = localStorage.getItem("lastPlayed");
      const storedHistory = localStorage.getItem("history");
      if (!savedStreak) {
        localStorage.setItem("streak", "0");
        setShowInfoModal(true);
      }
      if (
        lastPlayed &&
        lastPlayed === `${monthNames[month - 1]} ${day < 10 ? "0" + day.toString() : day}, ${year}` &&
        storedHistory
      ) {
        setSyncHistory(true);
      } else {
        localStorage.setItem("history", "");
        localStorage.setItem("wonToday", "false");
        setHistoryIsSynched(true);
      }
  }, []);

  useEffect(() => {
    const storedHistory = localStorage.getItem("history");
    if (gameState && syncHistory && storedHistory) {
      const colorMapping = ["yellow", "green", "blue", "orange"];
      const storedHistoryArray = storedHistory.split(",");
      const updatedHistory = [];
      const updatedTitles = [];
      let numCorrect = 0;
      let numMistakes = 0;
      for (let i = 0; i < Math.floor(storedHistoryArray.length / 4); i++) {
        const historyEntry = [];
        let firstSeen = "";
        let isCorrect = true;
        for (let j = i * 4; j < i * 4 + 4; j++) {
          const value = storedHistoryArray[j];
          if (!firstSeen) {
            firstSeen = value;
          } else {
            if (firstSeen !== value) {
              isCorrect = false;
            }
          }
          historyEntry.push(value);
        }
        if (isCorrect) {
          numCorrect = numCorrect + 1;
          const titleIndex = colorMapping.indexOf(firstSeen);
          let fullLyric = ""
          fullLyric = fullLyric +  gameState["songs"][i]["lyrics"][0]
          for (let k = 1; k < 4; k++) {
            fullLyric = fullLyric + " / " + gameState["songs"][i]["lyrics"][k]
          }
          updatedTitles.push({
            title: gameState["songs"][titleIndex]["title"],
            fullLyrics: fullLyric,
            color: firstSeen,
          });
        } else {
          numMistakes = numMistakes + 1;
        }
        updatedHistory.push(historyEntry);
      }
      setHistory(updatedHistory);
      setTitles(updatedTitles);
      setCorrectGuesses(numCorrect);
      setMistakeCount(numMistakes);
    }
  }, [syncHistory, gameState]);

  useEffect(() => {
    if (history && history.length !== prevHistoryLength) {
      localStorage.setItem("history", history.toString());
      const colorEmojiMapping: Map<string, number> = new Map();
      colorEmojiMapping.set("yellow", 0x1f7e8);
      colorEmojiMapping.set("green", 0x1f7e9);
      colorEmojiMapping.set("blue", 0x1f7e6);
      colorEmojiMapping.set("orange", 0x1f7e7);
      let updatedGuessGridText = "";
      for (let i = 0; i < history.length; i++) {
        let guessRow = "";
        for (let j = 0; j < 4; j++) {
          const emojiMapping = colorEmojiMapping.get(history[i][j]);
          if (emojiMapping) {
            guessRow = guessRow.concat(String.fromCodePoint(emojiMapping));
          }
        }
        guessRow = guessRow.concat("\n");
        updatedGuessGridText = updatedGuessGridText.concat(guessRow);
      }
      setGuessGridText(updatedGuessGridText);
      setPrevHistoryLength(prevHistoryLength + 1);
      setHistoryIsSynched(true);
    }
  }, [history, guessGridText, prevHistoryLength]);

  useEffect(() => {
    const colorMapping = ["yellow", "green", "blue", "orange"];
    if (gameState && mistakeCount > 0) {
      localStorage.setItem("lastPlayed", gameState["date"]);
      if (mistakeCount >= 4 && titles.length < 4) {
        setTimeout(() => {
          const updatedTitles = [...titles];
          for (let i = 0; i < 4; i++) {
            let fullLyric = ""
            fullLyric = fullLyric +  gameState["songs"][i]["lyrics"][0]
            for (let k = 1; k < 4; k++) {
              fullLyric = fullLyric + " / " + gameState["songs"][i]["lyrics"][k]
            }
            const answer = {
              title: gameState["songs"][i]["title"],
              fullLyrics: fullLyric,
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
            }
          }
          setTitles(updatedTitles);
          setCorrectGuesses(5);
          localStorage.setItem("streak", "0");
          setTimeout(() => setShowGameOverModal(true), 2500);
        }, 1100);
      }
    }
  }, [mistakeCount, gameState, titles, correctGuesses]);

  useEffect(() => {
    if (gameState && correctGuesses > 0) {
      const prevStreak = Number(localStorage.getItem("streak"));
      localStorage.setItem("lastPlayed", gameState["date"]);
      if (correctGuesses === 4) {
        setShowVictoryModal(true);
        const wonToday = localStorage.getItem("wonToday");
        if (prevStreak !== null && wonToday && wonToday === "false") {
          localStorage.setItem("streak", (prevStreak + 1).toString());
          localStorage.setItem("wonToday", "true");
        }
      }
    }
  }, [correctGuesses, gameState]);

  if (underMaintenance) {
    return (
    <div className="app">
      <Header theme={gameState?.["theme"]} />
      <div className="modalContainer">
        <Modal
          titleText={"Under maintenance"}
          bodyText={`We're currently making improvements to Lyrical Miscellany.\n\n  Planned return date: July 6th, 2024.\n\n  Thanks for your patience!`}
          isShareButtonModal={false}
          modalExitFunction={() => {}}
          date={gameState?.["date"]}
          theme={gameState?.["theme"]}
          setShowAlert={setShowAlert}
          setAlertText={setAlertText}
        />
      </div>
    </div>);
  } else {
    return (
      <>
        {showAlert && (
          <div className="alertContainer">
            <Alert text={alertText} />
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
              setShowAlert={setShowAlert}
              setAlertText={setAlertText}
            />
          </div>
        )}
        {showGameOverModal && (
          <div className="modalContainer">
            <Modal
              titleText={"Better luck next time..."}
              bodyText={`Streak: ${localStorage.getItem("streak")}${String.fromCodePoint(0x1f525)}\n\n${guessGridText}`}
              isShareButtonModal={true}
              modalExitFunction={() => setShowGameOverModal(false)}
              date={gameState?.["date"]}
              theme={gameState?.["theme"]}
              setShowAlert={setShowAlert}
              setAlertText={setAlertText}
            />
          </div>
        )}
        {showVictoryModal && (
          <div className="modalContainer">
            <Modal
              titleText={"Lyrical savant!"}
              bodyText={`Streak: ${localStorage.getItem("streak")}${String.fromCodePoint(0x1f525)}\n\n${guessGridText}`}
              isShareButtonModal={true}
              modalExitFunction={() => setShowVictoryModal(false)}
              date={gameState?.["date"]}
              theme={gameState?.["theme"]}
              setShowAlert={setShowAlert}
              setAlertText={setAlertText}
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
            historyIsSynched={historyIsSynched}
            setHistoryIsSynched={setHistoryIsSynched}
            setAlertText={setAlertText}
            shouldShuffle={shouldShuffle}
            setShouldShuffle={setShouldShuffle}
          />
          <Footer
            mistakeCount={mistakeCount}
            setShowInfoModal={setShowInfoModal}
            setShouldShuffle={setShouldShuffle}
          />
        </div>
      </>
    );
  }
};

export default App;
