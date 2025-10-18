

<script lang="ts" module>
	// import frame_bg from '../../static/assets/sprites/reelsFrame/reels_frame.png';	

	// No changes here—keeping the type for events, but we'll ignore glow events since animations are removed.
	export type EmitterEventBoardFrame =
		| { type: 'boardFrameGlowShow' }
		| { type: 'boardFrameGlowHide' };
</script>

<script lang="ts">
	import { Sprite } from 'pixi-svelte';  // Keeping Sprite for static images.

	import { getContext } from '../game/context';

	// Remove imports for SpineProvider and SpineTrack—they're not needed for static frames.
	// import { SpineProvider, SpineTrack } from 'pixi-svelte';

	const context = getContext();

	// Remove animation-related state variables—they're tied to Spine.
	// let animationName = $state<AnimationName | undefined>(undefined);
	// let loop = $state(false);

	// Remove the event subscriptions for glow—they won't do anything now.
	// context.eventEmitter.subscribeOnMount({
	// 	boardFrameGlowShow: () => { ... },
	// 	boardFrameGlowHide: () => { ... },
	// });

	// Keep these scales/adjustments for now—they ensure the frame fits the board.
	// You can tweak them if your new images have different dimensions.
	const SPRITE_SCALE = { width: 1.25, height: 0.72 };
	const POSITION_ADJUSTMENT = 1.01;

	// If you want a single static frame image instead of two layers (bg + edge),
	// you can combine them into one PNG/WEBP externally (e.g., using an image editor).
	// For now, we'll keep two for flexibility.
</script>

<!-- Remove the entire SpineProvider block—it's for animations. -->
<!-- {#if animationName} ... {/if} -->

<!-- Update these Sprites with your new static images. -->
<!-- Assume you've placed them in your assets folder and imported if necessary. -->
<!-- If not using imports, use the 'key' prop as a string path if your Pixi setup loads assets dynamically. -->

<Sprite
	key="../../static/assets/sprites/reelsFrame/reels_frame.png" 
	anchor={0.5}
	x={context.stateGameDerived.boardLayout().x * POSITION_ADJUSTMENT}
	y={context.stateGameDerived.boardLayout().y * POSITION_ADJUSTMENT}
	width={context.stateGameDerived.boardLayout().width * SPRITE_SCALE.width}
	height={context.stateGameDerived.boardLayout().height * SPRITE_SCALE.height}
/>
<!-- 
<Sprite
	key="your_new_frame_edge.png" 
	anchor={0.5}
	x={context.stateGameDerived.boardLayout().x * POSITION_ADJUSTMENT}
	y={context.stateGameDerived.boardLayout().y * POSITION_ADJUSTMENT}
	width={context.stateGameDerived.boardLayout().width * SPRITE_SCALE.width}
	height={context.stateGameDerived.boardLayout().height * SPRITE_SCALE.height}
/> -->