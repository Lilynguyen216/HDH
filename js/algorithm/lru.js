// source: https://www.geeksforgeeks.org/program-for-least-recently-used-lru-page-replacement-algorithm/?ref=lbp
// JavaScript implementation of above algorithm

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
         * @property {int} colI[0].textTrigger trigger text on the right-top
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
            console.log(i);
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

//Test
//let pages = [1, 2, 3, 4];
//let capacity = 2;
//let lru = new PageFaultLRU(pages, capacity);
//lru.traverse();
//console.log(lru.showObjectData());
//
//class PageFaultLRU {
//    /****************************************************
//     * @param {Array} pages
//     * @param {int} iMaxFrames
//     ****************************************************/
//    constructor(pages, iMaxFrames) {
//        // To represent set of current pages. We use
//        // an unordered_set so that we quickly check
//        // if a page is present in set or not
//        this.frames = new Set();
//        this.pages = pages;
//
//        // To store least recently used indexes
//        // of pages.
//        // {iPageItem: indexOfPage(order)}
//        this.order = new Map();
//
//        this.pageFault = 0;
//
//        this.iMaxFrames = iMaxFrames;
//        this.iCurrentCapacity = 0;
//        /****************************************************
//         * @description get the table of lru {'colI': [{'textVal': number, 'textTrigger': number, 'replacedPage': boolean}]}
//         * @property {int} colI[j].textVal show value page
//         * @property {int} colI[j].textTrigger trigger text on the right-top
//         * @property {boolean} colI[j].replacedPage show current page will be replaced on next step
//         * @returns {Object.<string, Array<Object>>} table of lru
//         ****************************************************/
//        this.objData = {};
//
//        this.currentCol = 0;
//
//        //used for if else
//        this.bIsElse = false;
//    }
//    showObjectData() {
//        for (const key in this.objData) {
//            console.log(key, this.objData[key]);
//        }
//    }
//    traverse() {
//        for (let i = 0; i < this.pages.length; i++) {
//            this.setHoldLessPage(this.pages[i], i);
//            this.replacePage(this.pages[i], i);
//            if (this.currentCol < this.pages.length) this.currentCol++;
//        }
//    }
//
//    /****************************************************
//     * @description when capacity of frames isn't full
//     * @param {int} iPageItem one item in page array
//     * @param {int} iIndexPageItem order of page item in pages
//     ****************************************************/
//    setHoldLessPage(iPageItem, iIndexPageItem) {
//        this.bIsElse = true;
//        const setReplacedPageFalse = (arrItemObj) => {
//            for (let i = 0; i < arrItemObj.length; i++) {
//                arrItemObj[i].replacedPage = false;
//            }
//        };
//        if (this.frames.size < this.iMaxFrames) {
//            this.bIsElse = false;
//            if (this.currentCol === 0)
//                this.objData[`col${this.currentCol}`] = [];
//            else
//                this.objData[`col${this.currentCol}`] = JSON.parse(
//                    JSON.stringify(this.objData[`col${this.currentCol - 1}`]),
//                );
//            setReplacedPageFalse(this.objData[`col${this.currentCol}`]);
//            if (!this.frames.has(iPageItem)) {
//                this.frames.add(iPageItem);
//                this.pageFault++;
//                this.objData[`col${this.currentCol}`].push({
//                    textVal: iPageItem,
//                    replacedPage: true,
//                });
//                this.objData[`col${this.currentCol}`][0].textTrigger = 0;
//            } else {
//                this.objData[`col${this.currentCol}`][0].textTrigger = 2;
//            }
//
//            // if (this.currentCol === 0)
//            //     this.objData[`col${this.currentCol}`] = [];
//            // else
//            //     this.objData[`col${this.currentCol}`] = [
//            //         ...this.objData[`col${this.currentCol - 1}`],
//            //     ];
//            //console.log(this.objData[`col${this.currentCol}`]);
//            this.order.set(iPageItem, iIndexPageItem);
//            //only this has text{0, 2}
//        }
//    }
//
//    /****************************************************
//     * @description when capcity of frames is full
//     * @param {int} iPageItem one item in page array
//     * @param {int} iIndexPageItem order of page item in pages
//     ****************************************************/
//    replacePage(iPageItem, iIndexPageItem) {
//        const replaceWithValue = (arr, value, replace) => {
//            for (let i = 0; i < arr.length; i++)
//                if (arr[i].textVal === value) arr[i] = replace;
//        };
//
//        const setReplacedPageFalse = (arrItemObj) => {
//            for (let i = 0; i < arrItemObj.length; i++) {
//                arrItemObj[i].replacedPage = false;
//            }
//        };
//        if (this.frames.size === this.iMaxFrames && this.bIsElse) {
//            //NOTE
//            this.objData[`col${this.currentCol}`] = JSON.parse(
//                JSON.stringify(this.objData[`col${this.currentCol - 1}`]),
//            );
//
//            setReplacedPageFalse(this.objData[`col${this.currentCol}`]);
//            if (!this.frames.has(iPageItem)) {
//                let iLeastUsedPage = Number.MAX_VALUE,
//                    iMinOrder = Number.MAX_VALUE;
//
//                // Find the least recently used pages
//                // that is present in the set
//                for (let itr of this.frames.values())
//                    if (this.order.get(itr) < iMinOrder) {
//                        iMinOrder = this.order.get(itr);
//                        iLeastUsedPage = itr;
//                    }
//
//                //BUG
//                const replaceItem = {
//                    textVal: iPageItem,
//                    replacedPage: true,
//                };
//
//                replaceWithValue(
//                    this.objData[`col${this.currentCol}`],
//                    iLeastUsedPage,
//                    replaceItem,
//                );
//
//                this.pageFault++;
//                this.frames.delete(iLeastUsedPage);
//                this.order.delete(iLeastUsedPage);
//
//                this.frames.add(iPageItem);
//                this.objData[`col${this.currentCol}`][0].textTrigger = 1;
//            } else {
//                this.objData[`col${this.currentCol}`][0].textTrigger = 2;
//            }
//            this.order.set(iPageItem, iIndexPageItem);
//
//            //this.currentCol++;
//        }
//    }
//    /****************************************************
//     * @description get quantity of solution we make
//     * @returns {Number} quantity of solution in lru table
//     ****************************************************/
//    getQuantityItemArr() {
//        let iResult = 0;
//        for (const key in this.objData)
//            for (let iIndex = 0; iIndex < this.objData[key].length; iIndex++)
//                iResult++;
//        return iResult;
//    }
//}
//
