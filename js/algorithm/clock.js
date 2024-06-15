class ClockAlgorithm {
    constructor(pages, frameCount) {
        this.pages = pages;
        this.frameCount = frameCount;
        this.frames = Array(frameCount).fill(-1);
        this.secondChance = Array(frameCount).fill(-1);
        this.pointer = 0;
        this.framesGrid = this.createGrid(frameCount, pages.length);
        this.secondChancesGrid = this.createGrid(frameCount, pages.length);
        this.objData = {};
        this.scData = {};
        this.pageFault = 0;
    }

    createGrid(fc, pc) {
        let tempGrid = Array.from({ length: fc }, () => Array(pc).fill(-1));
        return tempGrid;
    }

    isInFrame(page) {
        return this.frames.includes(page);
    }

    findReplacementIndex() {
        while (true) {
            let checkEmptySecondChance = this.secondChance.includes(-1);
            if (checkEmptySecondChance) {
                const idxEmptyCell = this.secondChance.indexOf(-1);
                this.secondChance[idxEmptyCell] = 0;
                return this.pointer;
            }
            if (checkEmptySecondChance === false) {
                if (this.secondChance[this.pointer] === -1 || this.secondChance[this.pointer] === 0)
                    return this.pointer;
                this.secondChance[this.pointer] = 0;
            }
            this.pointer = (this.pointer + 1) % this.frames.length;
        }
    }

    updateGrid(curCol) {
        for (let i = 0; i < this.frames.length; i++) {
            this.framesGrid[i][curCol] = this.frames[i];
            this.secondChancesGrid[i][curCol] = this.secondChance[i];
        }
    }

    run() {
        for (let iRow = 0; iRow < this.frameCount; iRow++) {
            this.frames[iRow] = -1;
            this.secondChance[iRow] = -1;
        }

        const setReplacedPageFalse = (arrItemObj) => {
            for (let i = 0; i < arrItemObj.length; i++) {
                arrItemObj[i].replacedPage = false;
            }
        };

        const replaceWithValue = (arr, value, replace) => {
            for (let i = 0; i < arr.length; i++)
                if (arr[i].textVal === value) arr[i] = replace;
        };

        for (let k = 0; k < this.pages.length; k++) {
            if (k === 0) {
                this.objData[`col${k}`] = [];
            } else {
                this.objData[`col${k}`] = JSON.parse(
                    JSON.stringify(this.objData[`col${k - 1}`]),
                );
            }

            setReplacedPageFalse(this.objData[`col${k}`]);

            if (!this.isInFrame(this.pages[k])) {
                let replaceIndex = this.findReplacementIndex();
                let checkEmptyFrame = false;
                for (let i = 0; i < this.frameCount; i++) {
                    if (this.frames[i] === -1) {
                        this.frames[i] = this.pages[k];
                        checkEmptyFrame = true;
                        break;
                    }
                }
                if (!checkEmptyFrame) {
                    const iValFirstItem = this.frames[replaceIndex];
                    const replaceItem = {
                        textVal: this.pages[k],
                        replacedPage: true,
                    };

                    replaceWithValue(
                        this.objData[`col${k}`],
                        iValFirstItem,
                        replaceItem,
                    );

                    this.objData[`col${k}`][0].textTrigger = 1;

                    this.frames[replaceIndex] = this.pages[k];
                    this.secondChance[replaceIndex] = 0;
                } else {
                    this.objData[`col${k}`].push({
                        textVal: this.pages[k],
                        replacedPage: true,
                    });

                    this.objData[`col${k}`][0].textTrigger = 0;
                }
                this.pointer = (replaceIndex + 1) % this.frameCount;
                this.pageFault++;
            } else {
                this.objData[`col${k}`][0].textTrigger = 2;

                let index = this.frames.indexOf(this.pages[k]);
                this.secondChance[index] = 1;
                this.pointer = (this.pointer >= 3 ? 0 : this.pointer + 1) % this.frameCount;
            }
            this.updateGrid(k);
        }
    }

    getSCData() {
        for (let iCol = 0; iCol < this.pages.length; iCol++) {
            this.scData[`col${iCol}`] = []; 
            for (let iRow = 0; iRow < this.frameCount; iRow++) {
                if (this.secondChancesGrid[iRow][iCol] !== -1) {
                    this.scData[`col${iCol}`].push(
                        this.secondChancesGrid[iRow][iCol]
                    );
                }
            }
        }
    }

    getFramesResults() {
        return this.framesGrid;
    }

    getSecondChancesResults() {
        return this.secondChancesGrid;
    }

    getQuantityItemArr() {
        let iResult = 0;
        for (const key in this.objData)
            for (let iIndex = 0; iIndex < this.objData[key].length; iIndex++)
                iResult++;
        return iResult;
    }
}
