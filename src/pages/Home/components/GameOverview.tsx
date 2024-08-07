import { Link } from "react-router-dom";

import type { Game } from "../../../types";

function GameOverview({ data }: { data: Game[] | undefined }) {
  return (
    <div className="bg-white p-5 rounded-xl dark:bg-gray-800">
      <div className="mb-4">
        <h5 className="font-semibold text-lg mb-0.5">Game Overview</h5>
        <p className="text-gray-500">Overview of the game's statistics.</p>
      </div>
      <div>
        {data?.map((game: Game) => (
          <div
            key={game?._id}
            className="bg-gray-100/80 px-3 py-2 rounded-md dark:bg-gray-700/40 mb-2 flex items-center justify-between transition hover:bg-gray-200/80 cursor-default hover:dark:bg-gray-700"
          >
            <h5 className="mb-0.5">{game?.name}</h5>
            <Link
              to={`/game/${game?._id}`}
              className="text-violet-500 text-xs hover:text-violet-600 transition dark:hover:text-violet-400"
            >
              Detail
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GameOverview;
