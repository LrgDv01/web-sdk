<!-- <script lang="ts">
	// ==============================================================
	// Imports (grouped for readability)
	// ==============================================================
	import { onMount } from 'svelte';
	import { Container, Sprite } from 'pixi-svelte';
	import { FadeContainer, LoadingProgress } from 'components-pixi';
	import { MainContainer } from 'components-layout';
	import { getContext } from '../game/context';
	import TransitionAnimation from './TransitionAnimation.svelte';
	import PressToContinue from './PressToContinue.svelte';

	// FIXED: Modular Pixi v8 imports (installed in apps/fish-hooray)
	import { Ticker } from '@pixi/ticker';
	import type { Sprite as PixiSprite } from '@pixi/sprite';
	import { sound } from '../game/sound';

	// ==============================================================
	// Props & Context
	// ==============================================================
	type Props = { onloaded: () => void };
	const props: Props = $props();
	const context = getContext();

	// ==============================================================
	// State (reactive with $state)
	// ==============================================================
	let loadingType = $state<'start' | 'transition'>('start');
	let loaderSprite: PixiSprite | null = null;

	// ==============================================================
	// Animation Function (with null guard and typing)
	// ==============================================================
	const animateLoader = (delta: number) => {
		if (!loaderSprite) {
			console.log('Loader sprite null – skipping anim'); // Debug skip reason
			return;
		}

		loaderSprite.rotation += 0.015 * delta; // Rotate
		loaderSprite.scale.set(1 + 0.05 * Math.sin(Date.now() / 500)); // Pulse (breath effect)
		console.log('Animating loader with delta:', delta); // Debug: Confirms firing
	};

	// ==============================================================
	// Effects (lifecycle + debug)
	// ==============================================================
	$effect(() => {
		if (!loaderSprite) return; // Wait for bind to set

		sound.players.music.play({ name: 'bgm_winlevel_superwin' });

		const ticker = Ticker.shared;
		ticker.add(animateLoader);

		// FIXED: Debug progress keys (adjust based on log output)
		const progressTextures = context.stateApp.loadedAssets.progressBar;
		console.log("PROGRESS KEYS:", progressTextures ? Object.keys(progressTextures) : 'undefined');

		return () => ticker.remove(animateLoader); // Cleanup
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
			<Sprite bind:this={loaderSprite} key="loader" x={0} y={0} anchor={{ x: 0.5, y: 0.5 }} scale={1} />
			{#if !context.stateApp.loaded}
				<LoadingProgress y={250} width={1967 * 0.2} height={346 * 0.2}>
					{#snippet background(sizes: { width: number; height: number })}
						<Sprite key="progressBarBackground" {...sizes} />  // FIXED: Match json frame (no .png; log to confirm)
					{/snippet}
					{#snippet progress(sizes: { width: number; height: number })}
						<Sprite key="progressBar" {...sizes} />
					{/snippet}
					{#snippet frame(sizes: { width: number; height: number })}
						<Sprite key="progressBarFrame" {...sizes} />
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
</FadeContainer> -->



<script lang="ts">
	/* --------------------------------------------------------------
	   Imports
	   -------------------------------------------------------------- */
	import { Container, Sprite } from 'pixi-svelte';
	import { FadeContainer, LoadingProgress } from 'components-pixi';
	import { MainContainer } from 'components-layout';
	import { getContext } from '../game/context';
	import TransitionAnimation from './TransitionAnimation.svelte';
	import PressToContinue from './PressToContinue.svelte';

	import { Ticker } from '@pixi/ticker';
	import type { Sprite as PixiSprite } from '@pixi/sprite';
	import { sound } from '../game/sound';

	/* --------------------------------------------------------------
	   Props & Context
	   -------------------------------------------------------------- */
	type Props = { onloaded: () => void };
	const { onloaded }: Props = $props();
	const ctx = getContext();

	/* --------------------------------------------------------------
	   State
	   -------------------------------------------------------------- */
	let loadingType = $state<'start' | 'transition'>('start');
	let loaderSprite: PixiSprite | null = null;   // <- real PIXI sprite

	/* --------------------------------------------------------------
	   Progress-bar texture keys (filled when assets load)
	   -------------------------------------------------------------- */
	let bgKey = $state('');
	let progKey = $state('');
	let frameKey = $state('');

	/* --------------------------------------------------------------
	   Loader animation (rotation + pulse)
	   -------------------------------------------------------------- */
	const animateLoader = (delta: number) => {
		if (!loaderSprite) return;

		loaderSprite.rotation += 0.015 * delta;
		const pulse = 1 + 0.05 * Math.sin(Date.now() / 500);
		loaderSprite.scale.set(pulse);
	};

	/* --------------------------------------------------------------
	   Initialise ticker & read progress-bar keys
	   -------------------------------------------------------------- */
	$effect(() => {
		/* ---- sprite ready ------------------------------------------------- */
		if (loaderSprite) {
			sound.players.music.play({ name: 'bgm_winlevel_superwin' });

			const ticker = Ticker.shared;
			ticker.add(animateLoader);
			return () => ticker.remove(animateLoader);
		}

		/* ---- assets finished loading ------------------------------------ */
		if (ctx.stateApp.loaded) {
			const tex = ctx.stateApp.loadedAssets.progressBar;
			if (tex) {
				// exact names from progressBar.json
				bgKey    = 'progressBarBackground';
				progKey  = 'progressBar';
				frameKey = 'progressBarFrame';
			}
		}
	});

	/* --------------------------------------------------------------
	   Debug (optional – keep while testing)
	   -------------------------------------------------------------- */
	console.log('LoadingScreen – loaded?', ctx.stateApp.loaded);
	console.log('Progress keys →', { bgKey, progKey, frameKey });
</script>

<!-- ====================== START SCREEN ====================== -->
<FadeContainer show={loadingType === 'start'}>
	<MainContainer>
		<Container
			x={ctx.stateLayoutDerived.mainLayout().width * 0.5}
			y={ctx.stateLayoutDerived.mainLayout().height * 0.5}
		>
			<!-- bind:instance gives the real PIXI.Sprite -->
			<Sprite
				bind:instance={loaderSprite}
				key="loader"
				x={0} y={0}
				anchor={{ x: 0.5, y: 0.5 }}
				scale={1}
			/>

			{#if !ctx.stateApp.loaded}
				<LoadingProgress
					y={250}
					width={1967 * 0.2}
					height={346 * 0.2}
				>
					{#snippet background(sizes: { width: number; height: number })}
						<Sprite key={bgKey} {...sizes} />
					{/snippet}
					{#snippet progress(sizes: { width: number; height: number })}
						<Sprite key={progKey} {...sizes} />
					{/snippet}
					{#snippet frame(sizes: { width: number; height: number })}
						<Sprite key={frameKey} {...sizes} />
					{/snippet}
				</LoadingProgress>
			{/if}
		</Container>
	</MainContainer>
</FadeContainer>

<!-- ====================== PRESS TO CONTINUE ====================== -->
<FadeContainer show={loadingType === 'start' && ctx.stateApp.loaded}>
	<PressToContinue
		onpress={() => {
			loadingType = 'transition';
			sound.players.once.play({ name: 'jng_intro_fs' });
			sound.players.music.fade({
				name: 'bgm_winlevel_superwin',
				from: 0,
				to: 1,
				duration: 2000,
			});
		}}
	/>
</FadeContainer>

<!-- ====================== TRANSITION → BOARD ====================== -->
<FadeContainer show={loadingType === 'transition'}>
	<TransitionAnimation oncomplete={onloaded} />
</FadeContainer>