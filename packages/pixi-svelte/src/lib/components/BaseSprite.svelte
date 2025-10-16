<script lang="ts" module>
	import * as PIXI from 'pixi.js';

	import type { OverwriteCursor } from '../types';

	export type Props = OverwriteCursor<PIXI.SpriteOptions> & {
		isMask?: boolean;
	};
</script>

<script lang="ts">
	import { propsSyncEffect } from '../utils.svelte';
	import { getContextParent } from '../context.svelte';

	const props: Props = $props();

	const parentContext = getContextParent();
	// Ensure we never construct a PIXI.Sprite with an undefined texture.
	// If props.texture is undefined at creation time, fallback to PIXI.Texture.EMPTY.
	const sprite = new PIXI.Sprite(props.texture ?? PIXI.Texture.EMPTY);

	// Only sync primitive/simple props automatically. Complex fields that have
	// framework-specific setters (texture, anchor, scale, width, height, pivot)
	// are handled explicitly below to avoid runtime setter exceptions.
	propsSyncEffect({ props, target: sprite, ignore: ['isMask', 'texture', 'anchor', 'scale', 'width', 'height', 'pivot'] });

	// Guarded assignment for isMask -> parent mask
	$effect(() => {
		if (props.isMask !== undefined) {
			parentContext.parent.mask = props.isMask ? sprite : null;
		}
	});

	// Guarded assignment for texture: ensure a valid PIXI.Texture is used
	$effect(() => {
		try {
			let tex: any = props.texture ?? PIXI.Texture.EMPTY;
			// If it's a processed sprite sheet entry it may be an object containing a
			// `textures` map or other nested shape. Try to find a real PIXI.Texture.
			if (tex && typeof tex === 'object') {
				// Common case: sprites type stored as { textures: { key: Texture, ... } }
				if (tex.textures && Object.keys(tex.textures).length > 0) {
					const first = Object.values(tex.textures)[0];
					if (first && first instanceof PIXI.Texture) tex = first;
				}
				// Some loaders may place texture under `.texture` property
				if (tex.texture && tex.texture instanceof PIXI.Texture) tex = tex.texture;
			}
			// Final guard: ensure we have a PIXI.Texture with an `orig` property
			if (!tex || !(tex instanceof PIXI.Texture) || tex.orig === undefined) {
				tex = PIXI.Texture.EMPTY;
			}
			sprite.texture = tex;
		} catch (err) {
			console.warn('BaseSprite: failed to assign texture', err);
		}
	});

	// Guarded assignment for anchor/scale/width/height/pivot
	$effect(() => {
		try {
			if (props.anchor !== undefined) sprite.anchor.set(typeof props.anchor === 'number' ? props.anchor : (props.anchor.x ?? 0), typeof props.anchor === 'number' ? props.anchor : (props.anchor.y ?? 0));
		} catch (e) {
			console.warn('BaseSprite: failed to set anchor', e);
		}
		try {
			if (props.scale !== undefined) {
				if (typeof props.scale === 'number') sprite.scale.set(props.scale, props.scale);
				else sprite.scale.set(props.scale.x ?? 1, props.scale.y ?? 1);
			}
		} catch (e) {
			console.warn('BaseSprite: failed to set scale', e);
		}
		try {
			if (props.width !== undefined) sprite.width = props.width;
			if (props.height !== undefined) sprite.height = props.height;
		} catch (e) {
			console.warn('BaseSprite: failed to set width/height', e);
		}
		try {
			if (props.pivot !== undefined) sprite.pivot.set(props.pivot.x ?? 0, props.pivot.y ?? 0);
		} catch (e) {
			console.warn('BaseSprite: failed to set pivot', e);
		}
	});

	parentContext.addToParent(sprite);
</script>
