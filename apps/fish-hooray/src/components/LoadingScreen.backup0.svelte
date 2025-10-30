<script lang="ts">

	import { onMount } from 'svelte';

	import { Container, Sprite } from 'pixi-svelte';  // Kept as-is
	import { FadeContainer, LoadingProgress } from 'components-pixi';
	import { MainContainer } from 'components-layout';

	import { getContext } from '../game/context';
	import TransitionAnimation from './TransitionAnimation.svelte';
	import PressToContinue from './PressToContinue.svelte';

	// Fixed import: Use modular Pixi for Ticker (fixes "cannot find module 'pixi.js'")
	import { Ticker } from '@pixi/core';  // Run `npm install @pixi/core` if not installed
	import type { Sprite as PixiSprite } from '@pixi/sprite';  // For typing

	// For sound: Assume utils-sound exports playSound; adjust if your export is different
	import { sound } from '../game/sound';  // Import from your package (check path in package.json)

	type Props = {
		onloaded: () => void;
	};

	const props: Props = $props();
	const context = getContext();

	let loadingType = $state<'start' | 'transition'>('start');

	// Fixed typing: Explicitly type loaderSprite to avoid implicit 'any' errors
	let loaderSprite: PixiSprite | null = null;

	// Fixed animation: Define as separate function for proper add/remove
	const animateLoader = () => {
		if (loaderSprite) {  // Null check to prevent rotation error on null
			loaderSprite.rotation += 0.02;  // Gentle rotate
		}
	};

	onMount(() => {
		if (loaderSprite) {
			sound.players.music.play({ name: 'bgm_winlevel_superwin' });
			const ticker = Ticker.shared;
			ticker.add(animateLoader);  // Add the defined function
			return () => ticker.remove(animateLoader);  // Proper cleanup on unmount
		}
	});

	console.log("LOADINGSCREEN TEST LOADED", context.stateApp.loaded);
	console.log("LOADINGSCREEN TEST LOAD ASSETS", context.stateApp.loadedAssets);
</script>

<FadeContainer show={loadingType === 'start'}>
	<MainContainer>
		<Container
			x={context.stateLayoutDerived.mainLayout().width * 0.5}
			y={context.stateLayoutDerived.mainLayout().height * 0.5}
		>
			<!-- Bind for animation access -->
			<Sprite bind:this={loaderSprite} key="loader" x={0} y={0} anchor={{ x: 0.5, y: 0.5 }} scale={1} />
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

<!-- Press to continue with sound trigger -->
<FadeContainer show={loadingType === 'start' && context.stateApp.loaded}>
	<PressToContinue onpress={() => {
		loadingType = 'transition';
		sound.players.once.play({ name: 'jng_intro_fs' }); // Play a sound on press (replace 'start_game' with your actual sound key from sounds.json)
		sound.players.music.fade({ name: 'bgm_winlevel_superwin', from: 0, to: 1, duration: 2000 });
	}} />
</FadeContainer>

<FadeContainer show={loadingType === 'transition'}>
	<TransitionAnimation oncomplete={() => {
		props.onloaded();
		sound.players.once.play({ name: 'jng_intro_fs' });  // Optional: Play sound on transition end (adjust key)
	}} />
</FadeContainer>