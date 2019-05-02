export default {
  breadcrumbs: {
    gamelist() {
      return {
        parent: null,
        links: [
          {
            text: 'Leaderboards',
            to: {
              name: 'gamelist'
            }
          }
        ]
      }
    },
    leaderboard(data) {
      return {
        parent: 'gamelist',
        links: [
          {
            text: data.game.names.international,
            to: {
              name: 'leaderboard',
            }
          }
        ]
      }
    },
    run(data) {
      return {
        parent: 'leaderboard',
        links: [
          {
            text: data.run,
            to: {
              name: 'run',
            }
          }
        ]
      }
    }
  }
}