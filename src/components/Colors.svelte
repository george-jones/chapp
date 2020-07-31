<style>
	.chinese {
		font-size: 48px;
	}

	.pickableColor {
		width: 60px;
		height: 60px;
		border-radius: 10px;
		display: inline-block;
		margin: 10px;
		cursor: pointer;
		border-right: 3px solid rgba(20,20,20,0.5);
		border-bottom: 3px solid rgba(20,20,20,0.5);
	}

	.shownColor {
		width: 120px;
		height: 120px;
		border-radius: 10px;
		display: inline-block;
		margin: 10px;
		border-right: 3px solid rgba(20,20,20,0.5);
		border-bottom: 3px solid rgba(20,20,20,0.5);
	}

	.invisible {
		opacity: 0;
	}

	input {
		margin: 5px;
		cursor: pointer;
	}
</style>

<script>
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import { WordLists } from '../wordlists.js';
	import { rand } from '../rand.js';
	import { testingMode } from '../globals.js';
	import { stepSummaries } from '../globals.js';

	const dispatch = createEventDispatcher();
	let color;
	let colorNum = -1;
	let listNum = 0;
	let pickingColor = true;
	let allColors = rand.shuffle(WordLists.Colors);
	let pickedColor;
	let pickedClass;
	let displayedColorClass = '';
	let currentFail = false;
	let numRight = 0;
	let numTotal = 0;
	let finished = false;

	if (testingMode) {
		allColors = allColors.slice(0, 2);
	}

	let colors = [
		rand.shuffle(allColors),
		rand.shuffle(allColors)
	];

	function pickColor (event) {
		let index = parseInt(event.target.getAttribute('data-index'), 10);
		let colorGroup = pickingColor? 0 : 1;

		if (pickedClass === 'pickedRight') {
			// bail early for fast clickers after success
			return false;
		}

		if (!currentFail) {
			numTotal++;
		}

		pickedColor = allColors[index];
		if (pickedColor.english === colors[colorGroup][colorNum].english) {
			if (!currentFail) {
				numRight++;
			} else {
				currentFail = false;
			}
			pickedClass = 'pickedRight';
			displayedColorClass = 'invisible';

			window.setTimeout(nextColor, 1000);
		} else {
			pickedClass = 'pickedWrong';
			currentFail = true;
		}
	}

	function nextColor () {
		colorNum++;
		if (colorNum >= allColors.length) {
			if (pickingColor) {
				allColors = rand.shuffle(allColors);
				pickingColor = false;
				colorNum = 0;
			} else {
				finish();
				return;
			}
		}

		pickedColor = undefined;
		pickedClass = undefined;

		if (pickingColor) {
			color = colors[0][colorNum];
		} else {
			displayedColorClass = '';
			color = colors[1][colorNum];
		}
	}

	function finish () {
		// How to communicate with parent?
		let summary = `${numRight} / ${numTotal}`;
		finished = true;
		stepSummaries.update(function (v) {
			v['Colors'] = summary;
			return v;
		});
		dispatch('finished');
	}

	nextColor();

</script>

<h1>Colors</h1>

{#if !finished}
	{#if pickingColor}
		<div class="chinese" title="{color.pinyin}">{color.chinese}</div>
		{#each allColors as c, index}
			<div class="pickableColor" style="background-color: {c.hex}" title="{c.english}" on:click={pickColor} data-index="{index}"></div>
		{/each}
		{#if pickedColor}
			<div in:fade class="chinese {pickedClass}"><span>{pickedColor.chinese} {pickedColor.pinyin}</span></div>
		{/if}
	{:else}
		<div class="{displayedColorClass}">
			<div in:fade class="shownColor" style="background-color: {color.hex}" title="{color.english}"></div>
		</div>
		{#each allColors as c, index}
			<input class="colorNameButton chinese" type="button" value="{c.chinese}" on:click={pickColor} data-index="{index}" title="{c.pinyin}" />
		{/each}
		{#if pickedColor}
			<div in:fade class="chinese {pickedClass}"><span>{pickedColor.chinese} {pickedColor.pinyin} {pickedColor.english}</span></div>
		{/if}
	{/if}
{/if}

{#if numTotal > 0}
	<div class="score">
		{numRight} / {numTotal}
	</div>
{/if}