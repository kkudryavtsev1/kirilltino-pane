

<script>
    /**
     * Svelte
     */
    import { getContext, onMount, createEventDispatcher, onDestroy } from 'svelte';
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';

    import {fade, fly} from 'svelte/transition'
    /**
     * body
     */

     function getTranslateYValue(translateString) {

        const arr = translateString.replaceAll('(', '').replaceAll(')', '').split(',')
        const res = +arr[arr.length-1]

        return res;

}


    export let open = false;
    let container;
    export let defaultHeight = 0;
    export let openedHeight = 0;
    export let breakpoint = 0;
    export let hideDash = false;
    // export let minHeight = 0;
    export let width = '100%';
    export let dashWidth = 60;
    export let dashHeight = 5;
    export let fitHeight = false
    export let dashColor = 'rgba(148, 154, 163, 0.5)'
    export let maxSpeed = 1.5
    export let trigger = false
    export let moveToClose = false
    
    export const closePane = () => {
        open = false
        touchEnd()
    }


    let startMouve = 0;
    let blockCuper = false;
    let direction = '';
    let wrapper 
    let startTime = 0
    let endTime = 0
    let different = 0
    let startPosition = 0
    let outDuration = 0
    const tweenedHeight = tweened(undefined, {
        duration: 300,
        easing: cubicOut
    });

    const clickOutside = (node) => {
        const handleClick = (event) => {
            if (!node.contains(event.target) && !event.target.hasAttribute('blockOutclick')) {
                node.dispatchEvent(new CustomEvent("outclick"));
            }
        };
        document.addEventListener("click", handleClick, true);
        return {
            destroy() {
                document.removeEventListener("click", handleClick, true);
            }
        };
    }	


    


    const touchStartSlide = (e) => {
        startTime = new Date().getTime()

            if (open) {

                direction = 'down';
            } else {

                direction = 'up';
            }


        startMouve = +e.touches[0].clientY

    };

    const touchMoveSlide = (e) => {
        different = e.touches[0].clientY - startMouve
        const style = getComputedStyle(container)
        const currentTransformY = getTranslateYValue(style.transform)

        if (direction === 'up' && different <= 0 && startPosition + different > 0) {
            container.style.transform = `translateY(${startPosition + different}px)`
            open = startPosition - currentTransformY >= breakpoint

        } 


        if (direction === 'down' && different > 0 && different <= startPosition) {
            container.style.transform = `translateY(${different}px)`
            open = currentTransformY <= breakpoint
        }

        if (direction === 'up' && different > 0 && different <= startPosition && moveToClose) {
            container.style.transform = `translateY(${startPosition + different}px)`
            // console.log(defaultHeight, different)
            if (different > defaultHeight/2) dispatch('dragged-to-close')
            // open = currentTransformY <= breakpoint - defaultHeight
        }

        

    };


 

    const touchEnd = () => {
        blockCuper = true
        endTime = new Date().getTime()


        const speed = different / (endTime - startTime)

        const style = getComputedStyle(container)
        const currentTransformY = getTranslateYValue(style.transform)
        
   
        if (open && direction === 'down' && Math.abs(speed) > maxSpeed) {
            open = false
        } else if (open === false && direction === 'up' && Math.abs(speed) > maxSpeed) {
            open = true
        }
        

        if (open && currentTransformY != 0) {
            tweenedMove(currentTransformY, 0)
        }
        

        if (!open && currentTransformY != startPosition) {
            tweenedMove(currentTransformY, startPosition)
        }

        direction = '';
        different = 0

        


    };

    const dispatch = createEventDispatcher();
    $: dispatch('updateStatus', open), open


    const outClickMain = () => {
        if (open) {
            open = false;
            touchEnd();
        }
    };


    

    const tweenedMove = (from, to, duration = 300) => {
        blockCuper = true;
        tweenedHeight.set(from, { duration: 0 });
        tweenedHeight.set(to, { duration: 300 });
        const move = () => {
            if (container?.style) container.style.transform = `translateY(${$tweenedHeight}px)`;
            if ($tweenedHeight !== to) requestAnimationFrame(move) 
            else if ($tweenedHeight === to) {
                outDuration = open ? container.clientHeight : defaultHeight
                blockCuper = false;
            }
        }
        requestAnimationFrame(move)
    }

    onMount(() => {
        wrapper.scrollTop = 0;
        startPosition = container.clientHeight - defaultHeight

        if (!breakpoint) breakpoint = startPosition / 2
        // container.style.height = defaultHeight + 'px'
        container.style.transform = `translateY(${container.clientHeight}px)`
        outDuration = open ? container.clientHeight : defaultHeight

        tweenedMove(container.clientHeight, startPosition)
    })

    onDestroy(() => {
        dispatch('updateStatus', false)

    })

    $: if (trigger === true) {
        open = true
        touchEnd()
    }



</script>

<div 
on:scroll={wrapper.scrollTop = 0}
bind:this={wrapper}
class="wrap">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
        bind:this={container}
        on:outclick={outClickMain}
        use:clickOutside
        
        style="
        --defaultHeight: {defaultHeight}px;
        --openedHeight: {fitHeight ? 'fit-content' : openedHeight + 'px'};
        --width: {width};
        --dashWidth: {dashWidth}px;
        --dashHeight: {dashHeight}px;
        --dashColor: {dashColor};
        "
        blockOutclick
        on:touchstart={touchStartSlide}
        on:touchmove={touchMoveSlide}
        on:touchend={touchEnd}
        on:click={() => {
            // container.style.height = 'auto'
            open = true;
            touchEnd();
            // onClick()
        }}
        out:fly={{y: outDuration}}
        class:disabled={blockCuper}
        class="panel">
        {#if !hideDash}
            <div 
            class:open={open}
            blockOutclick class="cuper_dash" />
        {/if}
        <slot />
    </div>
</div>

<style lang="scss">

    .wrap {
        // width: 100%;
        // height: 100%;
        right: 0;
        bottom: 0;
        // max-height: 100vh;
        // max-width: 100vw;
        position: absolute;
        // position: fixed;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        left: 0;
        top: 0;
        pointer-events: none;
        overflow: hidden;
        // overflow: clip;
        z-index: 6;
        touch-action: none;
        overflow: clip;
    }

    .panel {
        overflow: visible;
        margin: 0 auto;
        width: var(--width);
        pointer-events: all;

        height: var(--openedHeight);
        .disabled {
            pointer-events: none !important;
        }
        .cuper_dash {
            transition: var(--transition) top;
            position: absolute;
            height: var(--dashHeight);
            width: var(--dashWidth);
            background: var(--dashColor);
            left: 50%;
            transform: translateX(-50%);
            z-index: 3;
            border-radius: 30px;
            top: 7px;
        }
    }





</style>