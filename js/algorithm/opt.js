class PageFaultOptimal {
    constructor(pages, numFrames) {
        this.fr = [];
        this.pages = pages;
        this.pageFault = 0;
        this.numFrames = numFrames;
        this.frames = [];
        this._count = 0;
        this.objData = {};
    }

    search(key, fr) {
        for (let i = 0; i < fr.length; i++) {
            if (fr[i] === key) {
                return true;
            }
        }
        return false;
    }

    predict(pages, fr, pageNum, index) {
        let res = -1, farthest = index;
        for (let i = 0; i < fr.length; i++) {
            let j;
            for (j = index; j < pageNum; j++) {
                if (fr[i] === pages[j]) {
                    if (j > farthest) {
                        farthest = j;
                        res = i;
                    }
                    break;
                }
            }
            if (j === pageNum) return i;
        }
        return (res === -1) ? 0 : res;
    }

    optimalPageReplacement() {
        const pages = this.pages;
        const numFrames = this.numFrames;
        const pageNum = pages.length;

        this.frames = Array.from({ length: numFrames }, () => Array(pageNum).fill(-1));
        let fr = [];

        const setReplacedPageFalse = (arrItemObj) => {
            for (let i = 0; i < arrItemObj.length; i++) {
                arrItemObj[i].replacedPage = false;
            }
        };

        const replaceWithValue = (arr, value, replace) => {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].textVal === value) arr[i] = replace;
            }
        };

        for (let i = 0; i < pageNum; i++) {
            if (i === 0) {
                this.objData[`col${i}`] = [];
            } else {
                this.objData[`col${i}`] = JSON.parse(
                    JSON.stringify(this.objData[`col${i - 1}`])
                );
            }
            setReplacedPageFalse(this.objData[`col${i}`]);

            if (this.search(pages[i], fr)) {
                for (let j = 0; j < numFrames; j++) {
                    this.frames[j][i] = fr[j] !== undefined ? fr[j] : -1;
                }
                if (this.objData[`col${i}`].length > 0) {
                    this.objData[`col${i}`][0].textTrigger = 2;
                }
                continue;
            }

            if (fr.length < numFrames) {
                fr.push(pages[i]);
                this.objData[`col${i}`].push({
                    textVal: pages[i],
                    replacedPage: true,
                });
                if (this.objData[`col${i}`].length > 0) {
                    this.objData[`col${i}`][0].textTrigger = 0;
                }
            } else {
                let j = this.predict(pages, fr, pageNum, i + 1);
                const replacedPage = fr[j];
                fr[j] = pages[i];
                this.pageFault++;

                const replaceItem = {
                    textVal: pages[i],
                    replacedPage: true,
                };

                replaceWithValue(this.objData[`col${i}`], replacedPage, replaceItem);

                if (this.objData[`col${i}`].length > 0) {
                    this.objData[`col${i}`][0].textTrigger = 1;
                }
            }

            this.pageFault++;
            for (let j = 0; j < numFrames; j++) {
                this.frames[j][i] = (j < fr.length) ? fr[j] : -1;
            }
        }

        return this.frames;
    }

    getQuantityItemArr() {
        let iResult = 0;
        for (const key in this.objData)
            for (let iIndex = 0; iIndex < this.objData[key].length; iIndex++)
                iResult++;
        return iResult;
    }

    getPageFaultCount() {
        return this.pageFault;
    }
}