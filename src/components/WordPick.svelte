<style>
	img {
		border-radius: 15px;
		margin: 15px;
	}

	.chinese {
		font-size: 64px;
	}

	.english {
		font-size: 36px;
	}

	.wp_top {
		text-align: center;
	}

	.wp_bottom {
		text-align: center;
		border-top: 1px solid #222;
	}

	.wp_bottom button {
		margin: 15px;
		border-radius: 10px;
		cursor: pointer;
	}

	.wp_bottom img {
		cursor: pointer;
	}
</style>

<script>
	import { createEventDispatcher } from 'svelte';
	import { get } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import { WordLists } from '../wordlists.js';
	import { rand } from '../rand.js';
	import { testingMode } from '../globals.js';
	import { stepSummaries } from '../globals.js';

	export let numWords;
	const dispatch = createEventDispatcher();
	let words;
	let numRight = 0;
	let numTotal = 0;
	let finished = false;
	let current;
	let currentIndex = -1;
	let currentWrong = false;
	let pickedClass;
	let pickedWord;
	let mode;
	let choices;
	let doingNext = false;

	if (get(testingMode)) {
		numWords = 3;
	}

	let getwords = function () {
		let wlmap = { };
		let wl;
		let word;
		let i;
		let k;

		words = [ ];

		for (k in WordLists) {
			wl = WordLists[k];
			for (i=0; i < wl.length; i++) {
				let word = wl[i];
				if ('pic' in word) {
					if (!(word.english in wlmap)) {
						wlmap[word.english] = word;
						words.push(word);
					}
				}
			}
		}

		words = rand.shuffle(words);
	};

	function finish () {
		// How to communicate with parent?
		let summary = `${numRight} / ${numTotal}`;
		finished = true;
		stepSummaries.update(function (v) {
			v['WordPick'] = summary;
			return v;
		});
		dispatch('finished');
	}

	function doNext() {
		currentIndex++;
		if (currentIndex >= numWords) {
			finish();
			return;
		}

		mode = rand.pick([ 'english', 'chinese' ])[0];
		current = words[currentIndex];

		// pick 2 other words
		while (true) {
			choices = rand.pickN(words, 2);
			if (choices.indexOf(current) == -1) {
				break;
			}
		}

		choices.push(current);
		choices = rand.shuffle(choices);

		current = words[currentIndex];
		currentWrong = false;
		pickedClass = undefined;
		pickedWord = undefined;

		if (!current) {
			//finish();
		}
		doingNext = false;
	}

	function doClick(evt) {
		if (doingNext) {
			return;
		}
		let t = evt.currentTarget;
		let correct = false;

		if (mode === 'english') {
			correct = t.getAttribute('data-chinese') === current.chinese;
			choices.forEach(function (item) {
				if (item.chinese === t.getAttribute('data-chinese')) {
					pickedWord = item;
				}
			});
		} else if (mode === 'chinese') {
			correct = t.getAttribute('data-english') === current.english;
			choices.forEach(function (item) {
				if (item.english === t.getAttribute('data-english')) {
					pickedWord = item;
				}
			});
		}

		if (correct) {
			if (!currentWrong) {
				numRight++;
				numTotal++;
			}
			pickedClass = 'pickedRight';
			doingNext = true;
			window.setTimeout(doNext, 1500);
		} else {
			if (!currentWrong) {
				currentWrong = true;
				pickedClass = 'pickedWrong';
				numTotal++;
			}
		}
	}

	getwords();
	doNext();
</script>

<h1>Word Pick</h1>

{#if !finished}
	<div id="wordpick">
		<div class="wp_top">
			{#if mode == 'english'}
				<div class="english">
					<div><img src="words/{current.pic}" width="300" height="300" alt="{current.english}" title="{current.english}" /></div>
					<div>{current.english}</div>
				</div>
			{:else}
				<div class="chinese">
					<div title="{current.pinyin}">{current.chinese}</div>
				</div>
			{/if}
		</div>
		<div class="wp_bottom">
			{#if mode == 'english'}
				{#each choices as choice}
					<button class="chinese" data-chinese="{choice.chinese}" on:click="{doClick}" title="{choice.pinyin}">
						<div title="{choices.pinyin}">{choice.chinese}</div>
					</button>
				{/each}
			{:else}
				{#each choices as choice}
					<img data-english="{choice.english}" src="words/{choice.pic}" width="300" height="300" alt="{choice.english}" title="{choice.english}" on:click="{doClick}"/>
				{/each}
			{/if}
		</div>
	</div>

	{#if pickedClass}
		<div in:fade class="chinese {pickedClass}">
			<span>
				{#if pickedWord}
					{pickedWord.chinese} {pickedWord.pinyin}: {pickedWord.english}
				{/if}
			</span>
		</div>
	{/if}

	{#if numTotal > 0}
		<div class="score">
			{numRight} / {numTotal}
		</div>
	{/if}
{/if}