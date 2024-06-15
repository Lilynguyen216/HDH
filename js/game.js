let config = {
    type: Phaser.CANVAS,
    width: window.innerWidth,
    height: window.innerHeight,
    audio: {
        disableWebAudio: true,
    },
    dom: {
        createContainer: true,
    },
    fps: {
        forceSetTimeOut: true,
        target: 2
    },
    backgroundColor: '#E0C3FC',
    parent: 'gamePlay',
    scene: [introScene, lruScene, fifoScene, optScene, clockScene],
};
const game = new Phaser.Game(config);
