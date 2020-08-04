<style>
#content {
	background-color: #333;
	padding: 15px;
}

#content li {
	cursor: pointer;
}

#content li:hover {
	text-decoration: underline;
	text-decoration-color: #777;
}

#testingMode {
	position: fixed;
	left: 0px;
	bottom: 0px;
	font-size: 14px;
	background-color: #ff5;
	color: #000;
	padding: 3px;
	border-radius: 3px;
}
</style>

<script>
	const { ipcRenderer } = require('electron');

	import Week from './components/Week.svelte';
	import { weeks } from './weeks.js';
	import { testingMode } from './globals.js';
	
	let weekName;

	function loadWeek (evt) {
		weekName = evt.currentTarget.getAttribute('data-week');
	}

	ipcRenderer.on('toggletestmode', (event, message) => {
		testingMode.update(function (v) {
			return !v;
		});
	});
</script>

<svelte:head>
	<title>Polaris Chinese Level 2</title>
</svelte:head>

{#if weekName}
	<Week name="{weekName}" />
{:else}
	<div id="content">
		<h1>Polaris Chinese Level 2</h1>

		<ul>
		{#each weeks as week}
			<li on:click={loadWeek} data-week="{week.name}">Week: {week.name}</li>
		{/each}
		</ul>
	</div>
{/if}

{#if $testingMode}
	<div id="testingMode">Testing Mode</div>
{/if}