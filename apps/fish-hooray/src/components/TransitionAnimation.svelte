<!-- <script lang="ts">
	import { SpineProvider, SpineTrack } from 'pixi-svelte';
	import { getContext } from '../game/context';

	type Props = {
		oncomplete: () => void;
	};

	const props: Props = $props();
	const context = getContext();
</script> -->

<!-- <SpineProvider
	key="transition"
	x={context.stateLayoutDerived.canvasSizes().width * 0.5}
	y={context.stateLayoutDerived.canvasSizes().height * 0.5}
	height={context.stateLayoutDerived.canvasSizes().height * 1.7}
>
	<SpineTrack
		trackIndex={0}
		animationName={'animation'}
		listener={{
			complete: props.oncomplete,
		}}
	/>
</SpineProvider> -->










<!-- 


<script lang="ts">
	import { Container, Graphics } from 'pixi-svelte';
	import { Ticker } from '@pixi/ticker';
	import { getContext } from '../game/context';

	type Props = { oncomplete: () => void };
	const { oncomplete }: Props = $props();
	const ctx = getContext();

	let progress = $state(0);

	$effect(() => {
		const duration = 1500; // ms
		const start = performance.now();

		const tick = (delta: number) => {
			const elapsed = performance.now() - start;
			progress = Math.min(elapsed / duration, 1);

			if (progress >= 1) {
				Ticker.shared.remove(tick);
				oncomplete();
			}
		};

		Ticker.shared.add(tick);
		return () => Ticker.shared.remove(tick);
	});
</script> -->

<!-- Simple dark-blue fade-out (feel free to replace with bubbles) -->
<!-- <Container
	x={ctx.stateLayoutDerived.canvasSizes().width * 0.5}
	y={ctx.stateLayoutDerived.canvasSizes().height * 0.5}
	anchor={{ x: 0.5, y: 0.5 }}
	scale={1 + 0.2 * Math.sin(progress * Math.PI)}
	alpha={1 - progress}
>
	<Graphics
		width={ctx.stateLayoutDerived.canvasSizes().width}
		height={ctx.stateLayoutDerived.canvasSizes().height}
		fill={0x001133}
		alpha={0.7}
	/>
</Container> -->


<script lang="ts">
	import { Container, Graphics } from 'pixi-svelte';
	import { Ticker } from '@pixi/ticker';
	import { getContext } from '../game/context';

	type Props = { oncomplete: () => void };
	const { oncomplete }: Props = $props();
	const ctx = getContext();

	let progress = $state(0);

	$effect(() => {
		const DURATION = 1500; // ms
		const start = performance.now();

		const tick = (delta: number) => {
			const elapsed = performance.now() - start;
			progress = Math.min(elapsed / DURATION, 1);

			if (progress >= 1) {
				Ticker.shared.remove(tick);
				oncomplete();               // ← hides LoadingScreen
			}
		};

		Ticker.shared.add(tick);
		return () => Ticker.shared.remove(tick);
	});
</script>

<Container
	x={ctx.stateLayoutDerived.canvasSizes().width * 0.5}
	y={ctx.stateLayoutDerived.canvasSizes().height * 0.5}
	anchor={{ x: 0.5, y: 0.5 }}
	scale={1 + 0.2 * Math.sin(progress * Math.PI)}
	alpha={1 - progress}
>
	<Graphics
		width={ctx.stateLayoutDerived.canvasSizes().width}
		height={ctx.stateLayoutDerived.canvasSizes().height}
		fill={0x001133}
		alpha={0.7}
	/>
</Container>