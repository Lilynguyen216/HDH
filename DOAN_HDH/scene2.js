class scene2 extends Phaser.Scene {
    constructor() {
        super('scene2');
    }

    init() {
        this.arrSolution = [];
        this.iCurrentSolution = 0;
        this.opt;
        this.bIsPlaying = false;
        this.arrTXT = [];
    }

    create() {
        const processArray = this.scene.get('scene1').data.get("processArray");
        const frameNumber = this.scene.get('scene1').data.get("frameNumber");

        let posX = 50, posY = 60;
        const iQuantityCol = processArray.length;
        const iQuantityRow = frameNumber;
        const WIDTH = 50;
        const posRowArr = {};
        const posColArr = {};

        for (let iRow = 0; iRow <= iQuantityRow; iRow++) {
            posRowArr[`row${iRow}`] = [];
            for (let iCol = 0; iCol < iQuantityCol; iCol++) {
                if (iRow === 0) {
                    posColArr[`col${iCol}`] = [];
                }
                posRowArr[`row${iRow}`].push({
                    "posX": posX,
                    "posY": posY,
                });

                if (iRow >= 1) {
                    posColArr[`col${iCol}`].push({
                        "posX": posX,
                        "posY": posY,
                    });
                }
                this.add.rectangle(posX, posY, WIDTH, WIDTH, '#f00000');
                posX += 60;
            }
            posX = 50;
            posY += 60;
        }

        const process = {};
        for (let i = 0; i < iQuantityCol; i++) {
            process[`process${i}`] = processArray[i];
            this.add.text(posRowArr.row0[i].posX, posRowArr.row0[i].posY, process[`process${i}`]);
        }

        const pg = processArray;
        const pn = pg.length;
        const fn = frameNumber;
        const newOpt = new PageFaultOptimal(pg, fn);
        const frames = newOpt.optimalPageReplacement(pg, pn, fn);
        
        //console.log(frames);
        
        for (let iRow = 0; iRow < fn; iRow++) {
            for (let iCol = 0; iCol < pn; iCol++) {
                
                if (posColArr[`col${iCol}`] && posColArr[`col${iCol}`][iRow] && frames[iRow][iCol] !== -1) {
                    const textValue = frames[iRow][iCol];
                    const posX = posColArr[`col${iCol}`][iRow].posX;
                    const posY = posColArr[`col${iCol}`][iRow].posY;
                    
                    this.add.text(posX, posY, textValue);
                }
            }
        }

    }

    update() { }
}