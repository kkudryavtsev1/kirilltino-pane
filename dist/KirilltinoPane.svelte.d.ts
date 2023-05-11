import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        /**
             * body
             */ open?: boolean;
        defaultHeight?: number;
        openedHeight?: number;
        breakpoint?: number;
        hideDash?: boolean;
        width?: string;
        dashWidth?: number;
        dashHeight?: number;
        fitHeight?: boolean;
        dashColor?: string;
        maxSpeed?: number;
        trigger?: boolean;
        moveToClose?: boolean;
        bgColor?: string;
        roundCorner?: string;
        closePane?: () => void;
    };
    events: {
        updateStatus: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export type KirilltinoPaneProps = typeof __propDef.props;
export type KirilltinoPaneEvents = typeof __propDef.events;
export type KirilltinoPaneSlots = typeof __propDef.slots;
export default class KirilltinoPane extends SvelteComponentTyped<KirilltinoPaneProps, KirilltinoPaneEvents, KirilltinoPaneSlots> {
    get closePane(): () => void;
}
export {};
