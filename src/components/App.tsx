import { useEffect, useState } from 'react';
import '../App.css';
import { Footer } from './Footer';
import { Game } from './Game';
import { Header } from './Header';
import { GameState } from '../types/GameState';
import { Alert } from './Alert';

const App = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [mistakeCount, setMistakeCount] = useState(0);
  useEffect(() => {
    fetch('http://127.0.0.1:5000/game')
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
          setGameState(data);
        })
        .catch((err) => {
          console.log(err.message);
        });
  }, []);
  const [showAlert, setShowAlert] = useState(false);

  return (
    <>
    <div className='alertContainer'>
      {showAlert && <Alert/>}
    </div>
    <div className='app'>
      <Header theme={gameState?.["theme"]}/>
      <Game gameState={gameState} mistakeCount={mistakeCount} setMistakeCount={setMistakeCount} setShowAlert={setShowAlert}/>
      <Footer mistakeCount={mistakeCount}/>
    </div>
    </>
  )
}

export default App;
