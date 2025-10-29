<script lang="ts">
	import { Container, Sprite } from 'pixi-svelte';  // Removed SpineProvider, SpineTrack—unused now
	import { FadeContainer, LoadingProgress } from 'components-pixi';
	import { MainContainer } from 'components-layout';

	import { getContext } from '../game/context';
	import TransitionAnimation from './TransitionAnimation.svelte';
	import PressToContinue from './PressToContinue.svelte';

	// Optional: For simple animation without Spine
	import { onMount } from 'svelte';
	import { Ticker } from 'pixi.js';

	type Props = {
		onloaded: () => void;
	};

	const props: Props = $props();
	const context = getContext();

	let loadingType = $state<'start' | 'transition'>('start');
	// Removed console.log—uncomment if debugging: console.log("✅ Loaded assets keys:", Object.keys(context.stateApp.loadedAssets || {}));

	// Optional: Bind to loader sprite for animation
	let loaderSprite;

	onMount(() => {
		if (loaderSprite) {
			const ticker = Ticker.shared;
			ticker.add(() => {
				loaderSprite.rotation += 0.01;  // Gentle rotate for "loading" effect
			});
			return () => ticker.remove(() => {});  // Cleanup
		}
	});
</script>

<!-- Logo and loading progress (uncommented and simplified—no Spine needed) -->
<FadeContainer show={loadingType === 'start'}>
	<MainContainer>
		<Container
			x={context.stateLayoutDerived.mainLayout().width * 0.5}
			y={context.stateLayoutDerived.mainLayout().height * 0.5}
		>
			<!-- Simplified: Static sprite for loader (uses key from assets.ts) -->
			<Sprite bind:this={loaderSprite} key="loader" x={0} y={0} anchor={{ x: 0.5, y: 0.5 }} scale={1} />  <!-- Added anchor/scale for centering -->
			{#if !context.stateApp.loaded}
				<LoadingProgress y={250} width={1967 * 0.2} height={346 * 0.2}>
					{#snippet background(sizes)}
						<Sprite key="progressBarBackground.png" {...sizes} />
					{/snippet}
					{#snippet progress(sizes)}
						<Sprite key="progressBar.png" {...sizes} />
					{/snippet}
					{#snippet frame(sizes)}
						<Sprite key="progressBarFrame.png" {...sizes} />
					{/snippet}
				</LoadingProgress>
			{/if}
		</Container>
	</MainContainer>
</FadeContainer>

<!-- Press to continue -->
<FadeContainer show={loadingType === 'start' && context.stateApp.loaded}>
	<PressToContinue onpress={() => (loadingType = 'transition')} />
</FadeContainer>

<!-- Transition between the loading screen and the game -->
<FadeContainer show={loadingType === 'transition'}>
	<TransitionAnimation oncomplete={props.onloaded} />
</FadeContainer>