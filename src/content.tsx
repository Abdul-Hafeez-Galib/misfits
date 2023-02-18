import cssText from "data-text:~/style.css"
import { useEffect, useState } from "react"

import type { WikiMessage, WikiTldr } from "~background"

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

function IndexPopup() {
  const [wikiTldr, setWikiTldr] = useState<WikiTldr>(null)

  useEffect(() => {
    chrome.runtime.onMessage.addListener(function ({type, text}: WikiMessage) {
      console.log(text)
      setWikiTldr(text)
      return true
    })
  }, [])

  return (
    
<div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
    <a href="#">
        <img className="rounded-t-lg" src="/docs/images/blog/image-1.jpg" alt="" />
    </a>
    <div className="p-5">
        <a href="#">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {wikiTldr && wikiTldr["title"]}
            </h5>
        </a>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {wikiTldr && wikiTldr["extract"]}
        </p>
        
    </div>
</div>

  )
}

export default IndexPopup
