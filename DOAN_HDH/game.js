let config = {
    type: Phaser.CANVAS,
    width: window.innerWidth,
    height: window.innerHeight,

    audio: {
        disableWebAudio: true
    },
    dom: {
        createContainer: true
    },
    backgroundColor: '#CC3300',
    parent: 'gamePlay',
    scene: [scene1, scene2],
};
const game = new Phaser.Game(config)