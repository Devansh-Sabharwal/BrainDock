import { useEffect } from "react";

declare global {
  interface Window {
    twttr: any;
  }
}

interface Props {
  tweetUrl: string;
}

const loadTwitterScript = () => {
  if (!document.getElementById("twitter-wjs")) {
    const script = document.createElement("script");
    script.id = "twitter-wjs";
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.charset = "utf-8";
    document.body.appendChild(script);
  }
};

const TwitterEmbed = ({ tweetUrl }: Props) => {
  useEffect(() => {
    loadTwitterScript(); // Load the Twitter script dynamically

    // Ensure the Twitter widgets are loaded/rendered
    const checkAndLoadWidgets = () => {
      if (window.twttr && window.twttr.widgets) {
        window.twttr.widgets.load();
      } else {
        setTimeout(checkAndLoadWidgets, 200);
      }
    };

    checkAndLoadWidgets();
  }, [tweetUrl]);

  return (
    <div>
      <blockquote className="twitter-tweet">
        <a href={tweetUrl}></a>
      </blockquote>
    </div>
  );
};

export default TwitterEmbed;
