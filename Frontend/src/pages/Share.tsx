// import React from 'react'
import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import { PacmanLoader } from "react-spinners";
import {Button} from "../components/Button";
import SideBar from "../components/Sidebar";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { getShare } from "../api/share";
import logo from '../assets/Logo.png'; 
import { Bars } from "../assets/bars";
export interface ContentItem {
  title: string;
  description: string;
  link: string;
  tags: string[];
  id: string;
}
export const useCustomMutation = (setContent:any) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle');
  const [username,setUsername] = useState("");

  const{mutate} =  useMutation({
    mutationFn: getShare, 
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
      setUsername(e.username)
    },
    onError: () => {
      navigate('/error')
    },
  });
  const handleMutation = async (hash:any) => {
    setStatus('loading'); // Set status to loading before mutation
    await mutate(hash);
  };

  return { handleMutation, status,username,setStatus };
};

export function Share() {
  const { hash } = useParams();
  const [content, setContent] = useState<ContentItem[]>([]);
  const { handleMutation,status,username,setStatus } = useCustomMutation(setContent);
  const navigate = useNavigate();
  const [bar, setBar] = useState(false);
  const toggleSidebar = () => {
    setBar(!bar);
  };
  useEffect(() => {
    handleMutation(hash);
  }, [hash]);
    return <div className="bg-black min-h-screen min-w-screen">
    <div className="bg-black w-[100vw] h-[100vh] font-inter">
          {/* Topbar */}
           <div className="w-full h-[70px] fixed top-0 z-20 border-b-2 border-gray-1000 bg-black flex items-center justify-between px-4 shadow-md">
              <img src={logo} className="w-40 sm:w-48"/>
              <span className="flex gap-3">
              <Button variant="primary" color="white" size="md" text="Login" onClick={() => navigate('/login')} />
              <Button variant="primary" color="black" size="md" text="SignUp" onClick={() => navigate('/signup')} />
              <div
                  onClick={toggleSidebar}
                  className="lg:hidden h-8 w-8 cursor-pointer flex items-center justify-center">
                  <Bars />
              </div>
            </span>
          </div>
          <div className="mt-[70px] flex gap-0 sm:gap-4 bg-black px-4">
              <SideBar 
                  setContent={setContent} 
                  setBar={setBar} 
                  setStatus={setStatus}
                  bar={bar}
                  toggleSidebar={toggleSidebar}
  
              />
              <div className="w-full">
            <div className="bg-black text-center w-full px-6 pt-8 pb-0 text-xl sm:px-4 sm:pt-4 sm:pb-0 sm:text-3xl text-white font-normal">{`Welcome to ${username}'s Brain!!`}</div>

              <div className="w-full min-h-screen flex bg-black overflow-hidden">
                      <div className="w-full flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-4 bg-black h-fit m-4 mr-5">
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
          </div>
          <div className="relative h-full w-full">
    {status === 'loading' && (
      <div className="h-full w-full bg-black fixed flex justify-center items-center top-0">
        <PacmanLoader color="yellow" size={50}/>
      </div>
    )}
    
    
    
    
  </div>
  
      
      </div>
  }
  