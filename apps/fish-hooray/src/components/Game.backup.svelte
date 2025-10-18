<script lang="ts">
  import { Graphics, Text } from 'pixi-svelte';
  import { onMount, tick } from 'svelte';  // For lifecycle and async updates

  import { EnablePixiExtension } from 'components-pixi';
  import { EnableHotkey } from 'components-shared';
  import { MainContainer } from 'components-layout';
  import { App, REM } from 'pixi-svelte';
  import { stateModal } from 'state-shared';

  import { UI, UiGameName } from 'components-ui-pixi';
  import { GameVersion, Modals } from 'components-ui-html';

  import { getContext } from '../game/context';
  import EnableSound from './EnableSound.svelte';
  import EnableGameActor from './EnableGameActor.svelte';
  import ResumeBet from './ResumeBet.svelte';
  import Sound from './Sound.svelte';
  import Background from './Background.svelte';
  import LoadingScreen from './LoadingScreen.svelte';
  import BoardFrame from './BoardFrame.svelte';
  import Board from './Board.svelte';
  import Anticipations from './Anticipations.svelte';
  import Win from './Win.svelte';
  import FreeSpinIntro from './FreeSpinIntro.svelte';
  import FreeSpinCounter from './FreeSpinCounter.svelte';
  import FreeSpinOutro from './FreeSpinOutro.svelte';
  import Transition from './Transition.svelte';
  import I18nTest from './I18nTest.svelte';

  const context = getContext();

  // Game state (unchanged)
  let balance = 0.00;
  let win = 0.00;
  let bet = 1.00;
  let isTurbo = false;

  function handleSpin() {
    console.log('Spin clicked!');
    // TODO: context.eventEmitter.emit('spinStart');
  }

  $: balanceText = `$${balance.toFixed(2)}`;
  $: winText = `$${win.toFixed(2)}`;
  $: betText = `$${bet.toFixed(2)}`;

  // NEW: Make button labels dynamic variables (for easy changes + reactivity)
  let menuLabel = "MENU";
  let buyBonusLabel = "BUY BONUS";
  let autoLabel = "AUTO";
  let spinLabel = "SPIN";
  let betLabel = "BET";
  let turboLabel = "TURBO";

  // Bindings for instances (unchanged)
  let bgGraphics: any;
  let menuGraphics: any;
  let buyBonusGraphics: any;
  let autoGraphics: any;
  let spinGraphics: any;
  let betGraphics: any;
  let turboGraphics: any;

  // Text instances (unchanged)
  let balanceTextNode: any;
  let winTextNode: any;
  let betTextNode: any;
  let menuTextNode: any;
  let buyBonusTextNode: any;
  let autoTextNode: any;
  let spinTextNode: any;
  let betTextNode2: any;  // For the "BET" button label
  let turboTextNode: any;

  // Track current size (unchanged)
  let currentSize = { width: 0, height: 0 };

  // Draw function (updated to use dynamic labels)
  function drawBottomBar() {
    const { width, height } = context.stateLayoutDerived.canvasSizes();
    const barHeight = 120;
    const buttonY = height - 40;

    // Background (unchanged)
    if (bgGraphics) {
      bgGraphics.clear();
      bgGraphics.beginFill(0x003366, 0.8);
      bgGraphics.drawRoundedRect(0, height - barHeight, width, barHeight, 20);
      bgGraphics.endFill();
      bgGraphics.lineStyle(2, 0x00ccff, 0.5);
      bgGraphics.drawRoundedRect(2, height - barHeight + 2, width - 4, barHeight - 4, 20);
    }

    // Display Texts (unchanged)
    if (balanceTextNode) {
      balanceTextNode.x = width * 0.2;
      balanceTextNode.y = height - 60;
    }
    if (winTextNode) {
      winTextNode.x = width * 0.5;
      winTextNode.y = height - 60;
    }
    if (betTextNode) {
      betTextNode.x = width * 0.8;
      betTextNode.y = height - 60;
    }

    // Button Graphics and Texts (updated to center texts in buttons)
    if (menuGraphics) {
      menuGraphics.clear();
      menuGraphics.beginFill(0x004488, 1);
      menuGraphics.drawRoundedRect(0, 0, 80, 50, 10);
      menuGraphics.endFill();
      menuGraphics.x = width * 0.05;
      menuGraphics.y = buttonY;
      if (menuTextNode) {
        menuTextNode.text = menuLabel;  // NEW: Use dynamic label
        menuTextNode.x = menuGraphics.x + 40;  // Center
        menuTextNode.y = menuGraphics.y + 25;
      }
    }

    if (buyBonusGraphics) {
      buyBonusGraphics.clear();
      buyBonusGraphics.beginFill(0x00cc66, 1);
      buyBonusGraphics.drawRoundedRect(0, 0, 100, 50, 10);
      buyBonusGraphics.endFill();
      buyBonusGraphics.x = width * 0.15;
      buyBonusGraphics.y = buttonY;
      if (buyBonusTextNode) {
        buyBonusTextNode.text = buyBonusLabel;
        buyBonusTextNode.x = buyBonusGraphics.x + 50;
        buyBonusTextNode.y = buyBonusGraphics.y + 25;
      }
    }

    if (autoGraphics) {
      autoGraphics.clear();
      autoGraphics.beginFill(0x6666ff, 1);
      autoGraphics.drawRoundedRect(0, 0, 60, 50, 10);
      autoGraphics.endFill();
      autoGraphics.x = width * 0.35;
      autoGraphics.y = buttonY;
      if (autoTextNode) {
        autoTextNode.text = autoLabel;
        autoTextNode.x = autoGraphics.x + 30;
        autoTextNode.y = autoGraphics.y + 25;
      }
    }

    if (spinGraphics) {
      spinGraphics.clear();
      spinGraphics.beginFill(0xff6600, 1);
      spinGraphics.drawRoundedRect(0, 0, 100, 60, 15);
      spinGraphics.endFill();
      spinGraphics.x = width * 0.5;
      spinGraphics.y = buttonY;
      if (spinTextNode) {
        spinTextNode.text = spinLabel;
        spinTextNode.x = spinGraphics.x + 50;
        spinTextNode.y = spinGraphics.y + 30;
      }
    }

    if (betGraphics) {
      betGraphics.clear();
      betGraphics.beginFill(0x004488, 1);
      betGraphics.drawRoundedRect(0, 0, 60, 50, 10);
      betGraphics.endFill();
      betGraphics.x = width * 0.65;
      betGraphics.y = buttonY;
      if (betTextNode2) {
        betTextNode2.text = betLabel;
        betTextNode2.x = betGraphics.x + 30;
        betTextNode2.y = betGraphics.y + 25;
      }
    }

    if (turboGraphics) {
      turboGraphics.clear();
      const color = isTurbo ? 0xff0000 : 0x666666;
      turboGraphics.beginFill(color, 1);
      turboGraphics.drawRoundedRect(0, 0, 80, 50, 10);
      turboGraphics.endFill();
      turboGraphics.x = width * 0.75;
      turboGraphics.y = buttonY;
      if (turboTextNode) {
        turboTextNode.text = turboLabel;
        turboTextNode.x = turboGraphics.x + 40;
        turboTextNode.y = turboGraphics.y + 25;
      }
    }
  }

  onMount(() => {
    context.stateLayout.showLoadingScreen = true;

    context.eventEmitter.subscribeOnMount({
      buyBonusConfirm: () => {
        stateModal.modal = { name: 'buyBonusConfirm' };
      },
    });

    // Initial draw
    drawBottomBar();

    // TODO: Subscribe to updates
  });

  // Reactivity for resize (unchanged)
  $: {
    const { width, height } = context.stateLayoutDerived.canvasSizes();
    if (width !== currentSize.width || height !== currentSize.height) {
      currentSize = { width, height };
      drawBottomBar();
    }
  }

  // FIXED: Reactivity for dynamic labels + turbo (re-draw on any change)
  $: if (menuLabel || buyBonusLabel || autoLabel || spinLabel || betLabel || turboLabel || isTurbo) {
    drawBottomBar();
  }
</script>

<App>
  <EnableSound />
  <EnableHotkey />
  <EnableGameActor />
  <EnablePixiExtension />

  <Background useStaticBackground={true} />

  {#if context.stateLayout.showLoadingScreen}
    <LoadingScreen onloaded={() => (context.stateLayout.showLoadingScreen = false)} />
  {:else}
    <ResumeBet />
    <Sound />

    <MainContainer>
      <BoardFrame />
    </MainContainer>

    <MainContainer>
      <Board />
      <Anticipations />
    </MainContainer>

    <UI>
      {#snippet gameName()}
        <UiGameName name="LINES GAME" />
      {/snippet}
      {#snippet logo()}
        <Text
          anchor={{ x: 1, y: 0 }}
          text="FISH HOORAY"
          style={{
            fontFamily: "Pacifico, 'Fredoka One', sans-serif",
            fontSize: REM * 1.5,
            fontWeight: '600',
            lineHeight: REM * 2,
            fill: 0xffffff,
            stroke: { thickness: 2, color: 0x003366 },
            align: 'left'
          }}
        />
      {/snippet}
      {#snippet bottomBar()}
        <!-- FIXED: Background Graphics -->
        <Graphics
          bind:this={bgGraphics}
          interactive={false}
          draw={(g: any) => {}}  
        />

        <!-- Display Texts (unchanged) -->
        <Text
          bind:this={balanceTextNode}
          text={balanceText}
          anchor={{ x: 0.5, y: 0.5 }}
          style={{
            fontFamily: 'Arial, sans-serif',
            fontSize: 24,
            fontWeight: 'bold',
            fill: 0xffffff,
            stroke: { thickness: 2, color: 0x000000 },
            align: 'center'
          }}
        />
        <Text
          bind:this={winTextNode}
          text={winText}
          anchor={{ x: 0.5, y: 0.5 }}
          style={{
            fontFamily: 'Arial, sans-serif',
            fontSize: 24,
            fontWeight: 'bold',
            fill: 0xffd700,
            stroke: { thickness: 2, color: 0x000000 },
            align: 'center'
          }}
        />
        <Text
          bind:this={betTextNode}
          text={betText}
          anchor={{ x: 0.5, y: 0.5 }}
          style={{
            fontFamily: 'Arial, sans-serif',
            fontSize: 24,
            fontWeight: 'bold',
            fill: 0xffffff,
            stroke: { thickness: 2, color: 0x000000 },
            align: 'center'
          }}
        />

        <!-- FIXED: Added back Menu Graphics + Text -->
        <Graphics
          bind:this={menuGraphics}
          interactive={true}
          cursor="pointer"
          draw={(g: any) => {}} 
          on:pointertap={() => console.log('Menu clicked!')}
        />
        <Text
          bind:this={menuTextNode}
          text={menuLabel} 
          anchor={{ x: 0.5, y: 0.5 }}
          style={{ fontSize: 16, fill: 0xffffff, fontWeight: 'bold' }}
        />

        <!-- FIXED: Buy Bonus -->
        <Graphics
          bind:this={buyBonusGraphics}
          interactive={true}
          cursor="pointer"
          draw={(g: any) => {}}
          on:pointertap={() => console.log('Buy Bonus clicked!')}
        />
        <Text
          bind:this={buyBonusTextNode}
          text={buyBonusLabel}
          anchor={{ x: 0.5, y: 0.5 }}
          style={{ fontSize: 14, fill: 0xffffff, fontWeight: 'bold' }}
        />

        <!-- FIXED: Auto -->
        <Graphics
          bind:this={autoGraphics}
          interactive={true}
          cursor="pointer"
          draw={(g: any) => {}}
          on:pointertap={() => console.log('Auto clicked!')}
        />
        <Text
          bind:this={autoTextNode}
          text={autoLabel}
          anchor={{ x: 0.5, y: 0.5 }}
          style={{ fontSize: 16, fill: 0xffffff, fontWeight: 'bold' }}
        />

        <!-- FIXED: Spin -->
        <Graphics
          bind:this={spinGraphics}
          interactive={true}
          cursor="pointer"
          draw={(g: any) => {}}
          on:pointertap={handleSpin}
        />
        <Text
          bind:this={spinTextNode}
          text={spinLabel}
          anchor={{ x: 0.5, y: 0.5 }}
          style={{ fontSize: 20, fill: 0xffffff, fontWeight: 'bold' }}
        />

        <!-- FIXED: Bet -->
        <Graphics
          bind:this={betGraphics}
          interactive={true}
          cursor="pointer"
          draw={(g: any) => {}}
          on:pointertap={() => console.log('Bet clicked!')}
        />
        <Text
          bind:this={betTextNode2}
          text={betLabel}
          anchor={{ x: 0.5, y: 0.5 }}
          style={{ fontSize: 16, fill: 0xffffff, fontWeight: 'bold' }}
        />

        <!-- FIXED: Turbo -->
        <Graphics
          bind:this={turboGraphics}
          interactive={true}
          cursor="pointer"
          draw={(g: any) => {}}
          on:pointertap={() => { isTurbo = !isTurbo; console.log('Turbo:', isTurbo); }}
        />
        <Text
          bind:this={turboTextNode}
          text={turboLabel}
          anchor={{ x: 0.5, y: 0.5 }}
          style={{ fontSize: 14, fill: 0xffffff, fontWeight: 'bold' }}
        />
      {/snippet}
    </UI>
    <Win />
    <FreeSpinIntro />
    {#if ['desktop', 'landscape'].includes(context.stateLayoutDerived.layoutType())}
      <FreeSpinCounter />
    {/if}
    <FreeSpinOutro />
    <Transition />
    <!-- <I18nTest /> -->
  {/if}
</App>

<Modals>
  {#snippet version()}
    <GameVersion version="0.0.0" />
  {/snippet}
</Modals>