class PageFaultOptimal {
    constructor(pages, numFrames) {
        this.fr = [];
        this.pages = pages;
        this.pageFault = 0;
        this.numFrames = numFrames;
        
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
            if (j === pageNum)
                return i;
        }
        return (res === -1) ? 0 : res;
    }

    optimalPageReplacement(pages, pageNum, numFrames) {
        let frames = Array.from({ length: numFrames }, () => Array(pageNum).fill(-1));
        let currFrame = 0;
        let pageFault = 0;
        let fr = [];

        for (let i = 0; i < pageNum; i++) {
            if (this.search(pages[i], fr)) {
                for (let j = 0; j < numFrames; j++) {
                    frames[j][currFrame] = fr[j];
                }
                currFrame++;
                continue;
            }

            if (fr.length < numFrames)
                fr.push(pages[i]);
            else {
                let j = this.predict(pages, fr, pageNum, i + 1);
                fr[j] = pages[i];
            }

            pageFault++;
            for (let j = 0; j < numFrames; j++) {
                frames[j][currFrame] = (j < fr.length) ? fr[j] : -1;
            }
            currFrame++;
        }

        for (let i = 0; i < currFrame; i++) {
            let row = "";
            for (let j = 0; j < numFrames; j++) {
                row += (frames[j][i] === -1 ? "-" : frames[j][i]) + " ";
            }
            //console.log(row.trim());
        }

        return frames;
    }
        
}
