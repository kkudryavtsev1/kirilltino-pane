import { cubicInOut } from 'svelte/easing';
export function resize(node, { delay = 0, duration = 300, easing = cubicInOut }) {
    const style = getComputedStyle(node);
    const opacity = +style.opacity;
    const height = parseFloat(style.height);
    const width = parseFloat(style.width);
    const padding_left = parseFloat(style.paddingLeft);
    const padding_right = parseFloat(style.paddingRight);
    const margin_left = parseFloat(style.marginLeft);
    const margin_right = parseFloat(style.marginRight);
    return {
        delay,
        duration,
        easing,
        css: (t) => `overflow: hidden;` +
            `opacity: ${t * opacity};` +
            `height: ${t * height}px;` +
            `width: ${t * width}px;` +
            // `padding-left: ${t * padding_left}px;` +
            // `padding-right: ${t * padding_right}px;` +
            `margin-left: ${t * margin_left}px;` +
            `margin-right: ${t * margin_right}px;`
    };
}
export function resize_height(node, { delay = 0, duration = 300, easing = cubicInOut }) {
    const style = getComputedStyle(node);
    const opacity = +style.opacity;
    const height = parseFloat(style.height);
    const width = parseFloat(style.width);
    const padding_left = parseFloat(style.paddingLeft);
    const padding_right = parseFloat(style.paddingRight);
    const margin_left = parseFloat(style.marginLeft);
    const margin_right = parseFloat(style.marginRight);
    return {
        delay,
        duration,
        easing,
        css: (t) => `overflow: hidden;` +
            `opacity: ${t * opacity};` +
            `height: ${t * height}px;` +
            // `width: ${t * width}px;` +
            // `padding-left: ${t * padding_left}px;` +
            // `padding-right: ${t * padding_right}px;` +
            `margin-left: ${t * margin_left}px;` +
            `margin-right: ${t * margin_right}px;`
    };
}
export function resize_width(node, { delay = 0, duration = 300, easing = cubicInOut }) {
    const style = getComputedStyle(node);
    const opacity = +style.opacity;
    const height = parseFloat(style.height);
    const width = parseFloat(style.width);
    const padding_left = parseFloat(style.paddingLeft);
    const padding_right = parseFloat(style.paddingRight);
    const margin_left = parseFloat(style.marginLeft);
    const margin_right = parseFloat(style.marginRight);
    return {
        delay,
        duration,
        easing,
        css: (t) => `overflow: hidden;` +
            `opacity: ${t * opacity};` +
            `height: ${t * height}px;` +
            `width: ${t * width}px;` +
            // `padding-left: ${t * padding_left}px;` +
            // `padding-right: ${t * padding_right}px;` +
            `margin-left: ${t * margin_left}px;` +
            `margin-right: ${t * margin_right}px;`
    };
}
