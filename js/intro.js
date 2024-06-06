class introScene extends Phaser.Scene {
    constructor() {
        super("introScene");
    }
    parent;
    preload() {
        this.load.html('InputForm_Scene1', '../assets/InputForm_Scene1.html');
    }

    create() {
        
        const self = this; // Lưu tham chiếu của scene1
        const element = this.add.dom(700, 300).createFromCache('InputForm_Scene1');
        
        // Create a new Html doom object
        element.addListener('click');//Doom normal
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
                        document.getElementById("error-message").textContent = "Please enter the smaller number or equal to 8 !!!";

                    }
                    else if(!regexMatchFramesInput.test(inputProcess.value)){
                        alert("Please enter the correct format of process !!!")
                    }
                    else {
                        //storage input values
                        const frameNumber = inputFrame.value;

                        //(\d+, )+\d+
                        const parts = inputProcess.value.split(/[,\s]+/);
                        const processArray = [];
                        parts.forEach(part => {
                            const number = parseInt(part);
                            if (!isNaN(number)) {
                                processArray.push(number);
                            }

                        });
                        // Lưu các gtri vào data của scene
                        this.scene.scene.get('introScene').data.set("frameNumber", frameNumber);

                        this.scene.scene.get('introScene').data.set("processArray", processArray);
                        switch(selectedAlgorithm){
                            case 'fifo':
                                self.scene.start('fifoScene');
                                break;
                            case 'lru':
                                self.scene.start('lruScene');
                                break;
                        }
                    }

                }
                else{
                    document.getElementById("error-message").textContent = "Please enter full information !!!";//dispaly notification
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
    update() {

    }
}
