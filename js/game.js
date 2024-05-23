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
    backgroundColor: '#E0C3FC',
    parent: 'gamePlay',
    scene: intro
}
const game = new Phaser.Game(config)
