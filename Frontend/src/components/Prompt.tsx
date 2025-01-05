import { Dispatch, SetStateAction } from "react";
import { ContentItem, useCustomMutation } from "../pages/Dashboard";
interface PromptProps {
    setShowContent: (value: boolean) => void;
      setContent: Dispatch<SetStateAction<ContentItem[]>>
}
import { useState,useEffect } from "react";
import { ChevronDoubleDownIcon } from "@heroicons/react/16/solid";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { Button } from "./Button";
import { createPost } from "../api/data";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
export function ContentPrompt({ setShowContent,setContent }: PromptProps) {
    const [tags,setTags] = useState(false);
    const [tagList,setTagList] = useState<string[]>([]);
    const [title,setTitle] = useState('')
    const [desc,setDesc] = useState('')
    const [url,setUrl] = useState('')
    const {handleMutation: fetchData} = useCustomMutation(setContent);
    const [tagInput, setTagInput] = useState("");
    const handleAddTag = () => {
      if (tagInput && !tagList.includes(tagInput)) { // Check if the input is not empty and not already in the list
        setTagList((prev) => Array.from(new Set([...prev, tagInput])));
        setTagInput(""); // Clear the input field after adding
      }}
    const removeTag = (tag: string) => {
        setTagList((prev) => prev.filter((t) => t !== tag));
      };
      const{mutate,status} = useMutation({
        mutationFn:createPost,
        onSuccess:(e)=>{
            toast.success(e.message);
            setShowContent(false);
            fetchData();
        },
        onError:(e)=>{
          toast.error(e.message || 'Something went wrong');

        }
      })
      useEffect(() => {
        if (status === 'pending') {
          toast.info('Adding Content...', { 
            toastId: 'loadingToast', // Prevents duplicate toasts
          });
        } else if (status === 'success' || status === 'error') {
          // Close the toast once the mutation is successful or failed
          toast.dismiss('loadingToast');
        }
      }, [status]);
    const handleSubmit = ()=>{
      const details={
        title:title,
        description:desc,
        tags:tagList,
        link:url
      }
      mutate(details)
    }
    return <div className="p-5 rounded-lg bg-black w-[300px] sm:w-[450px] border-2 border-gray-1000 h-fit">
        <div className="text-white mb-3 text-xl">
            New Content
        </div>
        <form className="flex flex-col gap-3 text-sm">
            <Field type={"text"} onChange={(e) => setTitle(e.target.value)} title="Title" placeholder="Title of the Content" />
            <Field type={"text"} onChange={(e)=>setDesc(e.target.value)} title="Description" placeholder="Desc of the content"/>
            <Field type={"text"} onChange={(e)=>setUrl(e.target.value)} title="Url" placeholder="Url of the content"/>
        </form>
        {tagList.length > 0 && (
        <div className="flex flex-wrap gap-2 m-1 p-3">
            {tagList.map((e: string) => (
            <TagCircle text={e} removeTag={removeTag} />
            ))}
        </div>
        )}
      <div className="flex bg-transparent border border-gray-1000 rounded-lg text-white mt-4 items-center p-1">
              <input
        
              type="text"
              value={tagInput}
              className="bg-transparent rounded-lg p-3 text-white w-[70%]"
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddTag();
                }
              }}
              placeholder="Enter tag"
            />
            <div className="flex items-center">
            <div onClick={()=>setTags(!tags)} className="cursor-pointer p-3 bg-transparent h-10 text-white text-xs sm:text-lg">Select</div>
            <ChevronDoubleDownIcon onClick={()=>setTags(!tags)} className="h-5 hover:cursor-pointer"></ChevronDoubleDownIcon>
            </div>
      </div>
        {tags && <TagOptions setTagList={setTagList} />}
        <div className="flex justify-between p-4 px-0">
            <Button variant="secondary" size="md" text="Cancel" color="black" onClick={()=>{setShowContent(false)}}></Button>
            <Button variant="secondary" size="md" text="Submit" color="white" onClick={handleSubmit}></Button>
        </div>
    </div>
}
interface FieldProps {
    title: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?:string;
    type:string
}

export function Field({ title, placeholder,onChange,value,type }: FieldProps) {
    return <label htmlFor={title} className="flex flex-col text-black-300 gap-2">
        <span className="text-white font-medium text-md">{title}</span>
        <input onChange={onChange} type={type} name={title} placeholder={placeholder} value={value} className="bg-transparent border border-gray-1000 rounded-lg p-3 text-white" />
    </label>

}
interface TagOptionsPrompt {
    setTagList: (value: (prev: string[]) => string[]) => void;
  }
  
  function TagOptions({ setTagList }: TagOptionsPrompt) {
    return (
      <div className="p-3 border border-gray-1000 rounded-lg flex flex-col gap-2 max-h-[175px] overflow-y-scroll scrollbar outline-none">
        <div
          onClick={() =>
            setTagList((prev) => Array.from(new Set([...prev, "Notion"])))
          }
          className="text-white p-3 rounded-lg hover:bg-gray-1000 hover:cursor-pointer"
        >
          Notion
        </div>
        <div
          onClick={() =>
            setTagList((prev) => Array.from(new Set([...prev, "Youtube"])))
          }
          className="text-white p-3 rounded-lg hover:bg-gray-1000 hover:cursor-pointer"
        >
          Youtube
        </div>
        <div
          onClick={() =>
            setTagList((prev) => Array.from(new Set([...prev, "Twitter"])))
          }
          className="text-white p-3 rounded-lg hover:bg-gray-1000 hover:cursor-pointer"
        >
          Twitter
        </div>
        <div
          onClick={() =>
            setTagList((prev) => Array.from(new Set([...prev, "Website"])))
          }
          className="text-white p-3 rounded-lg hover:bg-gray-1000 hover:cursor-pointer"
        >
          Website
        </div>
      </div>
    );
  }
  
  interface TagCircleProps {
    text: string;
    removeTag: (tag: string) => void;
  }
  
  export function TagCircle({ text, removeTag }: TagCircleProps) {
    return (
      <div className="flex items-center gap-1 bg-black text-white border border-white rounded-3xl p-1">
        {text}
        <XMarkIcon
          className="h-5 hover:cursor-pointer"
          onClick={() => removeTag(text)}
        />
      </div>
    );
  }
