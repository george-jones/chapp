import { writable } from 'svelte/store';

export let testingMode = writable(false);
export let stepSummaries = writable({ });
