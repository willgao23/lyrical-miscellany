import { AnswerOverlay } from "./AnswerOverlay";
import { Tile } from "./Tile";

interface RowProps {
  rowLyrics: string[];
  onClick: Function;
  rowNumber: number;
  tileClasses: any;
  setTileClasses: Function;
  showAnswer: boolean;
  title: string;
  answerColor: string;
  fullLyric: string;
}

export const Row = ({
  rowLyrics,
  onClick,
  rowNumber,
  tileClasses,
  setTileClasses,
  showAnswer,
  title,
  answerColor,
  fullLyric
}: RowProps) => {
  if (showAnswer) {
    return <AnswerOverlay title={title} color={answerColor} fullLyric={fullLyric}/>;
  } else {
    return (
      <div className="row">
        <Tile
          lyric={rowLyrics?.[0]}
          rowNumber={rowNumber}
          tileNumber={0}
          onClick={onClick}
          tileClasses={tileClasses}
          setTileClasses={setTileClasses}
        />
        <Tile
          lyric={rowLyrics?.[1]}
          rowNumber={rowNumber}
          tileNumber={1}
          onClick={onClick}
          tileClasses={tileClasses}
          setTileClasses={setTileClasses}
        />
        <Tile
          lyric={rowLyrics?.[2]}
          rowNumber={rowNumber}
          tileNumber={2}
          onClick={onClick}
          tileClasses={tileClasses}
          setTileClasses={setTileClasses}
        />
        <Tile
          lyric={rowLyrics?.[3]}
          rowNumber={rowNumber}
          tileNumber={3}
          onClick={onClick}
          tileClasses={tileClasses}
          setTileClasses={setTileClasses}
        />
      </div>
    );
  }
};
