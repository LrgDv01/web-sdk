<script lang="ts">
	import Symbol from './Symbol.svelte';
	import SymbolWrap from './SymbolWrap.svelte';
	import { getSymbolInfo, getSymbolX } from '../game/utils';
	import type { ReelSymbol } from '../game/stateGame.svelte';

	type Props = {
		reelIndex: number;
		reelSymbol: ReelSymbol;
		row: number;
	};

	const props: Props = $props();
	const symbolInfo = $derived(
		getSymbolInfo({ rawSymbol: props.reelSymbol.rawSymbol, state: props.reelSymbol.symbolState }),
	);
</script>

<SymbolWrap
	x={getSymbolX(props.reelIndex)}
	y={props.reelSymbol.symbolY()}
	animating={symbolInfo.type === 'spine' &&
		(props.reelSymbol.symbolState === 'land' || props.reelSymbol.symbolState === 'win')}
>
	<Symbol
		state={props.reelSymbol.symbolState}
		rawSymbol={props.reelSymbol.rawSymbol}
		reel={props.reelIndex}
		row={props.row}
		oncomplete={() => {
			console.debug(`[ReelSymbol] child oncomplete called for reel=${props.reelIndex} row=${props.row} state=${props.reelSymbol.symbolState}`);
			if (props.reelSymbol.symbolState === 'win') {
				try {
					props.reelSymbol.oncomplete();
				} catch (err) {
					console.warn('[ReelSymbol] error calling reelSymbol.oncomplete', err);
				}
			}
			if (props.reelSymbol.symbolState === 'land') props.reelSymbol.symbolState = 'static';
		}}
	/>
</SymbolWrap>
