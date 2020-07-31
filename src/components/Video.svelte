<style>
</style>

<script>
export let video_id;
export let start;
export let end;
export let title;
let fullUrl;

fullUrl = 'https://www.youtube.com/embed/' + video_id + '?start=' + start + '&end=' + end;
</script>

<iframe title="{title}" width="1024" height="576" src="{fullUrl}" frameborder="0" ></iframe> 
<div>Notes:</div>
<textarea rows="10" cols="120" />