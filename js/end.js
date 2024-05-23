class end extends Binh {
    constructor() {
        super('endScene');
    }
    create() {
		this.sound.add('winSound',{volume: 0.5,loop:false}).play()

        var introbg0310 = this.add.image(400, 300, 'introbg0310').setScale(0.5);
        var thanhcong = this.add.image(400, 100, 'thanhcong').setScale(0.4);
        //var boywin =  this.add.image(550,400,'boywin').setScale(0.075);	
        this.glideyoyoXY(thanhcong, thanhcong.x, thanhcong.y + 50, 3000);
       

        var play = this.add.image(250, 400, 'restart').setScale(1).setInteractive();
        play.on('pointerover', function(pointer) {
			var zoom1;
            this.zoomscale(play, 1, 1.5, zoom1)
        }, this);
        play.on('pointerout', function(pointer) {
            var zoom2;
            this.zoomscale(play, 1, 1, zoom2)
        }, this);
        play.on('pointerdown', function(pointer) {
            var zoom3
            this.glidetoXY(play, play.x + 1000, play.y, 1500);
            this.spin(play, 1, 720, 3)
            var timedEvent = this.time.addEvent({
                delay: 1500,
                callback: level1start,
                callbackScope: this,
                loop: false
            });

            function level1start() {
                this.scene.start('introScene')
            }
        }, this);
    }

}
