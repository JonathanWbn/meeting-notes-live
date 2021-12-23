import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import marked from 'marked'

import InfoIcon from '../icons/info.svg'
import CheckIcon from '../icons/check.svg'
import LoaderIcon from '../icons/loader.svg'

export default function Page({ initialText, isAuthor }) {
  const router = useRouter()
  const { id } = router.query
  const [text, setText] = React.useState(initialText)
  const [isSaving, setIsSaving] = React.useState(false)
  const [isSaved, setIsSaved] = React.useState(false)
  const debounceTimerRef = React.useRef()

  React.useEffect(() => {
    if (!isAuthor) {
      setInterval(getLatestText, 1000)
    }
  }, [])

  function getLatestText() {
    getText(id).then(setText)
  }

  function handleChange(e) {
    setText(e.target.value)
    debounce(() => updateDocument(e.target.value))
  }

  async function updateDocument(newText) {
    setIsSaving(true)
    await fetch(`/api/document/${id}`, {
      method: 'POST',
      body: JSON.stringify({ text: newText }),
    })
    setIsSaving(false)
    setIsSaved(true)
    setTimeout(() => {
      setIsSaved(false)
    }, 500)
  }

  function debounce(cb) {
    clearTimeout(debounceTimerRef.current)
    debounceTimerRef.current = setTimeout(cb, 500)
  }

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <title>Meeting Notes</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Inconsolata&family=Inter&display=swap"
          rel="stylesheet"
        />
      </Head>

      {isAuthor ? (
        <div className="wrapper">
          <header>
            <h2>Meeting Notes</h2>
            {isSaving ? (
              <div className="loading">
                <LoaderIcon />
                Saving...
              </div>
            ) : (
              isSaved && (
                <div className="loading">
                  <CheckIcon />
                  Saved.
                </div>
              )
            )}
            <a
              target="_blank"
              className="info"
              href="https://www.notion.so/jwieben/Meeting-Notes-Live-dd9571901e4e4b6bbc96225005850e8a"
            >
              <InfoIcon />
              How does this work?
            </a>
          </header>
          <main>
            <textarea
              autoFocus
              placeholder="Type notes here..."
              value={text}
              onInput={handleChange}
            />
          </main>
          <a
            className="impressum"
            href="https://www.notion.so/jwieben/Impressum-7be1b0e1a1384c1cb9362bd1aef963d1"
          >
            Impressum
          </a>
        </div>
      ) : (
        <div className="wrapper">
          <main>
            <div
              className="display markdown-body"
              dangerouslySetInnerHTML={{ __html: marked(text) }}
            ></div>
          </main>
          <a
            className="impressum"
            href="https://www.notion.so/jwieben/Impressum-7be1b0e1a1384c1cb9362bd1aef963d1"
          >
            Impressum
          </a>
        </div>
      )}
    </>
  )
}

export async function getServerSideProps(context) {
  const isAuthor = Boolean(context.req.cookies[`is-author-${context.query.id}`])
  const initialText = await getText(context.query.id, true)
  return {
    props: {
      initialText: initialText || '',
      isAuthor,
    },
  }
}

async function getText(id, fullUrl = false) {
  return fetch(
    `${
      fullUrl ? 'https://meeting-notes-live-jonathan-wbn.vercel.app' : ''
    }/api/document/${id}`
  ).then((r) => r.json())
}
