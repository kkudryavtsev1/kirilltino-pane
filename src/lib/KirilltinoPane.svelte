<script lang="ts">
	/**
	 * Svelte
	 */
	import { onMount, createEventDispatcher, onDestroy } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	import { fly } from 'svelte/transition';
	import { getTranslateYValue } from './helpers/helpers';
	/**
	 * body
	 */

	export let open = false;
	let container: HTMLElement;
	export let defaultHeight = 0;
	export let openedHeight = 0;
	export let breakpoint = 0;
	export let hideDash = false;
	export let width = '100%';
	export let dashWidth = 60;
	export let dashHeight = 5;
	export let fitHeight = false;
	export let dashColor = 'rgba(148, 154, 163, 0.5)';
	export let maxSpeed = 1.5;
	export let trigger = false;
	export let moveToClose = false;
	export let bgColor = 'transparent';
	export let roundCorner = '10px 10px 0 0';

	export const closePane = () => {
		open = false;
		touchEnd();
	};

	let startMouve = 0;
	let blockCuper = false;
	let direction = '';
	let wrapper: HTMLElement;
	let startTime = 0;
	let endTime = 0;
	let different = 0;
	let startPosition = 0;
	let outDuration = 0;
	const tweenedHeight = tweened(undefined, {
		duration: 300,
		easing: cubicOut
	});

	const clickOutside = (node: HTMLElement): { destroy: () => void } => {
		const handleClick = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			if (
				!node.contains(target as Node) &&
				!target.hasAttribute('blockOutclick')
			) {
				node.dispatchEvent(new CustomEvent('outclick'));
			}
		};

		document.addEventListener('click', handleClick, true);

		return {
			destroy() {
				document.removeEventListener('click', handleClick, true);
			}
		};
	};

	const touchStartSlide = (e: TouchEvent) => {
		startTime = new Date().getTime();

		if (open) {
			direction = 'down';
		} else {
			direction = 'up';
		}

		startMouve = +e.touches[0].clientY;
	};

	const touchMoveSlide = (e: TouchEvent) => {
		different = e.touches[0].clientY - startMouve;
		const style = getComputedStyle(container);
		const currentTransformY = getTranslateYValue(style.transform);

		if (direction === 'up' && different <= 0 && startPosition + different > 0) {
			container.style.transform = `translateY(${startPosition + different}px)`;
			open = startPosition - currentTransformY >= breakpoint;
		}

		if (direction === 'down' && different > 0 && different <= startPosition) {
			container.style.transform = `translateY(${different}px)`;
			open = currentTransformY <= breakpoint;
		}

		if (
			direction === 'up' &&
			different > 0 &&
			different <= startPosition &&
			moveToClose
		) {
			container.style.transform = `translateY(${startPosition + different}px)`;
			if (different > defaultHeight / 2) dispatch('dragged-to-close');
		}
	};

	const touchEnd = () => {
		blockCuper = true;
		endTime = new Date().getTime();

		const speed = different / (endTime - startTime);

		const style = getComputedStyle(container);
		const currentTransformY = getTranslateYValue(style.transform);

		if (open && direction === 'down' && Math.abs(speed) > maxSpeed) {
			open = false;
		} else if (
			open === false &&
			direction === 'up' &&
			Math.abs(speed) > maxSpeed
		) {
			open = true;
		}

		if (open && currentTransformY !== 0) {
			tweenedMove(currentTransformY, 0);
		}

		if (!open && currentTransformY !== startPosition) {
			tweenedMove(currentTransformY, startPosition);
		}

		direction = '';
		different = 0;
	};

	const dispatch = createEventDispatcher();
	$: dispatch('updateStatus', open), open;

	const outClickMain = () => {
		if (open) {
			open = false;
			touchEnd();
		}
	};

	const tweenedMove = (from: number, to: number, duration = 300) => {
		blockCuper = true;
		tweenedHeight.set(from, { duration: 0 });
		tweenedHeight.set(to, { duration });
		const move = () => {
			if (container?.style)
				container.style.transform = `translateY(${$tweenedHeight}px)`;
			if ($tweenedHeight !== to) requestAnimationFrame(move);
			else if ($tweenedHeight === to) {
				outDuration = open ? container.clientHeight : defaultHeight;
				blockCuper = false;
			}
		};
		requestAnimationFrame(move);
	};

	onMount(() => {
		wrapper.scrollTop = 0;
		startPosition = container.clientHeight - defaultHeight;

		if (!breakpoint) breakpoint = startPosition / 2;
		container.style.transform = `translateY(${container.clientHeight}px)`;
		outDuration = open ? container.clientHeight : defaultHeight;

		tweenedMove(container.clientHeight, startPosition);
	});

	onDestroy(() => {
		dispatch('updateStatus', false);
	});

	$: if (trigger === true) {
		open = true;
		touchEnd();
	}
</script>

<div
	on:scroll={(_) => (wrapper.scrollTop = 0)}
	bind:this={wrapper}
	class="wrap"
>
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
				--bgColor: {bgColor};
				--roundCorner: {roundCorner};
        "
		blockOutclick
		on:touchstart={touchStartSlide}
		on:touchmove={touchMoveSlide}
		on:touchend={touchEnd}
		on:click={() => {
			open = true;
			touchEnd();
		}}
		out:fly={{ y: outDuration }}
		class:disabled={blockCuper}
		class="panel"
	>
		{#if !hideDash}
			<div class:open blockOutclick class="cuper_dash" />
		{/if}
		<slot />
	</div>
</div>

<style lang="scss">
	.wrap {
		right: 0;
		bottom: 0;
		position: absolute;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		left: 0;
		top: 0;
		pointer-events: none;
		overflow: hidden;
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
		background: var(--bgColor);
		border-radius: var(--roundCorner);
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
