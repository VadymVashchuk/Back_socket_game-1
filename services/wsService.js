class WsService {
  constructor() {
    this.playersSockets = new Map()
  }

  addPlayerSocket(playerId, socket) {
    this.playersSockets.set(playerId, socket)
  }

  getPlayerSocket(playerId) {
    return this.playersSockets.get(playerId)
  }

  removePlayerSocket(playerId) {
    this.playersSockets.delete(playerId)
  }
}

module.exports = WsService;