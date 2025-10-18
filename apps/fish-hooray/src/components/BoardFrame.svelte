<script lang="ts" module>
	// Keeping types, but unused now
	export type EmitterEventBoardFrame =
		| { type: 'boardFrameGlowShow' }
		| { type: 'boardFrameGlowHide' };
</script>

<script lang="ts">
	import { Sprite } from 'pixi-svelte';

	import { getContext } from '../game/context';

	const context = getContext();

	// Adjust scales to fit your new image (test by running and resizing window)
	// Your AI image might need different values—start with 1.0 and tweak
	const SPRITE_SCALE = { width: 1.0, height: 1.0 };  // Changed: Simpler for static PNG
	const POSITION_ADJUSTMENT = 1.0;  // Changed: No need for 1.01 offset

	// Removed unused import—loading is handled by AssetsLoader
</script>

<!-- Single Sprite for your combined image -->
<Sprite
	key="reels_frame"  
	anchor={0.5}  
	x={context.stateGameDerived.boardLayout().x * POSITION_ADJUSTMENT}
	y={context.stateGameDerived.boardLayout().y * POSITION_ADJUSTMENT}
	width={context.stateGameDerived.boardLayout().width * SPRITE_SCALE.width}
	height={context.stateGameDerived.boardLayout().height * SPRITE_SCALE.height}
/>