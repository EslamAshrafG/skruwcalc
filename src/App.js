import { useState } from "react";

function generateInitialPlayers(numRounds) {
  return [
    {
      name: "",
      ...Object.fromEntries(
        Array.from({ length: numRounds }, (_, i) => [`p${i + 1}`, 0])
      ),
    },
    {
      name: "",
      ...Object.fromEntries(
        Array.from({ length: numRounds }, (_, i) => [`p${i + 1}`, 0])
      ),
    },
    {
      name: "",
      ...Object.fromEntries(
        Array.from({ length: numRounds }, (_, i) => [`p${i + 1}`, 0])
      ),
    },
    {
      name: "",
      ...Object.fromEntries(
        Array.from({ length: numRounds }, (_, i) => [`p${i + 1}`, 0])
      ),
    },
    {
      name: "",
      ...Object.fromEntries(
        Array.from({ length: numRounds }, (_, i) => [`p${i + 1}`, 0])
      ),
    },
  ];
}

const generateNewPoints = (playersArr, numRounds) => {
  return playersArr.map((player) => {
    return {
      ...player,
      ...Object.fromEntries(
        Array.from({ length: numRounds }, (_, i) => [`p${i + 1}`, 0])
      ),
    };
  });
};

export default function App() {
  const [numRounds, setNumRounds] = useState(5);
  const [playersPoints, setPlayersPoints] = useState(() =>
    generateInitialPlayers(numRounds)
  );

  // Function to reset all players' points
  const resetAllPoints = () => {
    setPlayersPoints((playersPoints) =>
      generateNewPoints(playersPoints, numRounds)
    );
  };

  return (
    <>
      <NavBar>
        <Logo />
        <NumRounds numRounds={numRounds} setNumRounds={setNumRounds} />
        <Button onClick={resetAllPoints}>Reset</Button>
      </NavBar>
      <Main>
        <Box>
          <PlayersList
            numRounds={numRounds}
            players={playersPoints}
            setPlayersPoints={setPlayersPoints}
          />
          <LeadBoard players={playersPoints} />
        </Box>
      </Main>
      <Footer />
    </>
  );
}

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo" style={{ display: "flex", alignItems: "center" }}>
      <img
        src="./5VLbEUlI9v3S35hYgFljATTGwt45wb5L0IDJccUV.webp"
        style={{ width: "40px", aspectRatio: "1/1" }}
        alt=""
      />{" "}
      <h1>Skrew Calculator</h1>
    </div>
  );
}

function NumRounds({ numRounds, setNumRounds }) {
  function updateNumRounds(e) {
    if (!Number.isFinite(+e.target.value) || +e.target.value > 5) return;
    setNumRounds(+e.target.value);
  }

  return (
    <p className="num-results">
      <strong>
        <input
          className="rounds-number"
          type="text"
          value={numRounds}
          onChange={updateNumRounds}
        />
      </strong>{" "}
      Rounds
    </p>
  );
}

function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="btn">
      {children}
    </button>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  return <div className="box">{children}</div>;
}

function PlayersList({ players, numRounds, setPlayersPoints }) {
  const [isOpen, setIsOpen] = useState(true);
  // Handle updating a specific player's points
  const handleUpdatePlayerPoints = (index, updatedPoints) => {
    setPlayersPoints((prevPlayers) =>
      prevPlayers.map((player, i) =>
        i === index ? { ...player, ...updatedPoints } : player
      )
    );
  };

  return (
    <>
      {/* <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button> */}
      {isOpen && (
        <ul className="players-list">
          {players.map((player, index) => (
            <Player
              key={index}
              numRounds={numRounds}
              player={player}
              updatePlayerPoints={(updatedPoints) =>
                handleUpdatePlayerPoints(index, updatedPoints)
              }
            />
          ))}
        </ul>
      )}
    </>
  );
}

function Player({ player, numRounds, updatePlayerPoints }) {
  const total = Object.values(player)
    .slice(1)
    .reduce((acc, curr) => acc + curr, 0); // Exclude the name key

  function updatePoint(roundNumber, value) {
    updatePlayerPoints({ [`p${roundNumber}`]: value });
  }

  return (
    <li className="player">
      <input
        className="player-name"
        type="text"
        value={player.name}
        placeholder="Type Player Name Here..."
        onChange={(e) => updatePlayerPoints({ name: e.target.value })}
      />
      <RoundsList>
        {Array.from({ length: numRounds }, (_, i) => i + 1).map((num) => (
          <Round
            key={num}
            roundNumber={num}
            point={player[`p${num}`]}
            updatePoint={updatePoint}
            total={total}
          />
        ))}
      </RoundsList>
      <span className="total">Total: {total}</span>
    </li>
  );
}

function RoundsList({ children }) {
  return <div className="rounds">{children}</div>;
}

const greenPointsStyle = { backgroundColor: "green", color: "white" };
const redPointsStyle = { backgroundColor: "red", color: "white" };

function Round({ roundNumber, point, updatePoint }) {
  function handleRoundInput(e) {
    if (!Number.isFinite(+e.target.value)) return;
    updatePoint(roundNumber, +e.target.value);
  }

  return (
    <div className="round">
      <span>Round {roundNumber}:</span>
      <input
        type="text"
        style={
          point === 0 ? greenPointsStyle : point >= 20 ? redPointsStyle : {}
        }
        value={point}
        onChange={handleRoundInput}
      />
    </div>
  );
}

function Footer() {
  return (
    <footer>
      <p>
        Made By{" "}
        <a href="https://eslamashraf.netlify.app/" style={{ color: "#7950f2" }}>
          Islam Ashraf
        </a>
      </p>
    </footer>
  );
}

function LeadBoard({ players }) {
  const playersLead = players
    .map((player) => {
      const total = Object.values(player)
        .slice(1) // Exclude the name key
        .reduce((acc, curr) => acc + curr, 0);
      return { ...player, total };
    })
    .sort((a, b) => {
      if (!a.name) return 1; // Move unnamed player down
      if (!b.name) return -1; // Keep named player up
      return a.total - b.total; // Sort by total points in descending order
    });

  return (
    <div
      className="leadboard"
      style={{
        padding: "20px",
        backgroundColor: "#212529", // --color-background-900
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        color: "#dee2e6", // --color-text
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        margin: "10px 0",
      }}
    >
      {playersLead.map((player, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px",
            marginBottom: "10px",
            backgroundColor: "#2b3035", // --color-background-500
            borderRadius: "5px",
            color: i === 0 ? "#6741d9" : "#adb5bd", // --color-primary for the first, --color-text-dark for others
            fontWeight: i === 0 ? "bold" : "normal",
            fontSize: "18px",
          }}
        >
          <>
            <span>
              {i + 1} - {player.name || "Unnamed Player"}
            </span>
            <span style={{ color: "#fa5252" }}>
              {" "}
              {/* --color-red for points */}
              {player.total}
            </span>
          </>
        </div>
      ))}
    </div>
  );
}
