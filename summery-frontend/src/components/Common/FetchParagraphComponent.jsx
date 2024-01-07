import React, { useEffect, memo} from 'react'
import api from '../../configs/Api'
import { toast } from 'react-toastify'

const FetchParagraphComponent = ({ FetchParagraphs }) => {
  
  useEffect(() => {
     const fetchParagraphs = async () => {
         const id = toast.loading("Your data is loading...", { closeButton: true, })
         try {
            const { data: { paragraphs } } = await api.get("get-paragraphs")
            toast.update(id, { render: "Paragraphs Successfully Loaded.", type: "success", isLoading: false, autoClose: 2000 })
            FetchParagraphs(paragraphs);
        } catch (err) {
            if(err.response) {
                const { data: { message } } = err.response;
                toast.update(id, { render: message, type: "error", isLoading: false })
            } else {
                toast.update(id, { render: "Something went wrong.", type: "error", isLoading: false })
            }
         }

     }
     fetchParagraphs()
  },[])  

  return null;
}

export default memo(FetchParagraphComponent)