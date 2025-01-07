import { useCallback, useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

// Define types for player and statistics
interface PlayerStatistics {
  coins: number;
  experience_point: number;
  games_played: number;
  games_won: number;
}

interface Player {
  id: string;
  name: string;
  active: boolean;
  country: string;
  statistics: PlayerStatistics;
}

interface SearchBarProps {
  placeholder?: string;
  onQueryChange?: (query: any) => Promise<void>;
}

interface QueryState {
  country: string;
  searchKey: string;
}

// Helper function to debounce
function debounce(func: (...args: any[]) => void, delay: number) {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  onQueryChange,
}) => {
  const { player, setPlayer } = useContext(AuthContext);
  const [query, setQuery] = useState<QueryState>({
    country: "",
    page: 1,
    pageSize: 1000,
    searchKey: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const debouncedSearch = useCallback(
    debounce(async (searchQuery: QueryState) => {
      try {
        await onQueryChange(searchQuery); // Call the passed function to fetch results
      } catch (error) {
        console.error("Error in API call:", error);
      } finally {
        setLoading(false); // Stop loading after the API call is completed
      }
    }, 500), // Debounce delay
    [onQueryChange]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setQuery((prevQuery) => ({
      ...prevQuery,
      [name]: value,
    }));
    if (!value.length) {
      setPlayer([]); // Clear players if no input
    }
    setLoading(true); // Start loading when the search query changes

    debouncedSearch({ ...query, [name]: value }); // Trigger the debounced search
  };

  const handleBlur = () => {
    // Ensure loading hides after blur with a slight delay
    setTimeout(() => {
      if (!loading) {
        setLoading(false);
      }
    }, 200);
  };

  // Modal state and functions
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null); // State for the modal

  const handlePlayerClick = (playerData: Player) => {
    setSelectedPlayer(playerData); // Set the selected player to show in the modal
  };

  const closeModal = () => {
    setSelectedPlayer(null); // Close the modal by setting the selected player to null
  };

  return (
    <div className="relative w-full max-w-2xl flex gap-5">
      <input
        type="text"
        name="country"
        value={query.country}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder={placeholder || "Type to search by Country..."}
        className="w-full p-3 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
      />
      <input
        type="text"
        name="searchKey"
        value={query.searchKey}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder={placeholder || "Type to search by Name..."}
        className="w-full p-3 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
      />
      <button
        onClick={() =>
          setQuery({
            country: "",
            searchKey: "",
          })
        }
        className="p-3 rounded-lg bg-red-500 text-white"
      >
        Reset
      </button>

      {/* Displaying the loading state while the API call is in progress */}
      {loading ? (
        <div className="absolute w-full bg-white rounded-lg  mt-14 p-3 text-gray-500">
          Loading...
        </div>
      ) : (
        <ul className="absolute w-full bg-white rounded-lg  mt-14 max-h-60 overflow-y-auto">
          {/* Show 'No data found' only if there's a search query and no players */}
          {query.country || query.searchKey ? (
            player?.length > 0 ? (
              player.map((item, index) => (
                <li
                  key={index}
                  className="p-3 hover:bg-blue-500 hover:text-white cursor-pointer"
                  onClick={() => handlePlayerClick(item)}
                >
                  {item.name} {/* Assuming player name is displayed */}
                </li>
              ))
            ) : (
              <li className="p-3 text-gray-500">No data found</li>
            )
          ) : null}
        </ul>
      )}
      <PlayerModal player={selectedPlayer} onClose={closeModal} />
    </div>
  );
};

export default SearchBar;

interface PlayerModalProps {
  player: Player | null;
  onClose: () => void;
}

const PlayerModal: React.FC<PlayerModalProps> = ({ player, onClose }) => {
  if (!player) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <button
          onClick={onClose}
          className=" ml-auto w-full text-gray-500 text-right"
        >
          X
        </button>
        <h2 className="text-xl font-semibold mb-4">{player.name}</h2>
        <div className="space-y-4">
          <p>
            <strong>ID:</strong> {player.id}
          </p>
          <p>
            <strong>Country:</strong> {player.country}
          </p>
          <div className="space-y-1">
            <p>
              <strong>Coins:</strong> {player.statistics.coins}
            </p>
            <p>
              <strong>Experience Points:</strong>{" "}
              {player.statistics.experience_point}
            </p>
            <p>
              <strong>Games Played:</strong> {player.statistics.games_played}
            </p>
            <p>
              <strong>Games Won:</strong> {player.statistics.games_won}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
