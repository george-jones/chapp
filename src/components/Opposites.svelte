<style>
	.chinese {
		font-size: 48px;
	}

	#theWord {
		font-size: 72px;
	}

	button.chinese {
		margin: 10px;
		cursor: pointer;
	}
</style>

<script>
	import { createEventDispatcher } from 'svelte';
	import { get } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import { rand } from '../rand.js';
	import { testingMode } from '../globals.js';
	import { stepSummaries } from '../globals.js';

	export let side;
	const dispatch = createEventDispatcher();
	let pairs = [
		[ { "pinyin": "dà", "chinese": "大", "english": "big"}, { "pinyin": "xiǎo", "chinese": "小", "english": "small" } ],
		[ { "pinyin": "duō", "chinese": "多", "english": "many"}, { "pinyin": "shǎo", "chinese": "少", "english": "few" } ],
		[ { "pinyin": "gāo", "chinese": "高", "english": "tall"}, { "pinyin": "aǐ", "chinese": "矮", "english": "short" } ],
		[ { "pinyin": "dī", "chinese": "低", "english": "low" }, { "pinyin": "gāo", "chinese": "高", "english": "high" }  ],
		[ { "pinyin": "duǎn", "chinese": "短", "english": "short" }, { "pinyin": "cháng", "chinese": "长", "english": "long"} ],
		[ { "pinyin": "cū", "chinese": "粗", "english": "thiccc"}, { "pinyin": "xì", "chinese": "细", "english": "thin" } ],
		[ { "pinyin": "kuān", "chinese": "宽", "english": "wide"}, { "pinyin": "zhǎi", "chinese": "窄", "english": "narrow" } ],
		[ { "pinyin": "yuǎn", "chinese": "远", "english": "far"}, { "pinyin": "jìn", "chinese": "近", "english": "near" } ],
		[ { "pinyin": "lěng", "chinese": "冷", "english": "cold"}, { "pinyin": "rè", "chinese": "热", "english": "hot" } ],
		[ { "pinyin": "kuài", "chinese": "快", "english": "fast"}, { "pinyin": "màn", "chinese": "慢", "english": "slow" } ],
		[ { "pinyin": "shàng", "chinese": "上", "english": "above"}, { "pinyin": "xià", "chinese": "下", "english": "below" } ],
		[ { "pinyin": "zuǒ", "chinese": "左", "english": "left"}, { "pinyin": "yòu", "chinese": "右", "english": "right" } ],
		[ { "pinyin": "qián", "chinese": "前", "english": "front"}, { "pinyin": "hòu", "chinese": "后", "english": "back" } ],
		[ { "pinyin": "dōng", "chinese": "东", "english": "east"}, { "pinyin": "xī", "chinese": "西", "english": "west" } ],
		[ { "pinyin": "nán", "chinese": "南", "english": "south"}, { "pinyin": "běi", "chinese": "北", "english": "north" } ],
		[ { "pinyin": "hēi", "chinese": "黑", "english": "black"}, { "pinyin": "bái", "chinese": "白", "english": "white" } ],
		[ { "pinyin": "hǎo", "chinese": "好", "english": "good"}, { "pinyin": "huài", "chinese": "坏", "english": "bad" } ],
		[ { "pinyin": "zhēn", "chinese": "真", "english": "true"}, { "pinyin": "jiǎ", "chinese": "假", "english": "false" } ],
		[ { "pinyin": "duì", "chinese": "对", "english": "right"}, { "pinyin": "cuò", "chinese": "错", "english": "wrong" } ],
		[ { "pinyin": "xīn", "chinese": "新", "english": "new"}, { "pinyin": "jiù", "chinese": "旧", "english": "old" } ],
		[ { "pinyin": "pàng", "chinese": "胖", "english": "fat"}, { "pinyin": "shòu", "chinese": "瘦", "english": "thin" } ],
		[ { "pinyin": "pián yi", "chinese": "便宜", "english": "cheap"}, { "pinyin": "guì", "chinese": "贵", "english": "expensive" } ],
		[ { "pinyin": "ruǎn", "chinese": "软", "english": "soft"}, { "pinyin": "yìng", "chinese": "硬", "english": "hard" } ],
		[ { "pinyin": "lǎo", "chinese": "老", "english": "old"}, { "pinyin": "nián qīng", "chinese": "年轻", "english": "young" } ],
		[ { "pinyin": "nán", "chinese": "男", "english": "male"}, { "pinyin": "nǚ", "chinese": "女", "english": "female" } ],
		[ { "pinyin": "qīng", "chinese": "轻", "english": "light"}, { "pinyin": "zhòng", "chinese": "重", "english": "heavy" } ],
		[ { "pinyin": "kū", "chinese": "哭", "english": "cry"}, { "pinyin": "wēi xiào", "chinese": "微笑", "english": "smile" } ],
		[ { "pinyin": "yíng", "chinese": "赢", "english": "win"}, { "pinyin": "shū", "chinese": "输", "english": "lose" } ],
		[ { "pinyin": "qiáng", "chinese": "强", "english": "strong"}, { "pinyin": "ruò", "chinese": "弱", "english": "weak" } ],
		[ { "pinyin": "máng", "chinese": "忙", "english": "busy"}, { "pinyin": "xián", "chinese": "闲", "english": "unbusy" } ],
		[ { "pinyin": "kǔ", "chinese": "苦", "english": "bitter"}, { "pinyin": "tián", "chinese": "甜", "english": "sweet" } ]
	];
	let randomized = rand.shuffle(pairs);
	let alphabetized = pairs.splice(0); // copy
	let leftIndex;
	let rightIndex;
	let numRight = 0;
	let numTotal = 0;
	let finished = false;
	let current;
	let currentIndex = -1;
	let currentWrong = false;
	let pickedClass = undefined;

	if (get(testingMode)) {
		randomized = randomized.slice(0, 3);
	}

	if (side === 'left') {
		leftIndex = 0;
		rightIndex = 1;
	} else {
		leftIndex = 1;
		rightIndex = 0;

	}

	alphabetized.sort(function (a, b) {
		if (a[rightIndex].pinyin > b[rightIndex].pinyin) {
			return 1;
		} else if (a[rightIndex].pinyin < b[rightIndex].pinyin) {
			return -1;
		} else {
			return 0; // shouldn't happen!
		}
	});

	function finish () {
		// How to communicate with parent?
		let summary = `${numRight} / ${numTotal}`;
		finished = true;
		stepSummaries.update(function (v) {
			v['Opposites'] = summary;
			return v;
		});
		dispatch('finished');
	}

	function doNext() {
		currentIndex++;
		current = randomized[currentIndex];

		if (!current) {
			finish();
			return;
		}

		currentWrong = false;
		pickedClass = undefined;
	}

	function doClick(evt) {
		let t = evt.target;

		if (evt.target.getAttribute('data-chinese') === current[rightIndex].chinese) {
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

	doNext();
</script>

<h1>Opposites</h1>

{#if !finished}
	{#if current}
		<div id="theWord" class="chinese" title="{current[leftIndex].pinyin}">{current[leftIndex].chinese}</div>
	{/if}

	{#each alphabetized as guess}
		<button data-chinese="{guess[rightIndex].chinese}" class="chinese" on:click={doClick} title="{guess[rightIndex].pinyin} ({guess[rightIndex].english})">{guess[rightIndex].chinese}</button>
	{/each}

	{#if pickedClass}
		<div in:fade class="chinese {pickedClass}">
			<span>
				{#if pickedClass == 'pickedRight'}
					{current[leftIndex].english} - {current[rightIndex].english}
				{:else}
					Find the opposite of: {current[leftIndex].english}
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