const { appData } = require("../server");

console.log(appData.players);

exports.connectPlayer = (req, res) => {
  console.log(appData)
  const { playerName } = req.body;
  console.log(playerName);
  const response = appData.addPlayer(playerName)
  if (response.status) {
      res.json({ status: true, playerId: response.data.id });
  } else {
    res.json({ status: false });
  }
};
