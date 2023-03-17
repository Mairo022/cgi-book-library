function generatePages(pageCur: number, pagesTotal: number, displayedPages: number): Array<number> {
    const pagesFromMidPoint: number = Math.floor(displayedPages/2)
    const pages: Array<number> = []

    let startPage: number, endPage: number = 0

    // Less pages than the amount of displayed pages
    if (pagesTotal <= displayedPages) {
        startPage = 1;
        endPage = pagesTotal;
        // Less pages in first half
    } else if (pageCur <= pagesFromMidPoint + 1) {
        startPage = 1;
        endPage = displayedPages;
        // Less pages in second half
    } else if (pageCur >= pagesTotal - pagesFromMidPoint) {
        endPage = pagesTotal;
        startPage = pagesTotal - displayedPages + 1;
        // Equal amount of pages on both sides
    } else {
        startPage = pageCur - pagesFromMidPoint;
        endPage = pageCur + pagesFromMidPoint;
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
    }

    return pages
}

export default generatePages