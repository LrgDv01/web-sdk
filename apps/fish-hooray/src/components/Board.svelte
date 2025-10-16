<script lang="ts" module>
	import type { RawSymbol, Position } from '../game/types';

	export type EmitterEventBoard =
		| { type: 'boardSettle'; board: RawSymbol[][] }
		| { type: 'boardShow' }
		| { type: 'boardHide' }
		| {
				type: 'boardWithAnimateSymbols';
				symbolPositions: Position[];
		  }
		| {
				type: 'showWinLine';
				positions: Position[];
		  }
		| { type: 'hideWinLine' };
</script>

<script lang="ts">
	import { waitForResolve } from 'utils-shared/wait';
	import { BoardContext } from 'components-shared';

	import { getContext } from '../game/context';
	import BoardContainer from './BoardContainer.svelte';
	import BoardMask from './BoardMask.svelte';
	import BoardBase from './BoardBase.svelte';
	import WinLine from './WinLine.svelte';

	const context = getContext();

	let show = $state(true);
	let currentWinPositions: Position[] | null = $state(null);

	context.eventEmitter.subscribeOnMount({
		stopButtonClick: () => context.stateGameDerived.enhancedBoard.stop(),
		boardSettle: ({ board }) => context.stateGameDerived.enhancedBoard.settle(board),
		boardShow: () => (show = true),
		boardHide: () => (show = false),
		showWinLine: ({ positions }) => {
			currentWinPositions = positions;
		},
		hideWinLine: () => {
			currentWinPositions = null;
		},
		boardWithAnimateSymbols: async ({ symbolPositions }) => {
			const getPromises = () =>
				symbolPositions.map(async (position) => {
					try {
						const reelSymbol = context.stateGame.board[position.reel].reelState.symbols[position.row];
						reelSymbol.symbolState = 'win';
						// Instrument: set oncomplete and install a small fallback to avoid permanent hang
						await waitForResolve((resolve) => {
							console.debug(`[Board] set oncomplete for reel=${position.reel} row=${position.row}`);
							// Fallback: if not resolved within 2s, resolve anyway and log a warning
							const timer = setTimeout(() => {
								console.warn(`[Board] fallback resolving oncomplete for reel=${position.reel} row=${position.row}`);
								resolve();
							}, 2000);
							// Wrap the real resolve so we can clear the timer when invoked
							reelSymbol.oncomplete = () => {
								console.debug(`[Board] oncomplete invoked for reel=${position.reel} row=${position.row}`);
								clearTimeout(timer);
								resolve();
							};
						});
						reelSymbol.symbolState = 'postWinStatic';
					} catch (error) {
						console.error('Animation failed for position:', position, error);
            // Still resolve to unstick
          }
				});

			await Promise.all(getPromises());
		},
	});

	context.stateGameDerived.enhancedBoard.readyToSpinEffect();
</script>

{#if show}
	<BoardContext animate={false}>
		<BoardContainer>
			<BoardMask />
			<BoardBase />
		</BoardContainer>
	</BoardContext>

	<BoardContext animate={true}>
		<BoardContainer>
			<BoardBase />
			{#if currentWinPositions}
				<WinLine positions={currentWinPositions} />
			{/if}
		</BoardContainer>
	</BoardContext>
{/if}
