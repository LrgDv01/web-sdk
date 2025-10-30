<script lang="ts">
	import { onMount } from 'svelte';

	import { Container, Sprite } from 'pixi-svelte';
	import { FadeContainer, LoadingProgress } from 'components-pixi';
	import { MainContainer } from 'components-layout';

	import { getContext } from '../game/context';
	import TransitionAnimation from './TransitionAnimation.svelte';
	import PressToContinue from './PressToContinue.svelte';

	// import { Texture } from '@pixi/core';
	import type { Sprite as PixiSprite } from '@pixi/sprite';
	import { sound } from '../game/sound';
	import { Ticker } from '@pixi/ticker';

	type Props = {
		onloaded: () => void;
	};

	const props: Props = $props();
	const context = getContext();

	let loadingType = $state<'start' | 'transition'>('start');
	let loaderSprite: PixiSprite | null = null;

	const animateLoader = (delta) => {  // Use delta for frame-independent speed
		if (loaderSprite) {
			loaderSprite.rotation += 0.015 * delta;  // Rotate
			loaderSprite.scale.set(1 + 0.05 * Math.sin(Date.now() / 500));  // Pulse scale (breath effect)
		}
	};

	// FIXED: $effect.pre runs BEFORE paint – immediate when bind sets
	$effect.pre(() => {
		if (!loaderSprite) return;

		sound.players.music.play({ name: 'bgm_winlevel_superwin' });

		const ticker = Ticker.shared;
		ticker.add(animateLoader);

		return () => ticker.remove(animateLoader);
	});

	console.log("LOADING SCREEN SVELTE PROGRESS BAR ", context.stateApp.loadedAssets.progressBar);
</script>

<FadeContainer show={loadingType === 'start'}>
	<MainContainer>
		<Container
			x={context.stateLayoutDerived.mainLayout().width * 0.5}
			y={context.stateLayoutDerived.mainLayout().height * 0.5}
		>
			<Sprite bind:this={loaderSprite} key="loader" x={0} y={0} anchor={{ x: 0.5, y: 0.5 }} scale={1} />
			{#if !context.stateApp.loaded}
				<LoadingProgress y={250} width={1967 * 0.2} height={346 * 0.2}>
					{#snippet background(sizes)}
						<Sprite key="progressBarBackground.png" {...sizes} />  <!-- FIXED: Ensure exact key from json (log loadedAssets.progressBar to check) -->
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

<FadeContainer show={loadingType === 'start' && context.stateApp.loaded}>
	<PressToContinue onpress={() => {
		loadingType = 'transition';
		sound.players.once.play({ name: 'jng_intro_fs' });
		sound.players.music.fade({ name: 'bgm_winlevel_superwin', from: 0, to: 1, duration: 2000 });
	}} />
</FadeContainer>

<FadeContainer show={loadingType === 'transition'}>
	<TransitionAnimation oncomplete={props.onloaded} />
</FadeContainer>

