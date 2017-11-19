const friendImages = [
  require('./faces/image-2.png'),
  require('./faces/image-3.png'),
  require('./faces/image-4.png'),
  require('./faces/image-5.png'),
  require('./faces/image-6.png'),
  require('./faces/image-7.png'),
  require('./faces/image-8.png'),
  require('./faces/image-9.png'),
  require('./faces/image-10.png'),
  require('./faces/image-11.png')
];

export default {
  user: {
    portrait: require('./faces/image-1.png')
  },

  friends: Array(50)
    .fill(null)
    .map((_, i) => ({
      id: i,
      portrait: friendImages[i % friendImages.length]
    })),

  commonFriends: Array(50)
    .fill(null)
    .map((_, i) => ({
      id: i,
      portrait: friendImages[i % friendImages.length]
    }))
};
