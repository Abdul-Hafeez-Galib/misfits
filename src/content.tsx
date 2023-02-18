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

  const handleClose = () => {
    window.close()
    // chrome.runtime.onInstalled.removeListener(function () {
    //   // chrome.contextMenus.removeAll()
    //   window.close()
    // })
  }

  const translate = (toLang) => {
    const axios = require("axios");

    const options = {
      method: 'GET',
      url: 'https://nlp-translation.p.rapidapi.com/v1/translate',
      params: { text: wikiTldr, to: toLang, from: 'en' },
      headers: {
        'X-RapidAPI-Key': 'fbad208a89msh8f2065da05d5c5bp163297jsn8d6859280295',
        'X-RapidAPI-Host': 'nlp-translation.p.rapidapi.com'
      }
    };

    axios.request(options).then(function (response) {
      console.log(response.data);
    }).catch(function (error) {
      console.error(error);
    });
  }

  useEffect(() => {
    chrome.runtime.onMessage.addListener(function ({ type, text }: WikiMessage) {
      console.log(text)
      setWikiTldr(text)
      // generateImage()
      return true
    })
  }, [])

  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700" >
      <div className="p-5">
        <div className="flex justify-between">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {wikiTldr && wikiTldr["title"]}
          </h5>
          {wikiTldr && <VolumeDownOutlinedIcon className="bg-stone-600 w-6 h-6" onClick={handleSound} />}
        </div>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {wikiTldr && wikiTldr["extract"]}
        </p>

        <button className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800" onClick={handleClose}>
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            close
          </span>
        </button>
      </div>
    </div>
  )
}

export default IndexPopup

