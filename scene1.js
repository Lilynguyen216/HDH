class scene1 extends Phaser.Scene {
    constructor() {
        super("scene1");
    }
    parent;
    preload() {
		this.load.image('background', './assets/996.jpg');
        this.load.html('InputForm_Scene1', './InputForm_Scene1.html');
    }

    create() {
        
        const self = this; // Lưu tham chiếu của scene1
		this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(window.innerWidth, window.innerHeight);
		
        const element = this.add.dom(700, 300).createFromCache('InputForm_Scene1');
		
        // Create a new Html doom object
        element.addListener('click');//Doom normal
        element.on('click', function (event) {

            if (event.target.name === 'playButton') {
                const inputProcess = this.getChildByName('processRange');
                const inputFrame = this.getChildByName('frameNumber');

                if (inputProcess.value !== '' && inputFrame.value !== '') {
                    // binding frame number input
                    if (inputFrame.value > 8) {
                        document.getElementById("error-message").textContent = "Please enter the smaller number or equal to 8 !!!";

                    }

                    else {
                        //storage input values
                        const frameNumber = inputFrame.value;

                        const parts = inputProcess.value.split(/[,\s]+/);
                        const processArray = [];
                        parts.forEach(part => {
                            const number = parseInt(part);
                            if (!isNaN(number)) {
                                processArray.push(number);
                            }

                        });
                        // Lưu các gtri vào data của scene
                        this.scene.scene.get('scene1').data.set("frameNumber", frameNumber);

                        this.scene.scene.get('scene1').data.set("processArray", processArray);

                        self.scene.start('scene2');
                    }

                }
                else{
                    document.getElementById("error-message").textContent = "Please enter full information !!!";//dispaly notification
                }
                
            }
            
        });

    }
    update() {

    }
}