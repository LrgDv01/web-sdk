








<script lang="ts">
	import { Container } from 'pixi-svelte';  // No Sprite needed for basic
	import { getContext } from '../game/context';
	import { Ticker, Graphics } from '@pixi/core';  // Add Graphics for fill

	type Props = {
		oncomplete: () => void;
	};

	const props: Props = $props();
	const context = getContext();

	let animProgress = $state(0);

	$effect(() => {
		const duration = 1500;  // FIXED: 1.5s delay for visible anim
		const startTime = performance.now();

		const ticker = Ticker.shared;
		const animate = (delta) => {
			const elapsed = (performance.now() - startTime) / duration;
			animProgress = Math.min(elapsed, 1);

			// Pulse + fade logic (applied in markup)
			if (animProgress >= 1) {
				ticker.remove(animate);
				props.oncomplete();  // Now delayed – reveals board!
			}
		};

		ticker.add(animate);

		return () => ticker.remove(animate);
	});
</script>

<!-- FIXED: Visible full-screen fade (black overlay pulse/fade out) -->
<Container
	x={context.stateLayoutDerived.canvasSizes().width * 0.5}
	y={context.stateLayoutDerived.canvasSizes().height * 0.5}
	scale={1 + 0.2 * Math.sin(animProgress * Math.PI)}  
	alpha={1 - animProgress}  
	anchor={{ x: 0.5, y: 0.5 }}
>
	<Graphics
		width={context.stateLayoutDerived.canvasSizes().width}
		height={context.stateLayoutDerived.canvasSizes().height}
		fill={0x000000}  
		alpha={0.7}  
	/>
</Container>