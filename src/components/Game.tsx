import { useEffect, useState } from "react";
import { Row } from "./Row";
import { GameState } from "../types/GameState";
import { Answer } from "../types/Answer";

interface GameProps {
  gameState: GameState | null;
  mistakeCount: number;
  setMistakeCount: Function;
  setShowAlert: Function;
  correctGuesses: number;
  setCorrectGuesses: Function;
  history: string[][];
  setHistory: Function;
  titles: Answer[];
  setTitles: Function;
  historyIsSynched: boolean;
  setHistoryIsSynched: Function;
  setAlertText: Function;
  shouldShuffle: boolean;
  setShouldShuffle: Function;
}

export const Game = ({
  gameState,
  mistakeCount,
  setMistakeCount,
  setShowAlert,
  correctGuesses,
  setCorrectGuesses,
  setHistory,
  history,
  titles,
  setTitles,
  historyIsSynched,
  setHistoryIsSynched,
  setAlertText,
  shouldShuffle,
  setShouldShuffle,
}: GameProps) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectedCoords, setSelectedCoords] = useState<Set<string>>(new Set());
  const [rowLyrics, setRowLyrics] = useState<string[][]>([]);
  const [tileClasses, setTileClasses] = useState({
    "00": "tile",
    "01": "tile",
    "02": "tile",
    "03": "tile",
    "10": "tile",
    "11": "tile",
    "12": "tile",
    "13": "tile",
    "20": "tile",
    "21": "tile",
    "22": "tile",
    "23": "tile",
    "30": "tile",
    "31": "tile",
    "32": "tile",
    "33": "tile",
  });
  const [rowsUpdated, setRowsUpdated] = useState(false);

  useEffect(() => {
    if (gameState !== null && rowLyrics.length === 0) {
      let seenLyrics = new Set<string>();
      const tempRowLyrics = [];
      while (tempRowLyrics.length < 4) {
        const currRowLyrics = [];
        while (currRowLyrics.length < 4) {
          const songIndex = Math.floor(Math.random() * 4);
          const lyricIndex = Math.floor(Math.random() * 4);
          const lyric = gameState["songs"][songIndex]["lyrics"][lyricIndex];
          if (!seenLyrics.has(lyric)) {
            currRowLyrics.push(lyric);
            seenLyrics.add(lyric);
          }
        }
        tempRowLyrics.push(currRowLyrics);
      }
      setRowLyrics(tempRowLyrics);
    }
  }, [gameState, rowLyrics]);

  useEffect(() => {
    if (
      gameState !== null &&
      ((historyIsSynched && !rowsUpdated) || shouldShuffle)
    ) {
      let seenLyrics = new Set<string>();
      const tempRowLyrics = [];
      const colorMapping = ["yellow", "green", "blue", "orange"];
      let alreadyGuessedSongIndices = new Set<number>();
      for (let i = 0; i < titles.length; i++) {
        alreadyGuessedSongIndices.add(colorMapping.indexOf(titles[i]["color"]));
      }
      for (let i = 0; i < alreadyGuessedSongIndices.size; i++) {
        tempRowLyrics.push(["filler", "filler", "filler", "filler"]);
      }
      while (tempRowLyrics.length < 4) {
        const currRowLyrics = [];
        while (currRowLyrics.length < 4) {
          const songIndex = Math.floor(Math.random() * 4);
          const lyricIndex = Math.floor(Math.random() * 4);
          const lyric = gameState["songs"][songIndex]["lyrics"][lyricIndex];
          if (
            !seenLyrics.has(lyric) &&
            !alreadyGuessedSongIndices.has(songIndex)
          ) {
            currRowLyrics.push(lyric);
            seenLyrics.add(lyric);
          }
        }
        tempRowLyrics.push(currRowLyrics);
      }
      setTileClasses({
        "00": "tile",
        "01": "tile",
        "02": "tile",
        "03": "tile",
        "10": "tile",
        "11": "tile",
        "12": "tile",
        "13": "tile",
        "20": "tile",
        "21": "tile",
        "22": "tile",
        "23": "tile",
        "30": "tile",
        "31": "tile",
        "32": "tile",
        "33": "tile",
      });
      setSelected(new Set());
      setSelectedCoords(new Set());
      setRowLyrics(tempRowLyrics);
      setHistoryIsSynched(false);
      setRowsUpdated(true);
      setShouldShuffle(false);
    }
  }, [
    gameState,
    titles,
    historyIsSynched,
    setHistoryIsSynched,
    rowsUpdated,
    shouldShuffle,
    setShouldShuffle,
  ]);

  useEffect(() => {
    if (selected.size >= 4 && gameState) {
      const colorMapping = ["yellow", "green", "blue", "orange"];
      const guesses = [];
      for (let i = 0; i < 4; i++) {
        const tempSelected = new Set(selected);
        for (let j = 0; j < 4; j++) {
          const tempSelectedSize = tempSelected.size;
          tempSelected.add(gameState["songs"][i]["lyrics"][j]);
          if (tempSelectedSize === tempSelected.size) {
            guesses.push(colorMapping[i]);
          }
        }
        if (tempSelected.size === 4) {
          const seenTiles = new Set();
          const selectedCoordValues = selectedCoords.values();
          for (let m = 0; m < 4; m++) {
            const selectedCoord = selectedCoordValues.next().value.split("");
            if (selectedCoord[0] !== correctGuesses.toString()) {
              for (let n = 0; n < 4; n++) {
                if (
                  !selectedCoords.has(
                    correctGuesses.toString().concat(n.toString()),
                  ) &&
                  !seenTiles.has(n)
                ) {
                  const tempLyric = rowLyrics[correctGuesses][n];
                  rowLyrics[correctGuesses][n] =
                    rowLyrics[selectedCoord[0]][selectedCoord[1]];
                  rowLyrics[selectedCoord[0]][selectedCoord[1]] = tempLyric;
                  seenTiles.add(n);
                  break;
                }
              }
            }
          }
          let fullLyric = ""
            fullLyric = fullLyric +  gameState["songs"][i]["lyrics"][0]
            for (let k = 1; k < 4; k++) {
              fullLyric = fullLyric + " / " + gameState["songs"][i]["lyrics"][k]
          }
          setTileClasses({
            "00": "tile",
            "01": "tile",
            "02": "tile",
            "03": "tile",
            "10": "tile",
            "11": "tile",
            "12": "tile",
            "13": "tile",
            "20": "tile",
            "21": "tile",
            "22": "tile",
            "23": "tile",
            "30": "tile",
            "31": "tile",
            "32": "tile",
            "33": "tile",
          });
          setSelected(new Set());
          setSelectedCoords(new Set());
          setCorrectGuesses(correctGuesses + 1);
          setTitles([
            ...titles,
            { title: gameState["songs"][i]["title"], fullLyrics: fullLyric, color: colorMapping[i] },
          ]);
          setHistory([...history, guesses]);
          return;
        } else if (tempSelected.size === 5) {
          setAlertText("One away...");
          setShowAlert(true);
        }
      }
      const selectedCoordValues = selectedCoords.values();
      let updatedTileClasses = {
        "00": "tile",
        "01": "tile",
        "02": "tile",
        "03": "tile",
        "10": "tile",
        "11": "tile",
        "12": "tile",
        "13": "tile",
        "20": "tile",
        "21": "tile",
        "22": "tile",
        "23": "tile",
        "30": "tile",
        "31": "tile",
        "32": "tile",
        "33": "tile",
      };

      for (let p = 0; p < 4; p++) {
        const selectedCoordValue = selectedCoordValues.next().value;
        updatedTileClasses = {
          ...updatedTileClasses,
          [selectedCoordValue]: "tile mistakeAnimation",
        };
      }

      setTileClasses(updatedTileClasses);
      setSelected(new Set());
      setSelectedCoords(new Set());
      setMistakeCount(mistakeCount + 1);
      setHistory([...history, guesses]);
      setTimeout(() => {
        setShowAlert(false);
      }, 1500);
    }
  }, [
    gameState,
    selected,
    correctGuesses,
    setCorrectGuesses,
    tileClasses,
    rowLyrics,
    selectedCoords,
    titles,
    mistakeCount,
    setMistakeCount,
    setShowAlert,
    history,
    setHistory,
    setTitles,
    setAlertText,
  ]);

  const handleOnClick = (rowNumber: number, tileNumber: number): boolean => {
    const lyric = rowLyrics?.[rowNumber][tileNumber];
    const tileCoord = rowNumber.toString().concat(tileNumber.toString());
    if (selected.has(lyric)) {
      const updatedSelectState = new Set(selected);
      const updatedSelectedCoordsState = new Set(selectedCoords);
      updatedSelectState.delete(lyric);
      updatedSelectedCoordsState.delete(tileCoord);
      setSelected(updatedSelectState);
      setSelectedCoords(updatedSelectedCoordsState);
      return true;
    }
    if (selected.size < 4) {
      setSelected(new Set(selected).add(lyric));
      setSelectedCoords(new Set(selectedCoords).add(tileCoord));
      return true;
    }
    return false;
  };

  return (
    <div className="game">
      <Row
        rowLyrics={rowLyrics[0]}
        onClick={handleOnClick}
        rowNumber={0}
        tileClasses={tileClasses}
        setTileClasses={setTileClasses}
        showAnswer={correctGuesses >= 1}
        title={titles.length > 0 ? titles[0]["title"] : ""}
        fullLyric={titles.length > 0 ? titles[0]["fullLyrics"] : ""}
        answerColor={titles.length > 0 ? titles[0]["color"] : ""}
      />
      <Row
        rowLyrics={rowLyrics[1]}
        onClick={handleOnClick}
        rowNumber={1}
        tileClasses={tileClasses}
        setTileClasses={setTileClasses}
        showAnswer={correctGuesses >= 2}
        title={titles.length > 1 ? titles[1]["title"] : ""}
        fullLyric={titles.length > 1 ? titles[1]["fullLyrics"] : ""}
        answerColor={titles.length > 1 ? titles[1]["color"] : ""}
      />
      <Row
        rowLyrics={rowLyrics[2]}
        onClick={handleOnClick}
        rowNumber={2}
        tileClasses={tileClasses}
        setTileClasses={setTileClasses}
        showAnswer={correctGuesses >= 3}
        title={titles.length > 2 ? titles[2]["title"] : ""}
        fullLyric={titles.length > 2 ? titles[2]["fullLyrics"] : ""}
        answerColor={titles.length > 2 ? titles[2]["color"] : ""}
      />
      <Row
        rowLyrics={rowLyrics[3]}
        onClick={handleOnClick}
        rowNumber={3}
        tileClasses={tileClasses}
        setTileClasses={setTileClasses}
        showAnswer={correctGuesses >= 4}
        title={titles.length > 3 ? titles[3]["title"] : ""}
        fullLyric={titles.length > 3 ? titles[3]["fullLyrics"] : ""}
        answerColor={titles.length > 3 ? titles[3]["color"] : ""}
      />
    </div>
  );
};
