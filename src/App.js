import { useState, useEffect, useRef } from "react";
import spotify from "./lib/spotify";
import { SongList } from "./components/SongList";
import { Player } from "./components/Player";
import { SearchInput } from "./components/SearchInput";
import { Pagination } from "./components/Pagenation";

const limit = 20;

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [popularSongs, setPopularSongs] = useState([]);
  const [isPlay, setIsPlay] = useState(false);
  const [selectedSong, setSelectedSong] = useState("");
  const [keyword, setKeyword] = useState("");
  const [searchedSongs, setSearchedSongs] = useState();
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const audioRef = useRef(null);
  const isSerachedResult = searchedSongs != null;

  useEffect(() => {
    try {
      setIsLoading(true);
      fetchPopularSongs();
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
    setIsLoading(false);
  };

  const handleSongSelected = async (song) => {
    setSelectedSong(song);
    if (song.preview_url != null) {
      audioRef.current.src = song.preview_url;
      playSong();
    } else {
      pauseSong();
      alert("曲未登録のため再生できません！");
    }
  };

  const playSong = () => {
    audioRef.current.play();
    setIsPlay(true);
  };

  const pauseSong = () => {
    audioRef.current.pause();
    setIsPlay(false);
  };

  const toggleSong = () => {
    if (isPlay) {
      pauseSong();
    } else {
      playSong();
    }
  };

  const handleInputChange = (e) => {
    setKeyword(e.target.value);
  };

  const searchSongs = async (page) => {
    if (keyword) {
      setIsLoading(true);
      const offset = parseInt(page) ? (parseInt(page) - 1) * limit : 0;
      const result = await spotify.searchSongs(keyword, limit, offset);
      setHasNext(result.next != null);
      setHasPrev(result.previous != null);
      setSearchedSongs(result.items);
      setIsLoading(false);
    } else {
      alert("探したい曲名を入力してください");
    }
  };

  const moveToNext = async () => {
    const nextPage = page + 1;
    await searchSongs(nextPage);
    setPage(nextPage);
  };

  const moveToPrev = async () => {
    const prevPage = page - 1;
    await searchSongs(prevPage);
    setPage(prevPage);
  };

  // console.log(popularSongs);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <main className="flex-1 p-8 mb-20">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">Music App</h1>
        </header>
        <SearchInput
          keyword={keyword}
          onInputChange={handleInputChange}
          onSubmit={searchSongs}
        />
        <section>
          <h2 className="text-2xl font-semibold mb-5">
            {isSerachedResult ? `[ ${keyword} ] の検索結果` : "Popular Songs"}
          </h2>
          <SongList
            isLoading={isLoading}
            songs={isSerachedResult ? searchedSongs : popularSongs}
            onSongSelected={handleSongSelected}
          />
          {isSerachedResult && (
            <Pagination
              onPrev={hasPrev ? moveToPrev : null}
              onNext={hasNext ? moveToNext : null}
            />
          )}
        </section>
        {selectedSong && (
          <Player
            song={selectedSong}
            isPlay={isPlay}
            onButtonClick={toggleSong}
          />
        )}
        <audio ref={audioRef} />
      </main>
    </div>
  );
}
