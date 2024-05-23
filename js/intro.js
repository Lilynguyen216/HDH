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


    }

    traverse() {
        this.setHoldLessPage(this.pages[i], i);
        this.replacePage(this.pages[i], i)
    }

    /****************************************************
     * @description when capacity of frames isn't full
     * @param {int} iPageItem one item in page array
     * @param {int} iIndexPageItem order of page item in pages
     ****************************************************/
    setHoldLessPage(iPageItem, iIndexPageItem) {
        if (this.frames.size < this.iMaxFrames) {
            if (!this.frames.has(iPageItem)) {
                this.frames.add(iPageItem);
                this.pageFault++;
            }

            this.order.set(iPageItem, iIndexPageItem);
        }
    }

    /****************************************************
     * @description when capcity of frames is full
     * @param {int} iPageItem one item in page array
     * @param {int} iIndexPageItem order of page item in pages
     ****************************************************/
    replacePage(iPageItem, iIndexPageItem) {
        if (this.frames.size === this.iMaxFrames) {
            if (!this.frames.has(iPageItem)) {
                let iLeastUsedPage = Number.MAX_VALUE,
                    iMinOrder = Number.MAX_VALUE;

                // Find the least recently used pages
                // that is present in the set
                for (let itr of this.frames.values()) 
                    if (this.order.get(itr) < iMinOrder){
                        iMinOrder = this.order.get(itr);
                        iLeastUsedPage = itr;
                    }

                this.pageFault++;
                this.frames.delete(iLeastUsedPage);
                this.order.delete(iLeastUsedPage);
                
                this.frames.add(iPageItem);
            }
            this.order.set(iPageItem, iIndexPageItem);
        }
    }
}
class intro extends Binh {

	constructor(){
		super('introScene');
	}
    preload(){
    }
	create(){
        const lru = new PageFaultLRU();
        let posX = 100, posY = 100;

        const iQuantityCol = 6;
        const iQuantityRow = 5;

        const WIDTH = 50;
        const posRowArr = {};
        const posColArr = {};
        for(let iRow = 0; iRow < iQuantityRow; iRow++){
            posRowArr[`row${iRow}`] = [];
            posColArr[`col${iRow}`] = [];
            for(let iCol = 0; iCol < iQuantityCol; iCol++){
                posRowArr[`row${iRow}`].push({
                    "posX" : posX,
                    "posY": posY,
                })


                if(iCol === 0){
                    posColArr[`col${iRow}`].push({
                        "posX" : posX,
                        "posY": posY,
                    })
                }
                this.add.rectangle(posX, posY, WIDTH, WIDTH, '#f00000');
                posX += 100;
            }
            posX = 100;
            posY += 100;
        }
        const process = {
            "process0": 2,
            "process1": 9,
            "process2": 6,
            "process3": 8,
            "process4": 2,
            "process5": 4,
        }
        for(let i = 0; i < iQuantityCol; i++){
            this.add.text(posRowArr.row0[i].posX, posRowArr.row0[i].posY, process[`process${i}`]);
        }
    
        



    }
	
}
