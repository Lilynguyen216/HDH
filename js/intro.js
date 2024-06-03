class PageFaultLRU {
    /****************************************************
     * @param {Array} pages
     * @param {int} iMaxFrames
     ****************************************************/
    constructor(pages, iMaxFrames) {
        // To represent set of current pages. We use
        // an unordered_set so that we quickly check
        // if a page is present in set or not
        this.frames = new Set();
        this.pages = pages;

        // To store least recently used indexes
        // of pages.
        // {iPageItem: indexOfPage(order)}
        this.order = new Map();

        this.pageFault = 0;

        this.iMaxFrames = iMaxFrames;
        this.iCurrentCapacity = 0;
        /****************************************************
         * @description get the table of lru {'colI': [{'textVal': number, 'textTrigger': number, 'replacedPage': boolean}]}
         * @property {int} colI[j].textVal show value page
         * @property {int} colI[j].textTrigger trigger text on the right-top
         * @property {boolean} colI[j].replacedPage show current page will be replaced on next step
         * @returns {Object.<string, Array<Object>>} table of lru
         ****************************************************/
        this.objData = {};

        this.currentCol = 0;

        //used for if else
        this.bIsElse = false;
    }
    showObjectData() {
        for (const key in this.objData) {
            console.log(key, this.objData[key]);
        }
    }
    traverse() {
        for (let i = 0; i < this.pages.length; i++) {
            this.setHoldLessPage(this.pages[i], i);
            this.replacePage(this.pages[i], i);
            if (this.currentCol < this.pages.length) this.currentCol++;
        }
    }

    /****************************************************
     * @description when capacity of frames isn't full
     * @param {int} iPageItem one item in page array
     * @param {int} iIndexPageItem order of page item in pages
     ****************************************************/
    setHoldLessPage(iPageItem, iIndexPageItem) {
        this.bIsElse = true;
        const setReplacedPageFalse = (arrItemObj) => {
            for (let i = 0; i < arrItemObj.length; i++) {
                arrItemObj[i].replacedPage = false;
            }
        };
        if (this.frames.size < this.iMaxFrames) {
            this.bIsElse = false;
            if (this.currentCol === 0)
                this.objData[`col${this.currentCol}`] = [];
            else
                this.objData[`col${this.currentCol}`] = JSON.parse(
                    JSON.stringify(this.objData[`col${this.currentCol - 1}`]),
                );
            setReplacedPageFalse(this.objData[`col${this.currentCol}`]);
            if (!this.frames.has(iPageItem)) {
                this.frames.add(iPageItem);
                this.pageFault++;
                this.objData[`col${this.currentCol}`].push({
                    textVal: iPageItem,
                    replacedPage: true,
                });
                this.objData[`col${this.currentCol}`][0].textTrigger = 0;
            } else {
                this.objData[`col${this.currentCol}`][0].textTrigger = 2;
            }

            // if (this.currentCol === 0)
            //     this.objData[`col${this.currentCol}`] = [];
            // else
            //     this.objData[`col${this.currentCol}`] = [
            //         ...this.objData[`col${this.currentCol - 1}`],
            //     ];
            //console.log(this.objData[`col${this.currentCol}`]);
            this.order.set(iPageItem, iIndexPageItem);
            //only this has text{0, 2}
        }
    }

    /****************************************************
     * @description when capcity of frames is full
     * @param {int} iPageItem one item in page array
     * @param {int} iIndexPageItem order of page item in pages
     ****************************************************/
    replacePage(iPageItem, iIndexPageItem) {
        const replaceWithValue = (arr, value, replace) => {
            for (let i = 0; i < arr.length; i++)
                if (arr[i].textVal === value) arr[i] = replace;
        };

        const setReplacedPageFalse = (arrItemObj) => {
            for (let i = 0; i < arrItemObj.length; i++) {
                arrItemObj[i].replacedPage = false;
            }
        };
        if (this.frames.size === this.iMaxFrames && this.bIsElse) {
            //NOTE
            this.objData[`col${this.currentCol}`] = JSON.parse(
                JSON.stringify(this.objData[`col${this.currentCol - 1}`]),
            );

            setReplacedPageFalse(this.objData[`col${this.currentCol}`]);
            if (!this.frames.has(iPageItem)) {
                let iLeastUsedPage = Number.MAX_VALUE,
                    iMinOrder = Number.MAX_VALUE;

                // Find the least recently used pages
                // that is present in the set
                for (let itr of this.frames.values())
                    if (this.order.get(itr) < iMinOrder) {
                        iMinOrder = this.order.get(itr);
                        iLeastUsedPage = itr;
                    }

                //BUG
                const replaceItem = {
                    textVal: iPageItem,
                    replacedPage: true,
                };

                replaceWithValue(
                    this.objData[`col${this.currentCol}`],
                    iLeastUsedPage,
                    replaceItem,
                );

                this.pageFault++;
                this.frames.delete(iLeastUsedPage);
                this.order.delete(iLeastUsedPage);

                this.frames.add(iPageItem);
                this.objData[`col${this.currentCol}`][0].textTrigger = 1;
            } else {
                this.objData[`col${this.currentCol}`][0].textTrigger = 2;
            }
            this.order.set(iPageItem, iIndexPageItem);

            //this.currentCol++;
        }
    }
    /****************************************************
     * @description get quantity of solution we make
     * @returns {Number} quantity of solution in lru table
     ****************************************************/
    getQuantityItemArr() {
        let iResult = 0;
        for (const key in this.objData)
            for (let iIndex = 0; iIndex < this.objData[key].length; iIndex++)
                iResult++;
        return iResult;
    }
}
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
class intro extends Phaser.Scene {
    constructor() {
        super('introScene');
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
        this.quantityFrames = 3;
        let pages = [2, 9, 6, 8, 2, 4];
        this.pages = pages;
        const lru = new PageFaultLRU(pages, this.quantityFrames);
        this.lru = lru;
        lru.traverse();
        //**********************************************Create Grid**********************************************
        let posX = 100,
            posY = 100;

        const iQuantityCol = 6;
        const iQuantityRow = 5;
        const WIDTH = 50;
        const posRowArr = {};
        //only save
        const posColArr = {};
        for (let iRow = 0; iRow < iQuantityRow; iRow++) {
            posRowArr[`row${iRow}`] = [];
            for (let iCol = 0; iCol < iQuantityCol; iCol++) {
                if (iRow === 1) posColArr[`col${iCol}`] = [];
                const columnArray = (iColVal) => {
                    if (iCol === iColVal && iRow !== 0) {
                        posColArr[`col${iCol}`].push({
                            posX: posX,
                            posY: posY,
                        });
                    }
                };
                posRowArr[`row${iRow}`].push({
                    posX: posX,
                    posY: posY,
                });

                for (let i = 0; i < pages.length; i++) columnArray(i);

                this.add.rectangle(posX, posY, WIDTH, WIDTH, '#f00000');
                posX += 100;
            }
            posX = 100;
            posY += 100;
        }
        const process = {
            process0: 2,
            process1: 9,
            process2: 6,
            process3: 8,
            process4: 2,
            process5: 4,
        };
        for (let i = 0; i < iQuantityCol; i++) {
            this.add.text(
                posRowArr.row0[i].posX,
                posRowArr.row0[i].posY,
                process[`process${i}`],
            );
        }
        //**********************************************Make text value invisible**********************************************
        //Add to solution array
        for (let iCol = 0; iCol < pages.length; iCol++)
            for (
                let iItemIndex = 0;
                iItemIndex < this.quantityFrames;
                iItemIndex++
            ) {
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
