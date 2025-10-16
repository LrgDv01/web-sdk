<script lang="ts">
	import { Sprite } from 'pixi-svelte';
	import { SYMBOL_SIZE } from '../game/constants';

	type Props = any;
	const props: Props = $props();
</script>

<Sprite
	x={props.x}
	y={props.y}
	anchor={0.5}
	key={props.symbolInfo?.assetKey}
	width={SYMBOL_SIZE * (props.symbolInfo?.sizeRatios?.width ?? 1) * (props.scale ?? 1)}
	height={SYMBOL_SIZE * (props.symbolInfo?.sizeRatios?.height ?? 1) * (props.scale ?? 1)}
	scale={{ x: props.scale ?? 1, y: props.scale ?? 1 }}
/> 
