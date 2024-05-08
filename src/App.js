import { useState, useEffect } from "react";
import spotify from "./lib/spotify";
import { SongList } from "./components/SongList";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [popularSongs, setPopularSongs] = useState([]);

  useEffect(() => {
    try {
      setIsLoading(true);
      fetchPopularSongs();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const fetchPopularSongs = async () => {
    const result = await spotify.getPopularSongs();
    const popularSongs = result.items.map((item) => {
      return item.track;
    });
    setPopularSongs(popularSongs);
  };

  console.log(popularSongs);
  // console.log(`ID:${process.env.REACT_APP_SPOTIFY_CLIENT_ID}`);
  // console.log(`SECRET:${process.env.REACT_APP_SPOTIFY_CLIENT_SECRET}`);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <main className="flex-1 p-8 mb-20">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">Music App</h1>
        </header>
        <section>
          <h2 className="text-2xl font-semibold mb-5">Popular Songs</h2>
          <SongList isLoading={isLoading} songs={popularSongs} />
        </section>
      </main>
    </div>
  );
}
