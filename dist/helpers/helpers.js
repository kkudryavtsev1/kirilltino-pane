export function getTranslateYValue(translateString) {
    const arr = translateString.replaceAll('(', '').replaceAll(')', '').split(',');
    const res = +arr[arr.length - 1];
    return res;
}
