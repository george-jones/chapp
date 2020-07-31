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
</style>

<script>
	import { weeks } from './weeks.js';
	let weekName;

	function loadWeek (evt) {
		weekName = evt.currentTarget.getAttribute('data-week');
	}
</script>

<svelte:head>
	<title>Polaris Chinese Level 2</title>
</svelte:head>

{#if weekName}
	Start week: {weekName}
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