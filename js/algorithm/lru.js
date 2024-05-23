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
         * @property {int} colI[j].textTrigger trigger text on the right-top
         * @property {boolean} colI[j].replacedPage show current page will be replaced on next step
         * @returns {Object.<string, Array<Object>>} table of lru
         ****************************************************/
        this.objData = {};

        this.currentCol = 0;
    }
    showObjectData(){
        for(const key in this.objData){
            console.log(key, this.objData[key]);
        }
    }
    traverse() {
        for (let i = 0; i < this.pages.length; i++) {
            this.setHoldLessPage(this.pages[i], i);
            this.replacePage(this.pages[i], i);
            if(this.iCurrentCapacity !== this.iMaxFrames)
                this.iCurrentCapacity++;
        }
    }

    /****************************************************
     * @description when capacity of frames isn't full
     * @param {int} iPageItem one item in page array
     * @param {int} iIndexPageItem order of page item in pages
     ****************************************************/
    setHoldLessPage(iPageItem, iIndexPageItem) {
        if (this.iCurrentCapacity < this.iMaxFrames) {
            if (!this.frames.has(iPageItem)) {
                this.frames.add(iPageItem);
                this.pageFault++;
            }
            if (this.currentCol === 0)
                this.objData[`col${this.currentCol}`] = [];
            else
                this.objData[`col${this.currentCol}`] =
                    [...this.objData[`col${this.currentCol - 1}`]];
            this.objData[`col${this.currentCol}`].push({
                textVal: iPageItem,
                textTrigger: 0,
                replacedPage: false,
            });
            this.currentCol++;
            this.order.set(iPageItem, iIndexPageItem);
        }
    }

    /****************************************************
     * @description when capcity of frames is full
     * @param {int} iPageItem one item in page array
     * @param {int} iIndexPageItem order of page item in pages
     ****************************************************/
    replacePage(iPageItem, iIndexPageItem) {
        const replaceWithValue = (arr, value, replace) => {
            for (let i = 0; i < this.iMaxFrames; i++)
                if (arr[i].textVal === value) arr[i] = replace;
        };
        

        const setReplacedPageFalse = (arrItemObj) => {
            for(let i = 0; i < this.iMaxFrames; i++){
                arrItemObj[i].replacedPage = false;
            }
        }
        if (this.iCurrentCapacity === this.iMaxFrames) {
            this.objData[`col${this.currentCol}`] =
                [...this.objData[`col${this.currentCol - 1}`]];
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
                //setReplacedPageFalse([...this.objData[`col${this.currentCol}`]])
                const replaceItem = {
                    textVal: iPageItem,
                    textTrigger: 1,
                    replacedPage: true,
                };

                console.log(replaceItem);
                replaceWithValue(
                    this.objData[`col${this.currentCol}`],
                    iLeastUsedPage,
                    replaceItem
                );

                this.pageFault++;
                this.frames.delete(iLeastUsedPage);
                this.order.delete(iLeastUsedPage);

                this.frames.add(iPageItem);
            }
            this.order.set(iPageItem, iIndexPageItem);


            this.currentCol++;
        }
    }
}

//Test
let pages = [2, 9, 6, 8, 2, 4, 3, 7, 5, 3, 9];
let capacity = 3;
let lru = new PageFaultLRU(pages, capacity);
lru.traverse();
console.log(lru.showObjectData());
