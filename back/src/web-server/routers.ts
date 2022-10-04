export const RoutersWebServer = {
  room: {
    base: '/room',
    find: '/find/:name',
    observers: '/:name/observers'
  },
  task: {
    base: '/task',
    reset: '/reset/:task',
    getAll: '/:room',
    history: '/:room/history',
    getLast: '/:room/last'
  },
  user: {
    base: '/user',
    getAllUsersInRoom: '/:room'
  }
};
