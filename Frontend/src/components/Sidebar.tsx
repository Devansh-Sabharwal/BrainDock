import { Home } from "../assets/bars";
import { YT, Web, Twitter, Notion } from "../assets/socialIcons";
import { ContentItem } from "../pages/Dashboard";
import { Dispatch, SetStateAction, FC, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getTags, getUserTags } from "../api/tags";
import { toast } from "react-toastify";
interface SidebarProps {
  setContent: Dispatch<SetStateAction<ContentItem[]>>;
  toggleSidebar: () => void;
  bar: Boolean;
  setBar: Dispatch<SetStateAction<boolean>>;
  setStatus:Dispatch<SetStateAction<string>>;
  userId?:string //for share page and tokenless fetching
  share?:Boolean //for sharepage 
}

export default function SideBar(props: SidebarProps) {
  const [current, setCurrent] = useState("Home");
  
  const { mutate } = useMutation({
    mutationFn: props.share ? getUserTags : getTags,
    onSuccess: (e) => {
      const filteredContent = e.content.map((item: any) => ({
        title: item.title,
        description: item.description,
        tags: item.tags,
        link: item.link,
        id: item._id,
      }));
      props.setContent(filteredContent);
      props.setStatus('success');
      props.setBar(false);
    },
    onError: (e) => {
      props.setStatus('error');
      toast.error(e.message || 'Something went wrong');
      setCurrent("Home");
      props.setBar(false);
    }
  });

  const handleMutation = async (tag:string) => {
    props.setStatus('loading'); // Set status to loading before mutation
    if(props.share) await mutate(tag+" "+props.userId)
    else await mutate(tag);
  };

  return (
    <div className="min-h-screen bg-black flex border-r-2 border-gray-1000">
      <div
        className={`z-30 lg:z-0 lg:sticky p-3 fixed top-0 left-0 bg-black h-screen w-[250px] transition-transform duration-300 ease-in-out ${
          props.bar ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:translate-x-0`}
      >
        {props.bar && <div className="font-medium text-white text-2xl text-center py-4">Dashboard</div>}
        <div className="bg-black p-2">
        <SidebarButton
          text="Home"
          Icon={Home}
          onClick={() =>{ 
            setCurrent("Home")
            handleMutation("All")
          }}
          isActive={current === "Home"}
        />
        <SidebarButton
          text="Youtube"
          Icon={YT}
          onClick={() => {
            setCurrent("Youtube")
            handleMutation("Youtube")

          }}
          isActive={current === "Youtube"}
        />
        <SidebarButton
          text="Website"
          Icon={Web}
          onClick={() => {
            setCurrent("Website")
            handleMutation("Website")
          }}
          isActive={current === "Website"}
        />
        <SidebarButton
          text="Twitter"
          Icon={Twitter}
          onClick={() =>{ 
            setCurrent("Twitter")
            handleMutation("Twitter")
          }}
          isActive={current === "Twitter"}
        />
        <SidebarButton
          text="Notion"
          Icon={Notion}
          onClick={() => {
            setCurrent("Notion")
            handleMutation("Notion")
          }}
          isActive={current === "Notion"}
        />
        </div>
      </div>
    </div>
  );
}

interface SidebarButtonProps {
  text: string;
  Icon: FC;
  onClick?: () => void;
  isActive: boolean;
}

function SidebarButton({ text, Icon, onClick, isActive }: SidebarButtonProps) {
  return (
    <div
      onClick={onClick}
      className={`w-full my-4 px-4 py-3 flex gap-6 rounded-lg text-white font-medium hover:cursor-pointer ${
        isActive ? "bg-black border border-white " : "bg-gray-1000"
      } hover:bg-black`}
    >
      <Icon />
      <span className="text-lg">{text}</span>
    </div>
  );
}
