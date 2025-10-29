<script lang="ts">
	import { MainContainer, OnPressFullScreen } from 'components-layout';
	import { OnHotkey } from 'components-shared';
	import { stateUrlDerived } from 'state-shared';
	import { Sprite } from 'pixi-svelte';

	import { getContext } from '../game/context';
	import { onMount, onDestroy } from 'svelte';

	type Props = {
		onpress: () => void;
	};

	const props: Props = $props();
	const context = getContext();

    // Debug: report mounting
    console.debug('[PressToContinue] mounted');

	// Fallback: if PIXI or OnPressFullScreen doesn't capture the click (some environments
	// or overlay layers can swallow events), listen on the document as a last resort.
	let _docHandler = (e: Event) => {
		console.debug('[PressToContinue] document pointerdown fallback');
		props.onpress();
	};

	let _keyHandler = (e: KeyboardEvent) => {
		if (e.code === 'Space' || e.key === 'Enter') {
			console.debug('[PressToContinue] document keydown fallback', e.code || e.key);
			props.onpress();
		}
	};

	onMount(() => {
		// Use passive listener for pointer events to avoid blocking the main thread
		document.addEventListener('pointerdown', _docHandler, { passive: true });
		document.addEventListener('touchstart', _docHandler, { passive: true });
		document.addEventListener('keydown', _keyHandler);
	});

	onDestroy(() => {
		document.removeEventListener('pointerdown', _docHandler);
		document.removeEventListener('touchstart', _docHandler);
		document.removeEventListener('keydown', _keyHandler);
	});
</script>

<MainContainer alignVertical="bottom">
	<Sprite
		key="pressToContinueText_{stateUrlDerived.lang()}.png"
		width={800}
		height={134}
		anchor={{ x: 0.5, y: 1 }}
		x={context.stateLayoutDerived.mainLayout().width * 0.5}
		y={context.stateLayoutDerived.mainLayout().height}
		interactive={true}
		pointerdown={() => {
			console.debug('[PressToContinue] sprite pointerdown');
			props.onpress();
		}}
	/>
</MainContainer>
<OnHotkey hotkey="Space" onpress={() => props.onpress()} />

<!-- Keep the fullscreen press handler, but also log and keep Sprite pointerdown as a fallback -->
<OnPressFullScreen onpress={() => { console.debug('[PressToContinue] OnPressFullScreen fired'); props.onpress(); }} />
