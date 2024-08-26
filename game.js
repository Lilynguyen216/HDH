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
    // backgroundColor: '#E0C3FC',
	scene: {
        preload: function() {
            // Load the background image
            this.load.image('background', './assets/996.jpg');
        },
        create: function() {
            // Display the background image for scene1
            this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(window.innerWidth, window.innerHeight);
        }
    },
    parent: 'gamePlay',
    scene: [scene1, scene2],
};
const game = new Phaser.Game(config)

// game.scene.start('scene1');