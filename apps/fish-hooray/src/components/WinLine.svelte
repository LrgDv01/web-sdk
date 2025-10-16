<script lang="ts">
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { Graphics } from 'pixi-svelte';
  import { SYMBOL_SIZE } from '../game/constants';

  export let positions: { reel: number; row: number }[] = [];
  export let color = 0xffd700; // Default golden color for win lines
  export let lineWidth = 6;
  export let duration = 300;

  const progress = tweened(0, { duration, easing: cubicOut });

  // Start the drawing animation when positions change
  $: if (positions && positions.length >= 2) {
    // restart animation
    progress.set(0);
    // small next tick to ensure tween picks up
    setTimeout(() => progress.set(1), 10);
  }

  // draw function is re-created whenever reactive values used inside change
  $: draw = (g: PIXI.Graphics) => {
    if (!positions || positions.length < 2) return;
    const p = $progress ?? 1;
    g.clear();
    g.lineStyle(lineWidth, color, 0.95);

    const symbolSize = SYMBOL_SIZE;
    const start = positions[0];
    const end = positions[positions.length - 1];

    const startX = start.reel * symbolSize + symbolSize / 2;
    const startY = start.row * symbolSize + symbolSize / 2;
    const endX = end.reel * symbolSize + symbolSize / 2;
    const endY = end.row * symbolSize + symbolSize / 2;

    const currentEndX = startX + (endX - startX) * p;
    const currentEndY = startY + (endY - startY) * p;

    g.moveTo(startX, startY);
    g.lineTo(currentEndX, currentEndY);
  };
</script>

<!-- Use the pixi-svelte Graphics component with a reactive draw prop -->
<Graphics {draw} />