import { useEffect, useState } from "react";
import { AddIcon } from "../assets/add";
import { ShareIcon } from "../assets/share";
import { Button, RoundedButton } from "../components/Button";
import { Bars } from "../assets/bars";
import { Logout } from "../assets/socialIcons";
import { ContentPrompt } from "../components/Prompt";
import Card from "../components/Card";
import { ShareModal } from "../components/ShareModal";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { data } from "../api/data";
import { PacmanLoader } from "react-spinners";
import { toast } from 'react-toastify';
import logo from '../assets/Logo.png'; 
import SideBar from "../components/Sidebar";

export interface ContentItem {
  title: string;
  description: string;
  link: string;
  tags: string[];
  id: string;
}

export const useCustomMutation = (setContent: any) => {
  const [status, setStatus] = useState('idle');
  const { mutate } = useMutation({
    mutationFn: data,
    onSuccess: (e) => {
      const filteredContent = e.content.map((item: any) => ({
        title: item.title,
        description: item.description,
        tags: item.tags,
        link: item.link,
        id: item._id
      }));
      setContent(filteredContent);
      setStatus('success');
    },
    onError: (e) => {
      toast.error(e.message || 'An error occurred');
    },
  });
  const handleMutation = async () => {
    setStatus('loading'); // Set status to loading before mutation
    await mutate();
  };

  return { handleMutation, status ,setStatus};
};

export default function Dashboard() {
  const [viewSide, setViewSide] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [content, setContent] = useState<ContentItem[]>([]);
  const { handleMutation, status,setStatus } = useCustomMutation(setContent);
  const navigate = useNavigate();
  const [bar, setBar] = useState(false);
  const toggleSidebar = () => {
    setBar(!bar);
  };
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 1020) {
        setViewSide(true);
      } else setViewSide(false);
    }
    handleResize();
    handleMutation();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <div className="bg-black min-h-screen min-w-screen">
  <div className="bg-black w-[100%] h-[100vh] font-inter">
        {/* Topbar */}
         <div className="w-full h-[70px] fixed top-0 z-20 border-b-2 border-gray-1000 bg-black flex items-center justify-between px-4 shadow-md">
         <img onClick={() => navigate('/')} src={logo} className="cursor-pointer w-40 sm:w-48"/>
            <span className="flex gap-3">
            {!viewSide && <Button
                variant={"secondary"}
                size={"md"}
                text={"Share Content"}
                icon={ShareIcon} 
                color={"white"} 
                onClick={() => setShowShare(!showShare)}>
            </Button>}

            {!viewSide && <Button 
                variant={"secondary"} 
                size={"md"} 
                text={"Add Content"} 
                icon={AddIcon} 
                color={"white"} 
                onClick={() => setShowContent(!showContent)}>
            </Button>}

            <Button 
                variant={"secondary"} 
                size={"md"} 
                text={!viewSide ? "Logout" : ""} 
                icon={Logout} 
                color={"white"} 
                onClick={() => { localStorage.removeItem('token'); navigate('/')}}>
            </Button>
            <div
                onClick={toggleSidebar}
                className="lg:hidden h-8 w-8 cursor-pointer flex items-center justify-center">
                <Bars />
            </div>
          </span>
        </div>
        <div className="mt-[70px] flex gap-0 sm:gap-4 pr-2 bg-black">
            <SideBar 
                setContent={setContent} 
                setBar={setBar} 
                setStatus={setStatus}
                bar={bar}
                toggleSidebar={toggleSidebar}

            />
            <div className="w-full min-h-screen flex bg-black overflow-hidden mr-2">
                    <div className="w-full flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-4 bg-black h-fit m-4">
                        {content.map((item, index) => (
                        <Card
                            key={index} // Ensure unique keys for React
                            title={item.title}
                            description={item.description}
                            link={item.link}
                            tags={item.tags}
                            id={item.id}
                            setContent={setContent}
                        />
                        ))}
                    </div>
                    </div>
            </div>
        </div>
        <div className="relative h-full w-full">
  {status === 'loading' && (
    <div className="h-full w-full bg-black fixed flex justify-center items-center top-0">
      <PacmanLoader color="yellow" size={50}/>
    </div>
  )}
  
  {showContent && (
    <div className="h-full w-full backdrop-blur-sm fixed top-0 flex items-center justify-center">
      <ContentPrompt setShowContent={setShowContent} setContent={setContent}/>
    </div>
  )}
  
  {showShare && (
    <div className="h-full w-full backdrop-blur-sm fixed top-0 flex items-center justify-center">
      <ShareModal setShowShare={setShowShare}/>
    </div>
  )}
</div>

      {!showContent && viewSide && <div className="fixed bottom-8 right-4">
        <RoundedButton icon={ShareIcon} onClick={()=>setShowShare(!showShare)}></RoundedButton>
        <RoundedButton icon={AddIcon} onClick={()=>setShowContent(!showContent)}></RoundedButton>
      </div>}
    </div>
}
