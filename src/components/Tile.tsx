
interface TileProps {
  lyric: string;
  onClick: Function;
  rowNumber: number;
  tileNumber: number;
  tileClasses: any;
  setTileClasses: Function;
}

export const Tile = ({ lyric, onClick, rowNumber, tileNumber, tileClasses, setTileClasses}: TileProps) => {
  const tileMapIndex = rowNumber.toString().concat(tileNumber.toString());
  const handleOnClick = () => {
    if (onClick(rowNumber, tileNumber)) {
      tileClasses[tileMapIndex] === "tile selectedTile" ? setTileClasses({...tileClasses, [tileMapIndex]: "tile"}) : setTileClasses({...tileClasses, [tileMapIndex]: "tile selectedTile"})
    }
  }

  return (
    <div onClick={handleOnClick} className={tileClasses[tileMapIndex]}>
        <div className="textBox">{lyric}</div>
    </div>
  );
};
