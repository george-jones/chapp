<style>
	img {
		border-radius: 15px;
		margin: 15px;
	}

	.chinese {
		font-size: 64px;
	}

	button {
		margin: 10px;
		border-radius: 5px;
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
	let cfr = [
		{ "chinese": "把", "pinyin": "bǎ", "english": "handful" },
		{ "chinese": "本", "pinyin": "běn", "english": "volume (books)" },
		{ "chinese": "朵", "pinyin": "duǒ", "english": "lobe (flowers)" },
		{ "chinese": "个", "pinyin": "ge", "english": "whatever" },
		{ "chinese": "棵", "pinyin": "kē", "english": "trees and other plants" },
		{ "chinese": "块", "pinyin": "kuài", "english": "lump" },
		{ "chinese": "辆", "pinyin": "liàng", "english": "vehicles" },
		{ "chinese": "匹", "pinyin": "pǐ", "english": "horses" },
		{ "chinese": "片", "pinyin": "piàn", "english": "slice" },
		{ "chinese": "位", "pinyin": "wèi", "english": "for people (polite)" },
		{ "chinese": "张", "pinyin": "zhāng", "english": "sheet" },
		{ "chinese": "只", "pinyin": "zhī", "english": "most animals, also hand or foot" },
		{ "chinese": "座", "pinyin": "zuò", "english": "huge things, like a mountain" }
	];
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
	let shuffled = [ ];

	let findWords = function () {
		let k;
		let i;
		let haveCl = { };
		let cl;
		let wl;
		let word;
		let cfrEntry;
		let wordsUsed = { };

		for (k in WordLists) {
			wl = WordLists[k];
			for (i = 0; i < wl.length; i++) {
				word = wl[i];
				if ("cl" in word) {
					cl = word.cl;
					if (cl in haveCl) {
						haveCl[cl].push(word);
					} else {
						haveCl[cl] = [ word ];
					}
				}
			}
		}

		for (i = 0; i < cfr.length; i++) {
			cfrEntry = cfr[i];
			if (cfrEntry.chinese in haveCl) {
				cfrEntry.words = haveCl[cfrEntry.chinese];
			}
		}

		for (i = 0; i < cfr.length; i++) {
			let j=0;
			for (j=0; j < Math.min(cfr[i].words.length, 3); j++) {
				let theseWords = rand.shuffle(cfr[i].words);
				let k=0;
				for (k=0; k < theseWords.length; k++) {
					if (!(theseWords[k].chinese in wordsUsed)) {
						wordsUsed[theseWords[k].chinese] = true;
						shuffled.push({
							chinese: cfr[i].chinese,
							pinyin: cfr[i].pinyin,
							english: cfr[i].english,
							word: theseWords[k]
						});
						break;
					}
				}
			}
		}

		shuffled = rand.shuffle(shuffled);
		if (testingMode) {
			shuffled = shuffled.slice(0, 3);
		}
	};

	function finish () {
		// How to communicate with parent?
		let summary = `${numRight} / ${numTotal}`;
		finished = true;
		stepSummaries.update(function (v) {
			v['Classifiers'] = summary;
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

		current = current.word;
		currentWrong = false;
		pickedClass = undefined;
		pickedWord = undefined;
	}

	function doClick(evt) {
		let t = evt.currentTarget;
		let chinese = t.getAttribute('data-chinese');
		let correct = false;

		cfr.forEach(function (cfrItem) {
			if (cfrItem.chinese === chinese) {
				pickedWord = cfrItem;
			}
		});

		if (pickedWord.chinese === current.cl) {
			correct = true;
		}

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

	findWords();
	doNext();
</script>

<h1>Classifiers</h1>

{#if !finished}
	<div class>
		<img width="300" height="300" src="words/{current.pic}" alt="{current.english}" title="{current.english}" />
	</div>
	{#each cfr as c}
		<button class="chinese" data-chinese="{c.chinese}" title="{c.pinyin}" on:click="{doClick}">{c.chinese}</button>
	{/each}

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