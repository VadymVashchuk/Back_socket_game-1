const express = require("express");
const WebSocket = require("ws");
const app = express();
const port = 3000;

app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const WsService = require("./services/wsService");
const dataBase = require("./data/database");

appData = new dataBase();
module.exports = { appData };
const socketService = new WsService();

const url = require("url");

const authController = require("./controllers/auth");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/connect", authController.connectPlayer);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const socket = new WebSocket.Server({ port: 4000 });

socket.on("connection", (ws, req) => {
  const { query } = url.parse(req.url, true);
  const playerId = query.id;

  socketService.addPlayerSocket(playerId, ws);
  const playerWs = socketService.getPlayerSocket(playerId);
  console.log(socketService.playersSockets);

  appData.setPlayerOnline(playerId);

  playerWs.on("message", (message) => {
    const mess = JSON.parse(message);
    console.log(mess);
    if (mess.type === "play") {
      const response = appData.startSearch(mess.data.id);
      if (response.status) {
        const response = appData.getAnotherPlayer(mess.data.id);
        console.log(response);
        if (response.status) {
          const resp = appData.createGame(mess.data.id, response.data.id);
          if (resp.status) {
            playerWs.send(
              JSON.stringify({ type: "gameReady", data: resp.data })
            );
            const anotherPlayerWs = socketService.getPlayerSocket(
              response.data.id
            );
            console.log(anotherPlayerWs);
            anotherPlayerWs.send(
              JSON.stringify({ type: "gameReady", data: resp.data })
            );
          }
        } else {
          playerWs.send(
            JSON.stringify({ type: "play", data: { status: "searching" } })
          );
        }
      }
    }

    if (mess.type === "move") {
      if (!mess.data?.gameId || !mess.data?.playerId || !mess.data?.field) {
        console.log("not valid data");
        return;
      }
      const game = appData.getGame(mess.data.gameId);
      const player = game.players.find(
        (item) => item.id === mess.data.playerId
      );
      const anotherPlayer = game.players.find(
        (item) => item.id !== mess.data.playerId
      );
      if (game.nextMove !== player.role) {
        playerWs.send(
          JSON.stringify({ type: "move", data: { error: "Not your move" } })
        );
        return;
      }
      if (game.fields[mess.data.field] !== null) {
        playerWs.send(
          JSON.stringify({ type: "move", data: { error: "Wrong move!" } })
        );
        return;
      }
      game.fields[mess.data.field] = player.role;
      appData.checkIfGameIsOver(mess.data.gameId)
      if (game.nextMove === "X") {
        game.nextMove = "O";
      } else {
        game.nextMove = "X";
      }
      playerWs.send(JSON.stringify({ type: "move", data: game }));
      const anotherPlayerWs = socketService.getPlayerSocket(anotherPlayer.id);
      anotherPlayerWs.send(JSON.stringify({ type: "move", data: game }));
    }
  });

  playerWs.on("close", () => {
    console.log("oh no!!");
    socketService.removePlayerSocket(playerId);
    appData.setPlayerOffline();
  });
});
