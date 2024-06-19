export interface GameState {
  date: string;
  songs: Song[];
  theme: string;
}

export interface Song {
  lyrics: string[];
  title: string;
}
