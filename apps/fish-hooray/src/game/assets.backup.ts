export default {

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
	
	// Static sprite fallbacks for projects that prefer PNG/WebP backgrounds instead of Spine
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

	// Replace your 'reels_frame' with this
	'reels_frame': {
		type: 'sprite',  // Use 'image' for single PNG—processed as PIXI.Texture (avoids "no process method" error)
		src: new URL('../../assets/sprites/reelsFrame/reels_frame.png', import.meta.url).href,  // Absolute URL for Vite/Pixi loading
		preload: true  // Load early
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
} as const;
