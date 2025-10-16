<script lang="ts">
	import { tweened } from 'svelte/motion';
	
	// import SymbolSpine from './SymbolSpine.svelte';  // Keep commented for now
	import SymbolSprite from './SymbolSprite.svelte';
	import { getSymbolInfo } from '../game/utils';
	import type { SymbolState, RawSymbol } from '../game/types';
	import { getContext } from '../game/context';
	import { BitmapText } from 'pixi-svelte';

	type Props = {
		x?: number;
		y?: number;
		state: SymbolState;
		rawSymbol: RawSymbol;
		oncomplete?: () => void;
		loop?: boolean;
		reel: number;  // NEW: Add reel/row props for win check (assume parent Board.svelte passes them)
		row: number;
	};

	const props: Props = $props();
	const context = getContext();
	const symbolInfo = $derived(getSymbolInfo({ rawSymbol: props.rawSymbol, state: props.state }));
	// const isSprite = $derived(symbolInfo.type === 'sprite');
	const isSprite = $derived(true); // Temporary force to use sprite until we have spine assets

	// ADDED (your tween setup is good, but we'll fix the variable name consistency)
	let symbolScale = tweened(1);  // Default scale

	// Reactive effect for animation on load (drop-in feel)
	$effect(() => {
		// When the component mounts, do a small pop-in.
		symbolScale.set(0.8, { duration: 0 });
		symbolScale.set(1, { duration: 400 });
	});

	// Listen for win event (from book events like 'winInfo') - FIXED: Use props.reel/row, and safer check
	// Use subscribeOnMount to safely register event handlers while component is mounted
	// Build handler map as an `any` first to avoid excess type-narrowing of object literal
	const _handlers: any = {};
	// When a win occurs, tween the symbol and call oncomplete when done
	let _completed = false;
	const callOncompleteOnce = () => {
		if (_completed) return;
		_completed = true;
		try {
			console.debug(`[Symbol] calling oncomplete for reel=${props.reel} row=${props.row}`);
			props.oncomplete?.();
		} catch (err) {
			console.warn('[Symbol] error calling oncomplete', err);
		}
	};

	_handlers.winInfo = (winData: any) => {
		if (winData.positions?.some((pos: any) => pos.reel === props.reel && pos.row === props.row)) {
			symbolScale.set(1.2, { duration: 160 });
			setTimeout(() => {
				symbolScale.set(1, { duration: 200 });
				// If an oncomplete handler was passed (used by Board to await animations), call it after the pulse
				callOncompleteOnce();
			}, 360);
		}
	};

	context.eventEmitter.subscribeOnMount(_handlers as any);

	// Also react to direct state changes (some code paths set symbolState = 'win' directly
	// and expect the component to run its animation and call oncomplete). This ensures
	// the Board's awaiting logic (which sets reelSymbol.oncomplete = resolve) will not hang.
	$effect(() => {
		if (props.state === 'win') {
			// Run the same pulse animation as the winInfo handler
			symbolScale.set(1.2, { duration: 160 });
			setTimeout(() => {
				symbolScale.set(1, { duration: 200 });
				callOncompleteOnce();
			}, 360);
		}
	});
</script>

{#if isSprite}
	<!-- FIXED: Use $symbolScale instead of $scale -->
	<SymbolSprite {symbolInfo} x={props.x} y={props.y} scale={$symbolScale} />
<!--
{:else}
	<SymbolSpine
		loop={props.loop}
		{symbolInfo}
		x={props.x}
		y={props.y}
		showWinFrame={props.state === 'win' && !['S', 'M'].includes(props.rawSymbol.name)}
		listener={{
			complete: props.oncomplete,
			event: (_, event) => {
				if (event.data?.name === 'wildExplode') {
					context.eventEmitter?.broadcast({ type: 'soundOnce', name: 'sfx_wild_explode' });
				}
			},
		}}
	/>
-->
{/if}

{#if props.rawSymbol.multiplier}
	<BitmapText
		anchor={0.5}
		x={props.x}
		y={props.y}
		text={`${props.rawSymbol.multiplier}X`}
		style={{
			fontFamily: 'gold',
			fontSize: 50,
		}}
	/>
{/if}