class pageReplacement extends Phaser.Scene {
    backgroundAlgorithm(algorithm) {
        this.add.image(GAME_WIDTH / 2 + 100, GAME_HEIGHT / 2, 'light_galaxy1');
        const POSX_STATIC_TXT = 1000;
        this.add.image(POSX_STATIC_TXT, 300, 'replacedPageTxt');
        this.add.image(POSX_STATIC_TXT + 370, 300, 'normalPageTxt');
        this.add.image(POSX_STATIC_TXT - 30, 670, 'totalPageFaultsTxt');
        this.add.text(POSX_STATIC_TXT + 100, 655, algorithm.pageFault, {
            color: '#f7931e',
            fontSize: 28
        });
    }
    hoverBigObject(sprite) {
        sprite.setScale(0.8);
        sprite.on('pointerover', () => {
            sprite.scale = 0.9;
        });
        sprite.on('pointerout', () => {
            sprite.scale = 0.8;
        });
    }
}
