//*****************************Color for slider*****************************
const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0xffffff;
const COLOR_DARK = 0x96c6ed;
//*****************************Color for txt*****************************
const COLOR_TXT_LIGHT = '#ffffff';
const COLOR_TXT_DARK = '#000000';
const COLOR_TXT_REPLACED_PAGE = '#FF0000';

//*****************************txt for pseudo code*****************************
const TXT_ALWAYS = "For each 'page' in 'pages':";
const TXT_CONDITION_NOT_CPAGE = `   If 'frames' does not contain 'page':`;
const TXT_INCRE_PAGEFAULT = `       Increment 'pageFaults''`;
const TXT_FULL = `      If 'frames' is full:\n
            Remove the least recently used page from 'frames'`;
const TXT_ADD_PAGE = `      Add 'page' to 'frames'`;
const TXT_CONDITION_CPAGE = `   Else:\n 
        Do nothing`;
//**************************************index start at 0**************************************
class lruScene extends Phaser.Scene {
    constructor() {
        super('lruScene');
    }
    preload() {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI',
        });
    }

    slider() {
        const objSliderConfig = {
            x: 1000,
            y: 200,
            width: 500,
            height: 10,
            orientation: 'x',
            track: this.rexUI.add.roundRectangle(0, 0, 0, 0, 2, COLOR_DARK),
            thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_LIGHT),
            input: 'click',
        };

        this.slider = this.rexUI.add.slider(objSliderConfig).layout();
        this.slider.on('pointerdown', () => {
            if (this.bIsPlaying === true) this.bIsPlaying = false;
            //when slider is clicked, bIsPlaying switch to false to prevent code block in update function

            //Round down, when clicking, the value of slider between 0 and lru.getQuantityItemArr() - 1
            const valueCurrentSolution = Math.floor(
                this.slider.getValue(0, this.lru.getQuantityItemArr() - 1),
            );
            //set visible true for all object from 0 to valueCurrentSolution
            for (let i = 0; i <= valueCurrentSolution; i++) {
                //console.log('visible', i);
                this.arrSolution[i]['textObj'].setVisible(true);
            }
            //on the other hand, the others will be invisible
            for (
                let i = valueCurrentSolution + 1;
                i < this.lru.getQuantityItemArr();
                i++
            ) {
                //console.log('not visible', i);
                this.arrSolution[i]['textObj'].setVisible(false);
            }
            //console.log(valueCurrentSolution);
            this.iCurrentSolution = valueCurrentSolution;
            console.log(this.iCurrentSolution);
            this.triggerText();
        });
    }
    showOneItemSolution() {
        this.arrSolution[this.iCurrentSolution]['textObj'].setVisible(true);
        this.triggerText();
    }
    hideOneItemSolution() {
        this.arrSolution[this.iCurrentSolution]['textObj'].setVisible(false);
        this.triggerText();
    }

    showTextTrigger() {
        const arrTXT = [
            TXT_ALWAYS,
            TXT_CONDITION_NOT_CPAGE,
            TXT_INCRE_PAGEFAULT,
            TXT_FULL,
            TXT_ADD_PAGE,
            TXT_CONDITION_CPAGE,
        ];
        let iPosY = 400;
        const iPosX = 800;
        const iDiff = 25;
        for (let i = 0; i < arrTXT.length; i++) {
            let colorVal = i === 0 ? COLOR_TXT_LIGHT : COLOR_TXT_DARK;
            this.arrTXT.push(
                this.add.text(iPosX, iPosY, arrTXT[i], { color: colorVal }),
            );
            if (i === 3) iPosY += 50;
            else iPosY += iDiff;
        }
    }

    /****************************************************
     * @returns {object} return object trigger text
     ****************************************************/
    triggerText() {
        //reset color of all text trigger except 0
        for (let iIndex = 1; iIndex < this.arrTXT.length; iIndex++)
            this.arrTXT[iIndex].setColor(COLOR_TXT_DARK);
        //transform to index of array in this.arrTXT
        const objTransform = {
            txtNotContainPage: 1,
            txtIncrePageFault: 2,
            txtFull: 3,
            txtAddFrames: 4,
            txtContainPage: 5,
        };
        const obj = {
            0: [
                objTransform[`txtNotContainPage`],
                objTransform[`txtIncrePageFault`],
                objTransform[`txtAddFrames`],
            ],
            1: [
                objTransform[`txtNotContainPage`],
                objTransform[`txtIncrePageFault`],
                objTransform[`txtFull`],
                objTransform[`txtAddFrames`],
            ],
            2: [objTransform[`txtContainPage`]],
        };
        const posCol = this.arrSolution[this.iCurrentSolution]['posCol'];
        //console.log(posCol);
        //always 0 for index based on column
        const posIndex = 0;
        //array of text to trigger
        const iTriggerText = this.lru.objData[posCol][posIndex]['textTrigger'];

        for (
            let iIndex = 0;
            iIndex < obj[iTriggerText.toString()].length;
            iIndex++
        ) {
            this.arrTXT[obj[iTriggerText][iIndex]].setColor(COLOR_TXT_LIGHT);
        }
    }
    init() {
        // this.iCurrentColumn = 0;
        // this.iCurrentIndexItem = 0;
        // store all solution of pageReplacement
        this.arrSolution = [];
        //for order of current item solution show on screen
        //Note this order is based on item is not undefined
        this.iCurrentSolution = 0;

        this.lru;

        this.bIsPlaying = false;
        //for txt object pseduo code
        this.arrTXT = [];
        this.pages = [];
    }
    create() {
        console.log('lru')
        //**********************************************Var involve data of intro scene**********************************************
        const processArray = this.scene
            .get('introScene')
            .data.get('processArray');
        const frameNumber = this.scene
            .get('introScene')
            .data.get('frameNumber');
        //**********************************************Var involve algorithm**********************************************
        this.quantityFrames = parseInt(frameNumber);
        let pages = processArray;
        this.pages = processArray;
        const lru = new PageFaultLRU(this.pages, this.quantityFrames);
        this.lru = lru;
        this.lru.traverse();
        //**********************************************Create Grid**********************************************
        let posX = 100,
            posY = 100;

        const iQuantityCol = processArray.length;
        const iQuantityRow = frameNumber;
        const WIDTH = 50;
        const posRowArr = {};
        //only save
        const posColArr = {};
        for (let iRow = 0; iRow <= iQuantityRow; iRow++) {
            posRowArr[`row${iRow}`] = [];
            for (let iCol = 0; iCol < iQuantityCol; iCol++) {
                //if (iRow === 1) posColArr[`col${iCol}`] = [];
                //const columnArray = (iColVal) => {
                //    if (iCol === iColVal && iRow !== 0) {
                //        posColArr[`col${iCol}`].push({
                //            posX: posX,
                //            posY: posY,
                //        });
                //    }
                //};
                //for (let i = 0; i < pages.length; i++) columnArray(i);
                if (iRow == 0) posColArr[`col${iCol}`] = [];
                posRowArr[`row${iRow}`].push({
                    posX: posX,
                    posY: posY,
                });

                if (iRow >= 1) {
                    posColArr[`col${iCol}`].push({
                        posX: posX,
                        posY: posY,
                    });
                }

                this.add.rectangle(posX, posY, WIDTH, WIDTH, '#f00000');
                posX += 100;
            }
            posX = 100;
            posY += 100;
        }
        const process = {};
        for (let i = 0; i < iQuantityCol; i++) {
            process[`process${i}`] = processArray[i];
            this.add.text(
                posRowArr.row0[i].posX,
                posRowArr.row0[i].posY,
                process[`process${i}`]
            );
        }
        //**********************************************Make text value invisible**********************************************
        //Add to solution array
        for (let iCol = 0; iCol < pages.length; iCol++)
            for (
                let iItemIndex = 0;
                iItemIndex < lru.objData[`col${iCol}`].length;
                iItemIndex++
            ) {
                //console.log(lru.objData[`col${iCol}`]);
                if (lru.objData[`col${iCol}`][iItemIndex] !== undefined)
                    this.arrSolution.push({
                        textObj: this.add
                            .text(
                                posColArr[`col${iCol}`][iItemIndex].posX,
                                posColArr[`col${iCol}`][iItemIndex].posY,
                                lru.objData[`col${iCol}`][iItemIndex].textVal,
                                {
                                    color:
                                        lru.objData[`col${iCol}`][iItemIndex]
                                            .replacedPage === true
                                            ? COLOR_TXT_REPLACED_PAGE
                                            : COLOR_TXT_LIGHT,
                                },
                            )
                            .setVisible(false),
                        posCol: `col${iCol}`,
                        posIndex: iItemIndex,
                    });
            }

        //**********************************************Button forward, backward, stop step**********************************************
        const btnForward = this.add
            .rectangle(1000, 100, WIDTH, WIDTH, '#f00000')
            .setInteractive({ useHandCursor: true });
        btnForward.on('pointerdown', () => {
            this.showOneItemSolution();
            if (this.bIsPlaying === true) this.bIsPlaying = false;
            if (this.iCurrentSolution < this.lru.getQuantityItemArr() - 1)
                this.iCurrentSolution++;
            this.slider.setValue(
                this.iCurrentSolution,
                0,
                this.lru.getQuantityItemArr() - 1,
            );
        });

        const btnBackward = this.add
            .rectangle(900, 100, WIDTH, WIDTH, '#f00000')
            .setInteractive({ useHandCursor: true });
        btnBackward.on('pointerdown', () => {
            this.hideOneItemSolution();
            if (this.bIsPlaying === true) this.bIsPlaying = false;
            if (this.iCurrentSolution > 0) this.iCurrentSolution--;
            this.slider.setValue(
                this.iCurrentSolution,
                0,
                this.lru.getQuantityItemArr() - 1,
            );
        });

        const btnPlayStop = this.add
            .rectangle(950, 100, WIDTH - 10, WIDTH - 10, '#f00000')
            .setInteractive({ useHandCursor: true });
        let txtPlayStop = this.add.text(925, 100, 'Stop');
        btnPlayStop.on('pointerdown', () => {
            this.bIsPlaying = !this.bIsPlaying;
            this.bIsPlaying === true
                ? txtPlayStop.setText('Play')
                : txtPlayStop.setText('Stop');
        });
        //**********************************************slider**********************************************
        this.slider();

        //**********************************************text trigger**********************************************
        this.showTextTrigger();
    }

    update(time, delta) {
        //get index of item when base on index arr
        //update slider and show item based on showed item
        if (this.bIsPlaying) {
            this.slider.setValue(
                this.iCurrentSolution,
                0,
                this.lru.getQuantityItemArr() - 1,
            );
            console.log(this.lru.getQuantityItemArr());
            //console.log(this.arrSolution[this.iCurrentSolution]['posIndex']);
            const iIndexItemOnCol =
                this.arrSolution[this.iCurrentSolution]['posIndex'];
            if (iIndexItemOnCol === 0) {
                this.triggerText();
            }
            this.showOneItemSolution();
            if (this.iCurrentSolution < this.lru.getQuantityItemArr() - 1)
                this.iCurrentSolution++;
        }
    }
}
