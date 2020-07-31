<style>
	.char button {
		margin: 10px;
		border-radius: 5px;
		padding: 5px;
		cursor: pointer;
		font-size: 18px;
		border: 1px solid #333;
	}

	.char button.picked {
		background-color: #47f;
		border: 1px solid #039;
	}

	.chinese {
		font-size: 96px;
	}

	.char {
		display: inline-block;
		background-color: #444;
		border: 1px solid #555;
		border-radius: 10px;
		padding: 10px;
		text-align: center;
		margin: 30px;
	}

	.pickedRight, .pickedWrong {
		font-size: 24px;
	}
</style>

<script>
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import { WordLists } from '../wordlists.js';
	import { rand } from '../rand.js';
	import { radicals } from '../radicals.js';
	import { testingMode } from '../globals.js';
	import { stepSummaries } from '../globals.js';

	const dispatch = createEventDispatcher();
	export let set;
	let shuffled = rand.shuffle(radicals[set - 1]);
	let meanings;
	let numRight = 0;
	let numTotal = 0;
	let finished = false;
	let current;
	let currentIndex = -1;
	let currentWrong = false;
	let pickedClass;
	let picked;
	let btnClass;

	if (testingMode) {
		shuffled = shuffled.slice(0, 3);
	}

	function finish () {
		// How to communicate with parent?
		let summary = `${numRight} / ${numTotal}`;
		finished = true;
		stepSummaries.update(function (v) {
			v['Radicals'] = summary;
			return v;
		});
		dispatch('finished');
	}

	function doNext() {
		currentIndex++;
		current = shuffled[currentIndex];
		if (!current) {
			finish();
			return;
		}

		current.chars = rand.shuffle(current.chars);
		meanings = rand.shuffle(current.chars.map(c => c.english));
		btnClass = [
			[ '', '', '' ],
			[ '', '', '' ],
			[ '', '', '' ]
		];

		currentWrong = false;
		pickedClass = undefined;
	}

	function doClick() {
		let correct = true;
		
		btnClass.forEach(function (r, idx) {
			if (current.chars[idx].english !== meanings[r.indexOf('picked')]) {
				correct = false;
			}
		});

		if (correct) {
			if (!currentWrong) {
				numRight++;
				numTotal++;
			}
			pickedClass = 'pickedRight';
			window.setTimeout(doNext, 1500);
		} else {
			if (!currentWrong) {
				currentWrong = true;
				pickedClass = 'pickedWrong';
				numTotal++;
			}
		}
	}

	function englishClick(evt) {
		let t = evt.currentTarget;
		let cidx = parseInt(t.getAttribute('data-cidx'), 10);
		let midx = parseInt(t.getAttribute('data-midx'), 10);
		
		btnClass[cidx] = [ '', '', '' ];
		btnClass[cidx][midx] = 'picked';

		if (btnClass[(cidx + 1) % 3].indexOf('picked') >= 0 &&
			btnClass[(cidx + 2) % 3].indexOf('picked') >= 0)
		{
			doClick();
		}
	}

	doNext();
</script>

<h1>Radicals</h1>

{#if !finished}
	<div class="chinese radical">
		{current.chinese}
		{#if current.english}({current.english}){/if}
		{#if current.sound}({current.sound}){/if}
	</div>
	{#each current.chars as c, cidx}
		<div class="char">
			<div class="chinese">
				<div>{c.chinese}</div>
				<div>{c.pinyin}</div>
			</div>
			<div>
				{#each meanings as m, midx}
					<button class="{btnClass[cidx][midx]}" on:click="{englishClick}" data-cidx="{cidx}" data-midx="{midx}">{m}</button>
				{/each}
			</div>
		</div>
	{/each}

	{#if pickedClass}
		<div in:fade class="{pickedClass}">
			<span></span>
		</div>
	{/if}

	{#if numTotal > 0}
		<div class="score">
			{numRight} / {numTotal}
		</div>
	{/if}
{/if}