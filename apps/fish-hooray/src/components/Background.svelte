<script lang="ts">
	import { Rectangle, SpineProvider, SpineTrack, Sprite } from 'pixi-svelte';
	import { FadeContainer } from 'components-pixi';
	import { SECOND } from 'constants-shared/time';

	import { getContext } from '../game/context';

	// use $props() in runes mode instead of `export let`
	const { useStaticBackground = false }: { useStaticBackground?: boolean } = $props();

	const context = getContext();
	const canvasSizes = $derived(context.stateLayoutDerived.canvasSizes());

	// textures for static backgrounds (if loaded)
	const bgTexture = $derived(context.stateApp.loadedAssets?.backgroundImage);
	const bgFeatureTexture = $derived(context.stateApp.loadedAssets?.backgroundFeatureImage);

	// compute cover dimensions (preserve aspect ratio, fill canvas)
	const bgCover = $derived.by(() => {
		const cs = canvasSizes;
		const tex: any = bgTexture;
		const tn = tex ? { w: tex.orig?.width ?? tex.width ?? 1, h: tex.orig?.height ?? tex.height ?? 1 } : null;
		if (!cs || !tn) return { width: cs.width, height: cs.height, x: cs.width / 2, y: cs.height / 2 };
		const scale = Math.max(cs.width / tn.w, cs.height / tn.h);
		return { width: tn.w * scale, height: tn.h * scale, x: cs.width / 2, y: cs.height / 2 };
	});

	const bgFeatureCover = $derived.by(() => {
		const cs = canvasSizes;
		const tex: any = bgFeatureTexture;
		const tn = tex ? { w: tex.orig?.width ?? tex.width ?? 1, h: tex.orig?.height ?? tex.height ?? 1 } : null;
		if (!cs || !tn) return { width: cs.width, height: cs.height, x: cs.width / 2, y: cs.height / 2 };
		const scale = Math.max(cs.width / tn.w, cs.height / tn.h);
		return { width: tn.w * scale, height: tn.h * scale, x: cs.width / 2, y: cs.height / 2 };
	});
	const backgroundProps = $derived(
		context.stateLayoutDerived.normalBackgroundLayout({ scale: 0.5 }),
	);
	// For static sprites we want a larger/fuller background so compute props with a bigger scale
	const spriteBackgroundProps = $derived(
		context.stateLayoutDerived.normalBackgroundLayout({ scale: 1 }),
	);
	const showBaseBackground = $derived(context.stateGame.gameType === 'basegame');
	const showFeatureBackground = $derived(context.stateGame.gameType === 'freegame');

	// helpers to detect if Spine assets are loaded; if not, we'll fallback to Sprite
	const hasForegroundSpine = $derived(
		context.stateApp.loadedAssets?.foregroundAnimation,
	);
	const hasFeatureSpine = $derived(
		context.stateApp.loadedAssets?.foregroundFeatureAnimation,
	);
</script>

<Rectangle {...context.stateLayoutDerived.canvasSizes()} backgroundColor={0x000000} zIndex={-3} />

<FadeContainer show={showBaseBackground} duration={SECOND} zIndex={-2}>
	{#if useStaticBackground || !hasForegroundSpine}
		<!-- Static sprite fallback for base background (cover) -->
	<Sprite key="backgroundImage" {...spriteBackgroundProps} anchor={{ x: 0.5, y: 0.5 }} width={bgCover.width} height={bgCover.height} />
	{:else}
		<SpineProvider key="foregroundAnimation" {...backgroundProps}>
			<SpineTrack trackIndex={0} animationName={'idle'} loop />
		</SpineProvider>
		<SpineProvider key="foregroundAnimation" {...backgroundProps}>
			<SpineTrack trackIndex={0} animationName={'dust'} loop />
		</SpineProvider>
	{/if}
</FadeContainer>

<FadeContainer show={showFeatureBackground} duration={SECOND} zIndex={-1}>
	{#if useStaticBackground || !hasFeatureSpine}
		<!-- Static sprite fallback for feature/freegame background (cover) -->
	<Sprite key="backgroundFeatureImage" {...spriteBackgroundProps} anchor={{ x: 0.5, y: 0.5 }} width={bgFeatureCover.width} height={bgFeatureCover.height} />
	{:else}
		<SpineProvider key="foregroundFeatureAnimation" {...backgroundProps}>
			<SpineTrack trackIndex={0} animationName={'idle'} loop />
		</SpineProvider>
		<SpineProvider key="foregroundFeatureAnimation" {...backgroundProps}>
			<SpineTrack trackIndex={0} animationName={'dust'} loop />
		</SpineProvider>
	{/if}
</FadeContainer>
