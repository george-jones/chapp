<style>
	#main-container {
		width: 100%;
		height: 100vh;
		display: flex;
	}

	#activities {
		width: 200px;
		padding-left: 10px;
		vertical-align: top;
	}

	#content {
		vertical-align: top;
		background-color: #333;
		width: 100%;
		height: 100%;
		padding: 15px;
		box-sizing: border-box;
	}

	#activities div {
		border-bottom: 1px solid #191919;
	}

	#done {
		font-size: 96px;
	}

	button {
		font-size: 32px;
	}
</style>

<script>
	import { weeks } from '../weeks.js';
	import { stepSummaries } from '../globals.js';
	import Colors from './Colors.svelte';
	import Classifiers from './Classifiers.svelte';
	import Family from './Family.svelte';
	import Opposites from './Opposites.svelte';
	import WordPick from './WordPick.svelte';
	import Radicals from './Radicals.svelte';
	import Video from './Video.svelte';
	//import ToneListening from './ToneListening.svelte';

	export let name;
	let week;

	weeks.forEach(function (w) {
		if (w.name === name) {
			week = w;
		}
	});
	
	let stepNum = -1;
	let step;

	function nextStep() {
		stepNum++;
		step = week.steps[stepNum];
	}

	function handleStepFinished () {
		nextStep();
	}

</script>

<div id="main-container">
	<div id="activities">
		<h2>Week: {week.name}</h2>
		{#each week.steps as step}
			<div>
				{#if step.title}
					{step.title}
				{:else}
					{step.name}
				{/if}
				{#if $stepSummaries[step.name]}
					: {$stepSummaries[step.name]}
				{/if}
			</div>
		{/each}
	</div>
	<div id="content">
		{#if stepNum < 0}
			<button on:click={nextStep}>Start</button>
		{:else if step}
			{#if step.name == 'Colors'}
				<Colors on:finished={handleStepFinished}/>
			{:else if step.name == 'Family'}
				<Family on:finished={handleStepFinished}/>
			{:else if step.name == 'Opposites'}
				<Opposites on:finished={handleStepFinished} side="{step.side}" />
			{:else if step.name == 'WordPick'}
				<WordPick on:finished={handleStepFinished} numWords="30" />
			{:else if step.name == 'Classifiers'}
				<Classifiers on:finished={handleStepFinished}/>
			{:else if step.name == 'Radicals'}
				<Radicals on:finished={handleStepFinished} set="{step.set}" />
			{:else if step.name == 'Video'}
				<Video video_id="{step.id}" start="{step.start}" end="{step.end}" title="{step.title}"/>
			{:else if step.name == 'ToneListening'}
				<!--ToneListening on:finished={handleStepFinished} /-->
			{/if}
		{:else}
			<div id="done">All done!</div>
		{/if}
	</div>
</div>