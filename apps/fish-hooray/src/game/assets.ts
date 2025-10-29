export default {
		// NEW: Added for "loader" error - simple sprite replacement (create loader.png if missing)
	loader: {
		type: 'sprite',
		src: new URL('../../assets/sprites/loadingScreen/loader.png', import.meta.url).href,  // Adjust path to where you save the PNG
		preload: true  // Preload since it's for loading screen
	},
	pressToContinueText: {
		type: 'sprites',
		src: new URL('../../assets/sprites/pressToContinueText/MM_pressanywhere.json', import.meta.url).href,
		preload: true,
	},
	goldFont: {
		type: 'font',
		src: new URL('../../assets/fonts/goldFont/mm_gold.xml', import.meta.url).href,
	},
	goldBlur: {
		type: 'font',
		src: new URL('../../assets/fonts/goldBlur/miningfont_gold_blur.xml', import.meta.url).href,
	},
	silverFont: {
		type: 'font',
		src: new URL('../../assets/fonts/silverFont/mm_silver.xml', import.meta.url).href,
	},
	purpleFont: {
		type: 'font',
		src: new URL('../../assets/fonts/purpleFont/mm_purple.xml', import.meta.url).href,
	},
	// Static sprite fallbacks for backgrounds (kept as-is)
	backgroundImage: {
		type: 'sprite',
		src: new URL('../../assets/sprites/backgroundImage/background_image.webp', import.meta.url).href,
		preload: true,
	},
	backgroundFeatureImage: {
		type: 'sprite',
		src: new URL('../../assets/sprites/backgroundImage/background_image.png', import.meta.url).href,
		preload: true,
	},
	// Your replacement for reels_frame (kept as-is)
	reels_frame: {
		type: 'sprite',  // Use 'sprite' for single PNG—processed as PIXI.Texture
		src: new URL('../../assets/sprites/reelsFrame/reels_frame.png', import.meta.url).href,
		preload: true
	},
	progressBar: {
		type: 'sprites',
		src: new URL('../../assets/sprites/progressBar/progressBar.json', import.meta.url).href,
		preload: true,
	},
	freeSpins: {
		type: 'sprites',
		src: new URL('../../assets/sprites/freeSpins/freeSpins.json', import.meta.url).href,
	},
	winSmall: {
		type: 'sprites',
		src: new URL('../../assets/sprites/winSmall/MM_Localisation_winsmall.json', import.meta.url).href,
	},
	symbolsStatic: {
		type: 'sprites',
		src: new URL('../../assets/sprites/symbolsStatic/symbolsStatic.json', import.meta.url).href,
	},
	coins: {
		type: 'spriteSheet',
		src: new URL('../../assets/sprites/coin/SD2_Coin.json', import.meta.url).href,
	},
	sound: {
		type: 'audio',
		src: new URL('../../assets/audio/sounds.json', import.meta.url).href,
		preload: true,
	},
	// NEW: Added for "S" error - assuming it's a symbol like starfish (create S.png if missing)
	// S: {
	// 	type: 'sprite',
	// 	src: new URL('../../assets/sprites/symbols/S.png', import.meta.url).href,  // Adjust path; or use a frame from symbolsStatic if available
	// 	preload: true  // Preload for quick symbol rendering
	// },
	// TIP: If "S" is part of symbolsStatic.json (as a frame), you could remove this and update your symbol code to use sheet frames instead, e.g., texture = PIXI.Texture.from('symbolsStatic/S')
} as const;