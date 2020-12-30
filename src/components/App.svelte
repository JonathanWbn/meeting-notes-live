<script>
  import { onMount } from 'svelte'
  import marked from 'marked'
  import GlobalStyles from './GlobalStyles.svelte'
  import InfoIcon from '../icons/info.svg'
  import CheckIcon from '../icons/check.svg'
  import LoaderIcon from '../icons/loader.svg'
  import Cookies from 'js-cookie'

  const id = window.location.pathname.slice(1)
  let text = ''
  let isSaving = false
  let isSaved = false
  let debounceTimer
  const isAuthor = Boolean(Cookies.get(`is-author-${id}`))

  onMount(async () => {
    await getLatestText()

    if (!isAuthor) {
      setInterval(getLatestText, 1000)
    }
  })

  async function getLatestText() {
    await fetch(`/api/document/${id}`)
      .then((r) => r.json())
      .then((data) => {
        text = data.text
      })
  }

  function handleChange(e) {
    debounce(() => updateDocument(e.target.value))
  }

  async function updateDocument(newText) {
    isSaving = true
    await fetch(`/api/document/${id}`, {
      method: 'POST',
      body: JSON.stringify({ text: newText }),
    })
    isSaving = false
    isSaved = true
    setTimeout(() => {
      isSaved = false
    }, 500)
  }

  function debounce(cb) {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(cb, 500)
  }
</script>

<style>
  .wrapper {
    width: 100%;
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

  .loading {
    display: flex;
    align-items: center;
    flex-grow: 1;
    margin-left: 15px;
  }

  .loading :global(svg) {
    margin-right: 10px;
    width: 20px;
    height: 20px;
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
    font-family: 'Inconsolata', monospace;
  }

  textarea::-webkit-resizer {
    display: none;
  }

  .display {
    box-shadow: 0 0 3rem rgba(128, 128, 128, 0.411);
    border-radius: 10px;
    width: 100%;
    height: 100%;
    padding: 15px;
  }
</style>

<GlobalStyles />
{#if isAuthor}
  <div class="wrapper">
    <header>
      <h2>Meeting Notes Live</h2>
      {#if isSaving}
        <div class="loading">
          <LoaderIcon />
          Saving...
        </div>
      {:else if isSaved}
        <div class="loading">
          <CheckIcon />
          Saved.
        </div>
      {/if}
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
        on:input={handleChange} />
    </main>
  </div>
{:else}
  <div class="wrapper">
    <main>
      <div class="display markdown-body">
        {@html marked(text)}
      </div>
    </main>
  </div>
{/if}
