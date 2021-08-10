let numArr = [];

let sortedNumArr = [];

function getUnicNum(){
    let num = getRandomNum();
    if(numArr.includes(num)) return getUnicNum();

    numArr.push(num);
    return numArr[numArr.length - 1];
}

function getRandomNum(){
    return Math.floor(Math.random() * 100) + 1;
}

function cleanNumArray(){
    numArr = [];
}

function quickSort(arr) {
    if(arr.length === 0) return [];
    let choseEl = arr[0];
    let leftA = [];
    let rightA = [];

    for (let i = 1; i < arr.length; i++) {
        if(arr[i] < choseEl) leftA.push(arr[i]);
        else rightA.push(arr[i]);
    }

    return quickSort(leftA).concat(choseEl, quickSort(rightA));
}

function setSortedNumArr(){
    sortedNumArr = quickSort(numArr).reverse();
}

function getSortedNumArr(){
    return sortedNumArr;
}

export {cleanNumArray, getUnicNum, setSortedNumArr, getSortedNumArr};