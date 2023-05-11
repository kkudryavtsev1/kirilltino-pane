import { cubicInOut } from 'svelte/easing';
export declare function resize(node: any, { delay, duration, easing }: {
    delay?: number;
    duration?: number;
    easing?: typeof cubicInOut;
}): {
    delay: number;
    duration: number;
    easing: typeof cubicInOut;
    css: (t: any) => string;
};
export declare function resize_height(node: any, { delay, duration, easing }: {
    delay?: number;
    duration?: number;
    easing?: typeof cubicInOut;
}): {
    delay: number;
    duration: number;
    easing: typeof cubicInOut;
    css: (t: any) => string;
};
export declare function resize_width(node: any, { delay, duration, easing }: {
    delay?: number;
    duration?: number;
    easing?: typeof cubicInOut;
}): {
    delay: number;
    duration: number;
    easing: typeof cubicInOut;
    css: (t: any) => string;
};
