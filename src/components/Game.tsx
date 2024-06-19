import { useEffect, useState } from "react";
import { Row } from "./Row";
import { GameState } from "../types/GameState";

interface GameProps {
  gameState: GameState | null;
  mistakeCount: number
  setMistakeCount: Function
}

interface Answer {
  title: string;
  color: string;
}

export const Game = ({ gameState, mistakeCount, setMistakeCount}: GameProps) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectedCoords, setSelectedCoords] = useState<Set<string>>(
    new Set()
  );
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
  const [correctGuesses, setCorrectGuesses] = useState(0);
  const [titles, setTitles] = useState<Answer[]>([]);


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
    if (selected.size >= 4 && gameState) {
      for (let i = 0; i < 4; i++) {
        const tempSelected = new Set(selected);
        for (let j = 0; j < 4; j++) {
          tempSelected.add(gameState["songs"][i]["lyrics"][j]);
        }
        if (tempSelected.size === 4) {
          const colorMapping = ["yellow", "green", "blue", "orange"];
          const seenTiles = new Set()
          const selectedCoordValues = selectedCoords.values();
          for (let m = 0; m < 4; m++) {
            const selectedCoord = selectedCoordValues.next().value.split('');
            if (selectedCoord[0] !== correctGuesses.toString()) {
              for (let n = 0; n < 4; n++) {
                if (!selectedCoords.has(correctGuesses.toString().concat(n.toString())) && !seenTiles.has(n)) {
                  const tempLyric = rowLyrics[correctGuesses][n];
                  rowLyrics[correctGuesses][n] =
                    rowLyrics[selectedCoord[0]][selectedCoord[1]];
                  rowLyrics[selectedCoord[0]][selectedCoord[1]] =
                    tempLyric;
                    seenTiles.add(n)
                  break;
                }
              }
            }
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
            { title: gameState["songs"][i]["title"], color: colorMapping[i] },
          ]);
          console.log("correct!");
          return;
        }
      }
      console.log("incorrect");
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
      }

      for (let p = 0; p < 4; p++) {
        const selectedCoordValue = selectedCoordValues.next().value
        updatedTileClasses = {
          ...updatedTileClasses,
          [selectedCoordValue]: "tile mistakeAnimation"
        }
      }
      
      setTileClasses(updatedTileClasses);

      setSelected(new Set());
      setSelectedCoords(new Set());
      setMistakeCount(mistakeCount + 1)
    }
  }, [
    gameState,
    selected,
    correctGuesses,
    tileClasses,
    rowLyrics,
    selectedCoords,
    titles,
    mistakeCount,
    setMistakeCount
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
        answerColor={titles.length > 3 ? titles[3]["color"] : ""}
      />
    </div>
  );
};
