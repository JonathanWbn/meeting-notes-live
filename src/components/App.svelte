<script>
	import { onMount } from "svelte";
	import GlobalStyles from "./GlobalStyles.svelte";
	import InfoIcon from "../icons/info.svg";

	let text = "";

	onMount(async () => {
		await fetch(`/api/document${window.location.pathname}`)
			.then((r) => r.json())
			.then((data) => {
				text = data.text;
			});
	});

	async function handleChange() {
		await fetch(`/api/document${window.location.pathname}`, {
			method: "POST",
			body: JSON.stringify({ text }),
		});
	}
</script>

<style>
	.wrapper {
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 20px;
		width: 100%;
		max-width: 700px;
		padding: 0 20px;
	}

	h2 {
		margin: 0;
	}

	.info {
		color: rgb(100, 100, 100);
		transition-property: color 150ms cubic-bezier(0.4, 0, 0.2, 1);
		display: flex;
		text-decoration: none;
		align-items: center;
	}

	.info:hover {
		color: black;
	}

	.info :global(svg) {
		margin-right: 5px;
	}

	main {
		flex-grow: 1;
		padding: 20px;
		width: 100%;
		max-width: 700px;
	}

	textarea {
		width: 100%;
		height: 100%;
		padding: 15px;
		border: none;
		border-radius: 10px;
		font-size: 20px;
		box-shadow: 0 0 3rem rgba(128, 128, 128, 0.411);
		outline: none;
		font-family: "Inconsolata", monospace;
	}

	textarea::-webkit-resizer {
		display: none;
	}
</style>

<GlobalStyles />
<div class="wrapper">
	<header>
		<h2>Meeting Notes Live</h2>
		<a
			target="_blank"
			class="info"
			href="https://www.notion.so/jwieben/Meeting-Notes-Live-dd9571901e4e4b6bbc96225005850e8a">
			<InfoIcon class="info-icon" />
			How does this work?
		</a>
	</header>
	<main>
		<!-- svelte-ignore a11y-autofocus -->
		<textarea
			autofocus
			placeholder="Type notes here..."
			bind:value={text}
			on:keyup={handleChange} />
	</main>
</div>
