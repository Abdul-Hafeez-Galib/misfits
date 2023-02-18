import cssText from "data-text:~/style.css"
import { useEffect, useState } from "react"
import { Configuration, OpenAIApi } from "openai";
import VolumeDownOutlinedIcon from "@mui/icons-material/VolumeDownOutlined";

import type { WikiMessage, WikiTldr } from "~background"
// import VolumeDown from "@mui/icons-material/VolumeDown";

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

function IndexPopup() {
  const [wikiTldr, setWikiTldr] = useState<WikiTldr>(null)
  
  const [imgUrl, setImgUrl] = useState(null)

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  })
  const openai = new OpenAIApi(configuration);
  const generateImage = async () => {
    const res = await openai.createImage({
      prompt: wikiTldr.toString(),
      n: 1,
      size: "512x512",
    });
    setImgUrl(res.data.data[0].url);
  };

  const handleSound = () => {
    const synth = window.speechSynthesis

    const utterThis = new SpeechSynthesisUtterance(wikiTldr.title)
    console.log(wikiTldr.title)

    synth.speak(utterThis)
  }

  useEffect(() => {
    chrome.runtime.onMessage.addListener(function ({type, text}: WikiMessage) {
      console.log(text)
      setWikiTldr(text)
      // generateImage()
      return true
    })
  }, [])

  return (
    <div className = "max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700" >
      <a href="#">
          <img className="rounded-t-lg" src="/docs/images/blog/image-1.jpg" alt="" />
      </a>
      <div className="p-5">
          <div className="flex justify-between">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {wikiTldr && wikiTldr["title"]}
              </h5>
              <VolumeDownOutlinedIcon className="bg-stone-600 w-6 h-6" onClick={handleSound} />
          </div>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            {wikiTldr && wikiTldr["extract"]}
          </p>
          <button className="">CLOSE</button>
      </div>
    </div>
  )
}

export default IndexPopup

