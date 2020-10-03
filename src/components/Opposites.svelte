<style>
	#container {
		height: 100%;
		user-select: none;
		position: relative;
	}

	.chinese {
		font-size: 48px;
	}

	#theWord {
		font-size: 72px;
	}

	.oppositePair {
		display: inline-block;
		margin: 15px;
	}

	.chinese.guessMe {
		background-color: #444;
		border-radius: 5px;
		padding: 5px;
		display: inline-block;
		min-height: 1.5em;
		min-width: 1em;
		vertical-align: top;
	}

	.chinese.fillMe {
		background-color: #222;
		border-radius: 5px;
		padding: 5px;
		display: inline-block;
		min-height: 1.5em;
		min-width: 1em;
		vertical-align: top;
	}

	.pickable {
		margin: 10px;
		cursor: pointer;
		padding: 5px;
		border-radius: 5px;
		background-color: #ddd;
		color: #222;
		display: inline-block;
	}

	:global(.pickable.picked) {
		background-color: #ffa;
		position: absolute;
	}

	:global(.chinese.fillMe.hovering) {
		background-color: #556;
	}

	:global(.chinese.fillMe.wrong) {
		background-color: #900;
	}
</style>

<script>
	import { createEventDispatcher } from 'svelte';
	import { get } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import { rand } from '../rand.js';
	import { testingMode } from '../globals.js';
	import { stepSummaries } from '../globals.js';
import { element } from 'svelte/internal';

	export let side;
	const dispatch = createEventDispatcher();
	let pairs = [
		[ { "pinyin": "dà", "chinese": "大", "english": "big"}, { "pinyin": "xiǎo", "chinese": "小", "english": "small" } ],
		[ { "pinyin": "duō", "chinese": "多", "english": "many"}, { "pinyin": "shǎo", "chinese": "少", "english": "few" } ],
		[ { "pinyin": "gāo", "chinese": "高", "english": "tall"}, { "pinyin": "aǐ", "chinese": "矮", "english": "untall" } ],
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
		[ { "pinyin": "duì", "chinese": "对", "english": "correct"}, { "pinyin": "cuò", "chinese": "错", "english": "wrong" } ],
		[ { "pinyin": "xīn", "chinese": "新", "english": "new"}, { "pinyin": "jiù", "chinese": "旧", "english": "old" } ],
		[ { "pinyin": "pàng", "chinese": "胖", "english": "fat"}, { "pinyin": "shòu", "chinese": "瘦", "english": "skinny" } ],
		[ { "pinyin": "pián yi", "chinese": "便宜", "english": "cheap"}, { "pinyin": "guì", "chinese": "贵", "english": "expensive" } ],
		[ { "pinyin": "ruǎn", "chinese": "软", "english": "soft"}, { "pinyin": "yìng", "chinese": "硬", "english": "hard" } ],
		[ { "pinyin": "lǎo", "chinese": "老", "english": "unyoung"}, { "pinyin": "nián qīng", "chinese": "年轻", "english": "young" } ],
		[ { "pinyin": "nán", "chinese": "男", "english": "male"}, { "pinyin": "nǚ", "chinese": "女", "english": "female" } ],
		[ { "pinyin": "qīng", "chinese": "轻", "english": "light"}, { "pinyin": "zhòng", "chinese": "重", "english": "heavy" } ],
		[ { "pinyin": "kū", "chinese": "哭", "english": "cry"}, { "pinyin": "wēi xiào", "chinese": "微笑", "english": "smile" } ],
		[ { "pinyin": "yíng", "chinese": "赢", "english": "win"}, { "pinyin": "shū", "chinese": "输", "english": "lose" } ],
		[ { "pinyin": "qiáng", "chinese": "强", "english": "strong"}, { "pinyin": "ruò", "chinese": "弱", "english": "weak" } ],
		[ { "pinyin": "máng", "chinese": "忙", "english": "busy"}, { "pinyin": "xián", "chinese": "闲", "english": "unbusy" } ],
		[ { "pinyin": "kǔ", "chinese": "苦", "english": "bitter"}, { "pinyin": "tián", "chinese": "甜", "english": "sweet" } ]
	];
	let container;
	let randomized = rand.shuffle(pairs);
	let alphabetized = pairs.splice(0); // copy
	let leftIndex;
	let rightIndex;
	let numRight = 0;
	let numTotal = 0;
	let counted = false;
	let finished = false;
	let moving;

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
		if (a[leftIndex].pinyin > b[leftIndex].pinyin) {
			return 1;
		} else if (a[leftIndex].pinyin < b[leftIndex].pinyin) {
			return -1;
		} else {
			return 0; // shouldn't happen!
		}
	});

	function doMouseDown(evt) {
		moving = { }
		moving.element = evt.target;
		moving.elementStart = {
			x: moving.element.offsetLeft,
			y: moving.element.offsetTop
		};
		moving.pointerStart = {
			x: evt.clientX,
			y: evt.clientY
		};

		moving.element.classList.add('picked');
		moving.element.style.left = moving.elementStart.x + 'px';
		moving.element.style.top = moving.elementStart.y + 'px';
	}

	function unguess(guess_id) {
		if (guess_id) {
			container.querySelectorAll("[data-guess-id='" + guess_id + "']").forEach((el) => {
				var cl = el.classList;
				if (cl.contains('pickable')) {
					cl.remove('picked');
					el.style.display = '';
				} else {
					el.innerText = '';
					el.setAttribute('title', '');
					el.removeAttribute('data-guess-id');
					el.classList.remove('wrong');
				}
			});
		}
	}

	function doMouseUp(evt) {
		if (moving) {
			if (moving.destination) {
				let prev_guess = moving.destination.getAttribute('data-guess-id');
				if (prev_guess) {
					unguess(prev_guess);
				}
				moving.destination.setAttribute('data-guess-id', moving.element.getAttribute('data-guess-id'));
				moving.destination.innerText = moving.element.getAttribute('data-chinese');
				moving.destination.setAttribute('title', moving.element.getAttribute('title'));
				moving.element.style.display = 'none';
				moving.destination.classList.remove('hovering');
			}
			moving.element.classList.remove('picked');
			moving = null;

			checkDone();
		}
	}

	function doMouseMove(evt) {
		if (!container) {
			container = document.getElementById('container');
		}
		if (moving) {
			moving.element.style.left = (moving.elementStart.x + evt.clientX - moving.pointerStart.x) + 'px';
			moving.element.style.top = (moving.elementStart.y + evt.clientY - moving.pointerStart.y) + 'px';

			let top = moving.element.offsetTop;
			let bottom = top + moving.element.offsetHeight;
			let left = moving.element.offsetLeft;
			let right = left + moving.element.offsetWidth;

			if (moving.destination) {
				moving.destination.classList.remove('hovering');
				moving.destination = null;
			}

			container.querySelectorAll('.fillMe').forEach((fillable) => {
				if (moving.destination) {
					return;
				}
				let fillableTop = fillable.offsetTop;
				let fillableBottom = fillableTop + fillable.offsetHeight;
				let fillableLeft = fillable.offsetLeft;
				let fillableRight = fillableLeft + fillable.offsetWidth;

				if (fillableTop <= bottom && fillableBottom >= top && fillableLeft <= right && fillableRight >= left) {
					fillable.classList.add('hovering');
					moving.destination = fillable;
				}
			});
			
		}
	}

	function doFillMeMouseDown(evt) {
		// undo guess
		unguess(evt.target.getAttribute('data-guess-id'));
	}

	function checkDone() {
		// first, see if all things that must be guessed have been
		let guessed = container.querySelectorAll(".fillMe[data-guess-id]");
		let someWrong = false;

		if (guessed.length == randomized.length) {

			guessed.forEach((g) => {
				let guess_id = g.getAttribute('data-guess-id');
				let prev = g.previousElementSibling.textContent;
				let guessed_opposite = randomized[guess_id][leftIndex].chinese;
				
				if (prev == guessed_opposite) {
					g.classList.remove('wrong');
					if (!counted) {
						numRight++;
					}
				} else {
					g.classList.add('wrong');
					someWrong = true;
				}

				if (!counted) {
					numTotal++;
				}
			});

			counted = true;

			if (!someWrong) {
				let summary = `${numRight} / ${numTotal}`;
				finished = true;
				stepSummaries.update(function (v) {
					v['Opposites'] = summary;
					return v;
				});
				dispatch('finished');
			}
		}
	}
</script>

<div id="container" on:mousemove={doMouseMove} on:mouseup={doMouseUp}>
<h1>Opposites</h1>

{#if !finished}
	{#each randomized as rando, i}
		<div data-guess-id="{i}" data-chinese="{rando[rightIndex].chinese}" class="chinese pickable"
			on:mousedown={doMouseDown} on:mouseup={doMouseUp}
			title="{rando[rightIndex].pinyin} ({rando[rightIndex].english})">{rando[rightIndex].chinese}</div>
	{/each}

	<div>
	{#each alphabetized as a}
			<div class="oppositePair">
				<div class="chinese guessMe" title="{a[leftIndex].pinyin}">{a[leftIndex].chinese}</div>
				<div class="chinese fillMe" on:mousedown={doFillMeMouseDown}></div>
			</div>
	{/each}
	</div>

	{#if numTotal > 0}
		<div class="score">
			{numRight} / {numTotal}
		</div>
	{/if}
{/if}

</div>