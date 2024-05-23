class loss extends Binh {
    constructor() {
        super('lossScene');
    }
    create(){
        // ------------------background------------------
		this.sound.add('lossSound').play()
        let bgnightImg = this.add.image(400, 300, 'bgnight').setScale(0.2);
		let bluecloudImg = this.add.sprite(300,230,'bluecloud').setScale(1);

        let cutemoonImg = this.add.sprite(200, 10, 'cutemoon').setScale(0.05);
        let moonshineImg = this.add.sprite(200, 10, 'moonshine').setScale(0.05);
        let gameplaybgImg = this.add.image(400, 300, 'gameplaybg').setScale(0.55);
        let thatbaiImg = this.add.sprite(600, 120, 'lossText').setScale(0.32);
        let restartImg = this.add.sprite(600, 270, 'restart').setInteractive();

        // ------------------background------------------
    
        // ------------------Animation------------------
        this.glideyoyoXY(cutemoonImg, cutemoonImg.x + 10, cutemoonImg.y+200, 8000);
        this.glideyoyoXY(moonshineImg, moonshineImg.x + 10, moonshineImg.y+200, 8000);
        this.glideyoyoXY(thatbaiImg, thatbaiImg.x, thatbaiImg.y+20, 1000);
        restartImg.on('pointerover', function (pointer) {
            this.zoomscale(restartImg, 1.0005,10)
        }, this);
        restartImg.on('pointerout', function (pointer) {
            this.zoomscale(restartImg, 1,10)
        }, this);
        restartImg.on('pointerdown', function (pointer) {
			this.spin(restartImg,0,180,2)
            let introGameEvent = this.time.addEvent({delay: 1000, callback: introGameStart, callbackScope: this, loop: false});
            function introGameStart() {
                this.scene.start('introScene');
            }
        }, this);
		this.glideyoyoXY(bluecloudImg,bluecloudImg.x+40,bluecloudImg.y-40,9000);

        // ------------------Animation------------------

    }
}