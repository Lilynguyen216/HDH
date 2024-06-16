const POSX = 100;
const POSY = 100;
const GAPX_EACH_RECT = 60;
const GAPY_EACH_RECT = 70;
const GAME_WIDTH = window.innerWidth;
const GAME_HEIGHT = window.innerHeight;
const POSX_FORWARD = 1050;
const POSY_FORWARD = 100;
const POSX_BACKWARD = 800;
const POSY_BACKWARD = 100;
const POSX_PLAY_STOP = 930;
const POSY_PLAY_STOP = 100;
const POSX_HOME = GAME_WIDTH - 100;
const POSY_HOME = 50;
const POSX_TRIGGERED_TEXT = 800; 
const POSY_TRIGGERED_TEXT = 360; 
class introScene extends Phaser.Scene {
    constructor() {
        super('introScene');
    }
    parent;
    preload() {
        this.load.html('InputForm_Scene1', '/assets/InputForm_Scene1.html');
        this.load.image('light_galaxy', '/assets/light_galaxy.jpg');
        this.load.image('light_galaxy1', '/assets/light_galaxy1.png');
        this.load.image('night_galaxy', '/assets/night_galaxy.jpg');
        this.load.image('blue_area1', '/assets/blue_area1.png');
        this.load.image('forwardBtn', '/assets/forwardBtn.png');
        this.load.image('backwardBtn', '/assets/backwardBtn.png');
        this.load.image('homeBtn', '/assets/homeBtn.png');
        this.load.image('playBtn', '/assets/playBtn.png');
        this.load.image('stopBtn', '/assets/stopBtn.png');
        this.load.image('replacedPageTxt', '/assets/replacedPageTxt.png');
        this.load.image('normalPageTxt', '/assets/normalPageTxt.png');
        this.load.image('totalPageFaultsTxt', '/assets/totalPageFaultsTxt.png');
    }

    create() {
        this.add
            .image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'night_galaxy')
            .setScale(0.2);
        const self = this; // Lưu tham chiếu của scene1
        const element = this.add
            .dom(GAME_WIDTH / 2 + 100, GAME_HEIGHT / 2)
            .createFromCache('InputForm_Scene1');

        // Create a new Html doom object
        element.addListener('click'); //Doom normal
        element.on('click', function (event) {
            if (event.target.name === 'playButton') {
                const inputProcess = this.getChildByName('processRange');
                const inputFrame = this.getChildByName('frameNumber');
                const comboboxAlgorithms = this.getChildByName('algorithms');
                //how to get the value of select tag
                const regexMatchFramesInput = /^(\d+, )+\d+$/;
                const selectedAlgorithm = comboboxAlgorithms.value;
                if (inputProcess.value !== '' && inputFrame.value !== '') {
                    // binding frame number input
                    if (inputFrame.value > 8) {
                        document.getElementById('error-message').textContent =
                            'Please enter smaller number or equal to 8  in frames!!!';
                    } else if (
                        !regexMatchFramesInput.test(inputProcess.value)
                    ) {
                        alert('Please enter the correct format of pages !!!');
                    } else {
                        //storage input values
                        const frameNumber = inputFrame.value;

                        const parts = inputProcess.value.split(/[,\s]+/);
                        const processArray = [];
                        parts.forEach((part) => {
                            const number = parseInt(part);
                            if (!isNaN(number)) {
                                processArray.push(number);
                            }
                        });
                        // Lưu các gtri vào data của scene
                        const maxReferencedPages = 9;

                        console.log(processArray.length)
                        if(processArray.length <= maxReferencedPages){
                            console.log(1)
                            this.scene.scene
                                .get('introScene')
                                .data.set('frameNumber', frameNumber);

                            this.scene.scene
                                .get('introScene')
                                .data.set('processArray', processArray);
                            console.log(selectedAlgorithm);
                            switch (selectedAlgorithm) {
                                case 'fifo':
                                    self.scene.start('fifoScene');
                                    break;
                                case 'lru':
                                    self.scene.start('lruScene');
                                    break;
                                case 'optimal':
                                    self.scene.start('optScene');
                                    break;
                                case 'clock':
                                    self.scene.start('clockScene');
                                    break;
                            }
                        }
                        else{

                    document.getElementById('error-message').textContent =
                        'You can only include up to 9 page references'; //dispaly notification
                        }
                    }
                } else {
                    document.getElementById('error-message').textContent =
                        'Please enter full information !!!'; //dispaly notification
                }
            }
        });
        /** 
         
        this.tweens.add({
            targets: element,
            y: 300,
            duration: 3000,
            ease: 'Power3'//glide to x,y new
        });
         */
    }
    update() {}
}
