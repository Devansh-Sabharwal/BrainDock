import { Button } from "./Button";
import { useEffect, useState } from "react";
import { shareContent,shareStatus } from "../api/share";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
interface ShareProps {
    setShowShare: (value: boolean) => void;
  }
export function ShareModal(props:ShareProps){
    const [share,setShare] = useState(false);
    const [hash,setHash] = useState<string>("");
    const {mutate:status} = useMutation({
      mutationFn:shareStatus,
      onSuccess:(e)=>{
        setShare(!e.enabled);
        if(e.hash!=="No Link to Share"){
          setHash("https://braindock.vercel.app/share/"+e.hash);
        }
        else setHash(e.hash);
      },
      onError:(e)=>{
        toast.error(e.message || 'Something went wrong');
      }
    })
    const {mutate:toggle} = useMutation({
      mutationFn:shareContent,
      onSuccess:(e)=>{
        setHash(e.hash);
      },
      onError:(e)=>{
        toast.error(e.message || 'Something went wrong');
      },
    })
    const handleToggle=()=>{
      toggle(share);
    }
    const handleCopy = () => {
        navigator.clipboard
          .writeText(hash)
          .then(() => {
            toast.success("Text copied to clipboard!");
          })
          .catch((err) => {
            toast.error("Failed to copy text: ", err);
          });
      };
      useEffect(()=>{
        status();
      },[])
    return <div className="p-5 rounded-lg bg-black w-[400px] sm:w-[550px] border-2 border-gray-1000 h-fit">
        <div className="flex sm:justify-between items-center">
            <div className="text-white w-[80%] break-all">{hash}</div>
            <span className="text-white p-2 h-fit hover:cursor-pointer border border-gray-1000" >
                <input className="mr-3 size-4" type="checkbox" checked={!share} onClick={()=>{
                setShare(!share);
                handleToggle();
            }}/>
                Share
            </span>
        </div>
        <div className="flex justify-between">
        <Button variant="secondary" size="md" text="Cancel" color="white" onClick={()=>{props.setShowShare(false)}}></Button>
        <Button variant="secondary" size="md" text="Copy" color="white" onClick={handleCopy}></Button>

        </div>
    </div>
}