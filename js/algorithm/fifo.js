// source: https://www.geeksforgeeks.org/program-page-replacement-algorithms-set-2-fifo/
// JavaScript implementation of above algorithm

class PageFaultFIFO {
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

        //track order of page in frames working like queue
        this.order = [];
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
        

        this.bIsElse = true;
    }
    showObjectData() {
        for (const key in this.objData) {
            console.log(key, this.objData[key]);
        }
    }
    traverse() {
        //console.log(this.pages.length);
        for (let i = 0; i < this.pages.length; i++) {
            this.setHoldLessPage(this.pages[i], i);
            this.replacePage(this.pages[i], i);
            //if (this.iCurrentCapacity !== this.iMaxFrames)
            //    this.iCurrentCapacity++;
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
                this.order.push(iPageItem);
                this.objData[`col${this.currentCol}`].push({
                    textVal: iPageItem,
                    replacedPage: true,
                });
                this.objData[`col${this.currentCol}`][0].textTrigger = 0;
                // console.log(this.objData[`col${this.currentCol}`]);
            } else {
                this.objData[`col${this.currentCol}`][0].textTrigger = 2;
            }

            //if (this.currentCol === 0)
            //    this.objData[`col${this.currentCol}`] = [];
            //else
            //    this.objData[`col${this.currentCol}`] = [
            //        ...this.objData[`col${this.currentCol - 1}`],
            //    ];
            //this.objData[`col${this.currentCol}`].push({
            //    textVal: iPageItem,
            //    replacedPage: bIsReplacedPage,
            //});
            //console.log(this.objData[`col${this.currentCol}`]);
            //only this has text{0, 2}
            //this.currentCol++;
        }
    }

    /****************************************************
     * @description when capcity of frames is full
     * @param {int} iPageItem one item in page array
     * @param {int} iIndexPageItem order of page item in pages
     ****************************************************/
    replacePage(iPageItem, iIndexPageItem) {
        const setReplacedPageFalse = (arrItemObj) => {
            for (let i = 0; i < arrItemObj.length; i++) {
                arrItemObj[i].replacedPage = false;
            }
        };
        const replaceWithValue = (arr, value, replace) => {
            for (let i = 0; i < arr.length; i++)
                if (arr[i].textVal === value) arr[i] = replace;
        };
        if (this.frames.size === this.iMaxFrames && this.bIsElse) {
            //if (this.iCurrentCapacity === this.iMaxFrames) {
            this.objData[`col${this.currentCol}`] = JSON.parse(
                JSON.stringify(this.objData[`col${this.currentCol - 1}`]),
            );

            setReplacedPageFalse(this.objData[`col${this.currentCol}`]);
            if (!this.frames.has(iPageItem)) {
                let iValFirstItem = this.order[0];
                //console.log(iValFirstItem);

                this.order.shift();

                this.frames.delete(iValFirstItem);

                this.frames.add(iPageItem);
                this.order.push(iPageItem);
                this.pageFault++;
                const replaceItem = {
                    textVal: iPageItem,
                    replacedPage: true,
                };

                replaceWithValue(
                    this.objData[`col${this.currentCol}`],
                    iValFirstItem,
                    replaceItem,
                );

                this.objData[`col${this.currentCol}`][0].textTrigger = 1;
            } else {
                this.objData[`col${this.currentCol}`][0].textTrigger = 2;
            }

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

////Test
let pages = [2, 2, 6, 8, 2, 4];
let capacity = 3;
let fifo = new PageFaultFIFO(pages, capacity);
fifo.traverse();
console.log(fifo.objData);
