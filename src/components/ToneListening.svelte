<style>
	.chinese {
		font-size: 72px;
	}

	.english {
		font-size: 32px;
	}

	.hasTone {
		background-color: #333;
		border-radius: 3px;
		padding: 7px;
		margin: 5px;
		cursor: pointer;
	}

	.chinese.letters.showWrong .hasTone {
		background-color: #119;
	}

	.chinese.letters.showWrong .hasTone.wrong {
		background-color: #400;
	}

	.hasTone.beingGuessed {
		background-color: #383;
	}

	.chinese.letters {
		background-color: #222;
		border-radius: 5px;
		padding: 5px;
		word-spacing: 20px;
		font-size: 54px;
	}

	.options {
		margin-top: 15px;
	}

	button {
		font-size: 64px;
		min-width: 100px;
		border-radius: 10px;
		cursor: pointer;
	}

	button:not(:first-child) {
		margin-left: 24px;
	}

	button:not(:last-child) {
		margin-right: 24px;
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
	import { sentences } from '../sentences.json';

	const dispatch = createEventDispatcher();
	let numRight = 0; 
	let numTotal = 0;
	let finished = false;
	let current;
	let currentIndex = -1;
	let currentWrong = false;
	let soundSrc;
	let chosen = [ ];
	let letters;
	let segments = [
		{ 'start': 0, 'end': 50 },
		{ 'start': 51, 'end': 100 },
		{ 'start': 101, 'end': 150 },
		{ 'start': 151, 'end': 200 },
		{ 'start': 201, 'end': 250 },
		{ 'start': 251, 'end': 300 },
		{ 'start': 301, 'end': 400 },
		/*
		{ 'start': 801, 'end': 1600 },
		{ 'start': 1601, 'end': 2800 },
		{ 'start': 2801, 'end': sentences.length - 1 }
		*/
	];
	let toneMap = {
		"a": ["ā","á","ǎ","à"],
		"i": ["ī","í","ǐ","ì"],
		"e": ["ē","é","ě","è"],
		"o": ["ō","ó","ǒ","ò"],
		"u": ["ū","ú","ǔ","ù"],
		"ü": ["ǖ","ǘ","ǚ","ǜ"]
	};
	let guessing = false;
	let letterGuessing;
	let options;
	let lettersCssClass = 'chinese letters';

	if (get(testingMode)) {
		segments = [ segments[segments.length - 2], segments[segments.length - 1] ];
	}

	segments.forEach(function (seg) {
		var q = seg.end - seg.start + 1;
		var idx = seg.start + Math.floor(q * Math.random());
		chosen.push({ sentence: sentences[idx], number: idx + 1 });
	});

	function sendSummary() {
		let summary = `${numRight} / ${numTotal}`;
		stepSummaries.update(function (v) {
			v['ToneListening'] = summary;
			return v;
		});
	};

	function finish () {
		sendSummary();
		finished = true;
		dispatch('finished');
	}

	function doNext() {
		let s;
		currentIndex++;
		s = chosen[currentIndex];
		if (!s) {
			finish();
			return;
		}

		// clone
		current = Object.assign({}, s.sentence);
		current.pinyin = current.pinyin.toLocaleLowerCase();
		current.toneless = current.toneless.toLocaleLowerCase();
		soundSrc = 'sentence_audio/' + s.number + '.mp3';
		currentWrong = false;
		lettersCssClass = 'chinese letters';
		letters = [ ];

		for (let i=0; i < current.toneless.length; i++) {
			let c = current.toneless.charAt(i);
			let letter = {
				toneless: c
			};
			let toned = current.pinyin.charAt(i);

			letters.push(letter);

			if (c != toned) {
				letter.hasTone = true;
				letter.toned = toned;
				letter.guessed = null;
				letter.cssClass = 'hasTone';
			}
		}
	};

	function unmarkGuessingLetter() {
		if (letterGuessing) {
			letterGuessing.cssClass = 'hasTone';
		}
	}

	function letterClick(evt) {
		let el = evt.currentTarget;
		let idx = parseInt(el.getAttribute('data-index'), 10);

		unmarkGuessingLetter();
		lettersCssClass = 'chinese letters';
		letters[idx].cssClass = 'hasTone beingGuessed';
		letterGuessing = letters[idx];
		guessing = true;
		options = toneMap[letterGuessing.toneless];
	};

	function optionClick(evt) {
		let el = evt.currentTarget;
		let value = el.getAttribute('data-value');
		let someUnanswered = false;
		let someWrong = false;
		let numRightNow = 0;
		let numTotalNow = 0;

		letterGuessing.guessed = value;
		unmarkGuessingLetter();
		guessing = false;

		letters.forEach(function (letter) {
			if (letter.hasTone) {
				numTotalNow++;
				if (!letter.guessed) {
					someUnanswered = true;
				} else if (letter.toned !== letter.guessed) {
					letter.cssClass = 'hasTone wrong';
					someWrong = true;
				} else {
					numRightNow++;
				}
			}
		});

		if (someUnanswered) {
			lettersCssClass = 'chinese letters';
		} else {
			lettersCssClass = 'chinese letters showWrong';
			if (someWrong) {
				if (!currentWrong) {
					currentWrong = true;
					numRight += numRightNow;
					numTotal += numTotalNow;
					sendSummary();
				}
			} else {
				if (!currentWrong) {
					numRight += numRightNow;
					numTotal += numTotalNow;
					sendSummary();
				}
				window.setTimeout(doNext, 1000);
			}
		}

		letters = letters; // invalidate
	};


	doNext();

	/*
	let pchars = { };
	sentences.forEach(function (s) {
		let toneless = s.toneless.toLowerCase();
		let toned = s.pinyin.toLowerCase();
		for (let i=0; i < toneless.length; i++) {
			let c = toneless.charAt(i);
			if (c != toned.charAt(i)) {
				pchars[toned.charAt(i)] = c;
			}
		}
	});

	let flipped = { };
	for (let k in pchars) {
		let c = pchars[k];
		if (!(c in flipped)) {
			flipped[c] = [ k ];
		} else if (!(k in flipped[c])) {
			flipped[c].push(k);
		}
	}
	debugger;
	*/

</script>

<h1>Tone Listening</h1>

{#if !finished}
	<div class="english">{current.english}</div>

	<div class="chinese">{current.chars}</div>

	<audio controls src={soundSrc} />

	<div class="{lettersCssClass}">
		{#each letters as letter, idx}
			{#if letter.hasTone}
				<span class="{letter.cssClass}"
					data-index="{idx}" on:click={letterClick}>{#if letter.guessed}{letter.guessed}{:else}{letter.toneless}{/if}</span>
			{:else}
				{letter.toneless}
			{/if}
		{/each}
	</div>

	{#if guessing}
	<div class="options">
		{#each options as option}
			<button data-value="{option}" on:click={optionClick}>{option}</button>
		{/each}
	</div>
	{/if}

	{#if numTotal > 0}
		<div class="score">
			{numRight} / {numTotal}
		</div>
	{/if}
{/if}