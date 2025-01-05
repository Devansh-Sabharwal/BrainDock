import { TrashIcon } from "@heroicons/react/16/solid";
import { Open } from "../assets/socialIcons";
import { Button } from "./Button";
import { deletePost } from "../api/data";
import { useMutation } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";
import { ContentItem, useCustomMutation } from "../pages/Dashboard";
import TwitterEmbed from "./TwitterEmbds";
import { toast } from "react-toastify";
interface CardProps{
  title:string,
  link:string,
  description:string,
  tags?:string[],
  id:string,
  deleteIcon?:Boolean
  setContent: Dispatch<SetStateAction<ContentItem[]>>
}
export default function Card(props:CardProps){
    const {handleMutation: fetchData} = useCustomMutation(props.setContent);
    const {mutate} = useMutation({
      mutationFn:deletePost,
      onSuccess:(e)=>{
        toast.success(e.message);
        fetchData();
      },
      onError:(e)=>{
        toast.error(e.message || 'Something went wrong');

      }
    })
    const handleDelete = (id:string)=>{
      mutate(id);
    }
    return <div className="bg-black text-white 2xl:w-[24%] xl:w-[32%] lg:w-[32%] md:w-[48%] sm:w-[48%] w-[100%] rounded-lg p-4 border border-gray-1000"> 
        <div className="flex text-white justify-between items-center">
            <span className="font-medium text-xl">
                {props.title}
            </span>
            <div className="flex gap-2 items-center">
            {props.deleteIcon &&   <TrashIcon onClick={() => handleDelete(props.id)} className="size-5 cursor-pointer"></TrashIcon>}
                <Button variant="secondary" size="sm" icon={Open}  color="black" onClick={() => {
    window.open(props.link, '_blank');  // Opens the link in a new tab
  }}/>
            </div>
        </div>
        <div className="mt-2 text-sm">
            {props.description}
        </div>
        <div>
            <Main link={props.link}/>
        </div>
        <div className="flex flex-wrap gap-2">
            {
                (props.tags || []).map((e) => {
                  if(e.length)return (
                    <div className="flex items-center gap-1 bg-black text-white border border-white rounded-3xl p-1" key={e}>
                        {e}
                    </div>
                )
                    ;
                })
            }
        </div>
    </div>

}
interface MainProps{
    link:string
}
export function Main(props: MainProps) {
    const url = props.link;
    const css =
      "rounded-sm xl:my-4 lg:my-2 my-4 2xl:h-[270px] xl:h-[300px] lg:h-[220px] md:h-[180px] sm:h-[180px] h-[150px] w-full object-cover";
    function getCorrectedYoutubeUrl(url:string) {
        // Check if the URL starts with 'https://youtu.be/'
        const parsedUrl = new URL(url);

    // Handle 'https://youtu.be/' short URLs
    if (parsedUrl.hostname === "youtu.be") {
      const videoId = parsedUrl.pathname.substring(1); // Get the path after '/'
      return `https://www.youtube-nocookie.com/embed/${videoId}`;
    }

    // Handle 'https://www.youtube.com/watch?v=' full URLs
    if (parsedUrl.hostname === "www.youtube.com" && parsedUrl.pathname === "/watch") {
      const videoId = parsedUrl.searchParams.get("v"); // Extract 'v' parameter
      if (videoId) {
        return `https://www.youtube-nocookie.com/embed/${videoId}`;
      }
    }
        
      }
  
    if (url.startsWith("https://x.com/")) {
      const correctedUrl = url.replace("x.com", "twitter.com");
      return (
        <div className={`${css} flex items-center justify-center`}>
          <div className="w-full h-full overflow-hidden">
            <TwitterEmbed tweetUrl={correctedUrl}/>
            
          </div>
        </div>
      );
    }
  
    if (url.startsWith("https://youtu.be/") || url.startsWith("https://www.youtube.com/watch?v=") ) {
  
      return (
        <div className={css}>
          <iframe
            width="100%"
            height="100%"
            src={getCorrectedYoutubeUrl(url)}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      );
    }
    const [image, setImage] = useState<string | null>(null);

    const handleError = () => {
      setImage('https://img.freepik.com/free-vector/glitch-error-404-page-background_23-2148087860.jpg');
    };
  
    return (
      <div className={`${css} flex justify-center overflow-hidden h-full`}>
        <img
          className="h-full"
          src={image || `//image.thum.io/get/${url}`}
          onError={handleError} // Trigger the handleError function on error
          alt="Loaded content"
        />
      </div>
    );
  };
  