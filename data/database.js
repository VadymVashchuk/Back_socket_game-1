class dataBase {
  constructor() {
    this.players = [];
    this.games = [];
  }

  addPlayer(name) {
    const exists = this.players.find((item) => item.name === name);
    if (exists) {
      console.log("player already exists");
      return { status: false };
    }
    const newPlayer = {
      id: generatePlayerId(),
      name: name,
      status: "offline",
    };
    this.players.push(newPlayer);
    return { status: true, data: newPlayer };
  }

  getPlayer(playerId) {
    const player = this.players.find((item) => item.id === playerId);
    if (player) {
      return player;
    }
  }

  setPlayerOffline(playerId) {
    const player = this.players.find((item) => item.id === playerId);
    if (!player) {
      console.log("player not found");
      return { status: false };
    }
    player.status = "offline";
    return { status: true, data: { status: "offline" } };
  }

  setPlayerOnline(playerId) {
    const player = this.players.find((item) => item.id === playerId);
    if (!player) {
      console.log("player not found");
      return { status: false };
    }
    player.status = "online";
    return { status: true, data: { status: "online" } };
  }

  startSearch(playerId) {
    const player = this.players.find((item) => item.id === playerId);
    if (!player) {
      console.log("player not found");
      return { status: false };
    }
    player.status = "searching";
    return { status: true, data: { status: "searching" } };
  }

  getAnotherPlayer(playerId) {
    const anotherPlayer = this.players.find(
      (item) => item.id !== playerId && item.status === "searching"
    );
    if (!anotherPlayer) {
      console.log("waiting");
      return { status: false };
    }
    return { status: true, data: anotherPlayer };
  }

  createGame(player1Id, player2Id) {
    const player1 = this.getPlayer(player1Id);
    const player2 = this.getPlayer(player2Id);
    const newGame = {
      id: generatePlayerId(),
      players: [
        { id: player1Id, name: player1.name, role: "X" },
        { id: player2Id, name: player2.name, role: "O" },
      ],
      fields: {
        f1: null,
        f2: null,
        f3: null,
        f4: null,
        f5: null,
        f6: null,
        f7: null,
        f8: null,
        f9: null,
      },
      nextMove: "X",
    };
    this.games.push(newGame);
    return { status: true, data: newGame };
  }

  getGame(gameId) {
    const game = this.games.find((item) => item.id === gameId);
    if (game) {
      return game;
    }
  }

  checkIfGameIsOver(gameId) {
    const game = this.getGame(gameId);
    const { fields } = game;
    if (
      (fields.f1 === fields.f2 && fields.f2 === fields.f3 && fields.f1) ||
      (fields.f4 === fields.f5 && fields.f5 === fields.f6 && fields.f4) ||
      (fields.f7 === fields.f8 && fields.f8 === fields.f9 && fields.f7) ||
      (fields.f1 === fields.f4 && fields.f4 === fields.f7 && fields.f1) ||
      (fields.f2 === fields.f5 && fields.f5 === fields.f8 && fields.f2) ||
      (fields.f3 === fields.f6 && fields.f6 === fields.f9 && fields.f3) ||
      (fields.f1 === fields.f5 && fields.f5 === fields.f9 && fields.f1) ||
      (fields.f3 === fields.f5 && fields.f5 === fields.f7 && fields.f3)
    ) {
      console.log("game over somebody won");
      return;
    }
    if (
      fields.f1 &&
      fields.f2 &&
      fields.f3 &&
      fields.f4 &&
      fields.f5 &&
      fields.f6 &&
      fields.f7 &&
      fields.f8 &&
      fields.f9
    ) {
      console.log("game over - draw");
      return;
    }
    console.log('game not finished')
  }
}

function generatePlayerId() {
  return Math.random().toString(36).substr(2, 9);
}

module.exports = dataBase;
