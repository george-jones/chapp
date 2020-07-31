<style>
	.chinese {
		font-size: 64px;
	}

	svg {
		width: 100%;
		height: 750px;
	}

	#self {
		stroke: #990;
		fill: #ff6;
		cursor: pointer;
	}

	.boy {
		stroke: #03c;
		fill: #06f;
		cursor: pointer;
	}

	.girl {
		stroke: #a66;
		fill: #f99;
		cursor: pointer;
	}

	.relat {
		stroke: #111;
		stroke-width: 0.5;
	}

	#theWords {
		position: absolute;
		top: 20px;
		left: 0px;
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
	let family = {
		"grandpa-dad": {
			"chinese": "爷爷",
			"pinyin": "yé ye"
		},
		"grandma-dad": {
			"chinese": "奶奶",
			"pinyin": "nǎi nai"
		},
		"grandpa-mom": {
			"chinese": "外公",
			"pinyin": "wài gōng"
		},
		"grandma-mom": {
			"chinese": "外婆",
			"pinyin": "wài pó"
		},
		"dad": {
			"chinese": "爸爸",
			"pinyin": "bà ba"
		},
		"mom": {
			"chinese": "妈妈",
			"pinyin": "mā ma"
		},
		"unc-dad-b": {
			"chinese": "伯伯",
			"pinyin": "bó bo"
		},
		"unc-dad-s": {
			"chinese": "叔叔",
			"pinyin": "shū shu"
		},
		"aunt-dad-b": {
			"chinese": "姑妈",
			"pinyin": "gū mā"
		},
		"aunt-dad-s-": {
			"chinese": "姑姑",
			"pinyin": "gū gū"
		},
		"unc-mom": {
			"chinese": "舅舅",
			"pinyin": "jiù jiu"
		},
		"aunt-mom-b": {
			"chinese": "姨妈",
			"pinyin": "yí mā"
		},
		"aunt-mom-s": {
			"chinese": "阿姨",
			"pinyin": "ā yí"
		},
		"bro-b": {
			"chinese": "哥哥",
			"pinyin": "gē ge"
		},
		"bro-s": {
			"chinese": "弟弟",
			"pinyin": "dì di"
		},
		"self": {
			"chinese": "我",
			"pinyin": "wǒ"
		},
		"sis-b": {
			"chinese": "姐姐",
			"pinyin": "jiě jie"
		},
		"sis-s": {
			"chinese": "妹妹",
			"pinyin": "mèi mei"
		},
		"cous-dad-b-b": {
			"chinese": "堂兄",
			"pinyin": "táng xiōng"
		},
		"cous-dad-b-s": {
			"chinese": "堂弟",
			"pinyin": "táng dì"
		},
		"cous-dad-g-b": {
			"chinese": "堂姐",
			"pinyin": "táng jiě"
		},
		"cous-dad-g-s": {
			"chinese": "堂妹",
			"pinyin": "táng mèi"
		},
		"cous-mom-b-b": {
			"chinese": "表哥",
			"pinyin": "biǎo gē"
		},
		"cous-mom-b-s": {
			"chinese": "表弟",
			"pinyin": "biǎo dì"
		},
		"cous-mom-g-b": {
			"chinese": "表姐",
			"pinyin": "biǎo jiě"
		},
		"cous-mom-g-s": {
			"chinese": "表妹",
			"pinyin": "biǎo mèi"
		}
	};
	let shuffled;
	let numRight = 0;
	let numTotal = 0;
	let finished = false;
	let current;
	let currentIndex = -1;
	let currentWrong = false;
	let pickedPerson;
	let pickedClass;

	function finish () {
		// How to communicate with parent?
		let summary = `${numRight} / ${numTotal}`;
		finished = true;
		stepSummaries.update(function (v) {
			v['Family'] = summary;
			return v;
		});
		dispatch('finished');
	}

	function doClick (evt) {
		let t = evt.target;
		if (t.id) {
			if (t.id === shuffled[currentIndex]) {
				if (!currentWrong) {
					numRight++;
					numTotal++;
				}
				pickedPerson = current;
				pickedClass = 'pickedRight';
				window.setTimeout(doNext, 1000);
			} else {
				if (!currentWrong) {
					currentWrong = true;
					pickedClass = 'pickedWrong';
					numTotal++;
				}
				pickedPerson = family[t.id];
			} 
		}
	}

	function doNext() {
		let k;

		if (!shuffled) {
			shuffled = [ ];
			for (k in family) {
				shuffled.push(k);
			}
			shuffled = rand.shuffle(shuffled);
			if (testingMode) {
				shuffled = shuffled.slice(0, 3);
			}
		}

		currentIndex++;
		current = family[shuffled[currentIndex]];
		currentWrong = false;
		pickedPerson = undefined;
		if (!current) {
			finish();
		}
	}

	doNext();
</script>

<h1>Family</h1>
<div style="position:relative">
	{#if current}
		<div id="theWords" class="chinese" title="{current.pinyin}">{current.chinese}</div>
	{/if}
</div>

{#if !finished}
	<svg viewBox='-50 -50 100 100' on:click={doClick}>

		<line x1="-50" y1="-40" x2="-30" y2="-40" class="relat" />
		<line x1="-40" y1="-40" x2="-40" y2="-10" class="relat" />
		<circle id="grandpa-dad" class="boy" cx="-50" cy="-40" r="5" />
		<circle id="grandma-dad" class="girl" cx="-30" cy="-40" r="5" />

		<line x1="30" y1="-40" x2="50" y2="-40" class="relat" />
		<line x1="40" y1="-40" x2="40" y2="-10" class="relat" />
		<circle id="grandpa-mom" class="boy" cx="30" cy="-40" r="5" />
		<circle id="grandma-mom" class="girl" cx="50" cy="-40" r="5" />

		<line x1="-10" y1="0" x2="10" y2="0" class="relat" />
		<circle id="dad" class="boy" cx="-10" cy="0" r="5" />
		<circle id="mom" class="girl" cx="10" cy="0" r="5" />

		<line x1="-84" y1="-10" x2="-2" y2="-10" class="relat" />
		<line x1="-84" y1="-10" x2="-84" y2="-2" class="relat" />
		<line x1="-2" y1="-10" x2="-2" y2="-2" class="relat" />
		<circle id="unc-dad-b" class="boy" cx="-75" cy="0" r="7"/>
		<circle id="unc-dad-s" class="boy" cx="-60" cy="0" r="4"/>
		<circle id="aunt-dad-b" class="girl" cx="-45" cy="0" r="7"/>
		<circle id="aunt-dad-s-" class="girl" cx="-30" cy="0" r="4"/>

		<line x1="2" y1="-10" x2="67" y2="-10" class="relat" />
		<line x1="2" y1="-10" x2="2" y2="-2" class="relat" />
		<line x1="67" y1="-10" x2="67" y2="-2" class="relat" />
		<circle id="unc-mom" class="boy" cx="30" cy="0" r="5"/>
		<circle id="aunt-mom-b" class="girl" cx="45" cy="0" r="7"/>
		<circle id="aunt-mom-s" class="girl" cx="60" cy="0" r="4"/>

		<line x1="0" y1="0" x2="0" y2="30" class="relat" />
		<line x1="-38" y1="30" x2="38" y2="30" class="relat" />
		<line x1="-38" y1="30" x2="-38" y2="40" class="relat" />
		<line x1="38" y1="30" x2="38" y2="40" class="relat" />
		<circle id="bro-b" class="boy" cx="-28" cy="40" r="7"/>
		<circle id="bro-s" class="boy" cx="-13" cy="40" r="4"/>
		<circle id="self" cx="0" cy="40" r="5" />
		<circle id="sis-b" class="girl" cx="16" cy="40" r="7"/>
		<circle id="sis-s" class="girl" cx="31" cy="40" r="4"/>

		<line x1="-60" y1="10" x2="-60" y2="30" class="relat" />
		<line x1="-109" y1="30" x2="-48" y2="30" class="relat" />
		<line x1="-109" y1="30" x2="-109" y2="40" class="relat" />
		<line x1="-48" y1="30" x2="-48" y2="40" class="relat" />
		<circle id="cous-dad-b-b" class="boy" cx="-100" cy="40" r="7"/>
		<circle id="cous-dad-b-s" class="boy" cx="-85" cy="40" r="4"/>
		<circle id="cous-dad-g-b" class="girl" cx="-70" cy="40" r="7"/>
		<circle id="cous-dad-g-s" class="girl" cx="-55" cy="40" r="4"/>

		<line x1="60" y1="10" x2="60" y2="30" class="relat" />
		<line x1="45" y1="30" x2="107" y2="30" class="relat" />
		<line x1="45" y1="30" x2="45" y2="40" class="relat" />
		<line x1="107" y1="30" x2="107" y2="40" class="relat" />
		<circle id="cous-mom-b-b" class="boy" cx="55" cy="40" r="7"/>
		<circle id="cous-mom-b-s" class="boy" cx="70" cy="40" r="4"/>
		<circle id="cous-mom-g-b" class="girl" cx="85" cy="40" r="7"/>
		<circle id="cous-mom-g-s" class="girl" cx="100" cy="40" r="4"/>
	</svg>
{/if}

{#if pickedPerson}
	<div in:fade class="chinese {pickedClass}"><span>{pickedPerson.chinese} {pickedPerson.pinyin}</span></div>
{/if}

{#if numTotal > 0}
	<div class="score">
		{numRight} / {numTotal}
	</div>
{/if}