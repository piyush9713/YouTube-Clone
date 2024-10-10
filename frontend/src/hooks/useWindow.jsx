import { useState } from "react";
import ReactDOM from "react-dom";

const useWindow = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(null);

  const openWindow = (component) => {
    setContent(component);
    setIsOpen(true);
  };

  const closeWindow = () => {
    setIsOpen(false);
    setContent(null);
  };

  const Window = () => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(<div>{content}</div>, document.body);
  };

  return { openWindow, closeWindow, Window };
};

export default useWindow;
