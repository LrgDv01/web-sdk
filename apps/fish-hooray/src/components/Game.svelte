<script lang="ts">
  import { Graphics, Text } from 'pixi-svelte';
  import { onMount, tick } from 'svelte';  // For lifecycle and async updates

  import { EnablePixiExtension } from 'components-pixi';
  import { Button, EnableHotkey } from 'components-shared';
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

  onMount(() => (context.stateLayout.showLoadingScreen = true));

  context.eventEmitter.subscribeOnMount({
    buyBonusConfirm: () => {
      stateModal.modal = { name: 'buyBonusConfirm' };
    },
    
  });

// ADDED
  // // Add or override assets here (run once on mount)
  // onMount(() => {
  //   // Remove the old Spine asset to stop .json loading error
  //   if (context.stateApp.assets['reelhouse']) {
  //     delete context.stateApp.assets['reelhouse'];  // 'reelhouse' is the key for the glowing frame animation
  //   }

  //   // Add your new static PNG
  //   context.stateApp.assets['reels_frame'] = {
  //     type: 'image',  // Or 'texture'/'sprite'—check getProcessed in assetLoad.ts for supported types
  //     src: '/assets/sprites/reelsFrame/reels_frame.png',  // Absolute path for dev/server
  //     preload: true  // Load early (optional, but good for frames)
  //   };
  // });
 // ADDED END

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
            fontWeight: '700',
            lineHeight: REM * 2,
            fill: 0xffffff,
            stroke: { thickness: 2, color: 0x003366 },
            align: 'left'
          }}
        />
      {/snippet}
      <!-- {#snippet bottomBar()}
          <Button name="POGI"/>
      {/snippet} -->
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