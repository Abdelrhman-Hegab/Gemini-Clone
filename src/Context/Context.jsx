import { createContext, useState } from "react";
import runChat from "../config/gemini";

const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentprompts, setRecentPrompts] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    const delay = (index, nextWord) => {
        setTimeout(() => {
            setResultData((prev) => prev + nextWord);
        }, 75 * index);
    };
    const newChat = () => { 
        setLoading(false);
        setShowResults(false);
        setInput("");
    }
    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResults(true);
        let response;
        if (prompt !== undefined) {
            response= await runChat(prompt);
            setRecentPrompts(prompt);
        } else {
            setPrevPrompts((prev) => [...prev, input]);
            setRecentPrompts(input);
            response = await runChat(input);
        }
        let responseArray = response.split("**");
        let newResponse ="";
        for (let i = 0; i < responseArray.length; i++) {
            if (i === 0 || i % 2 !== 1) {
                newResponse += responseArray[i];
            } else {
                newResponse += "<b>" + responseArray[i] + "</b>";
            }
        }
        let newResponse2 = newResponse.split("*").join("<br/>");
        let newResponeArray = newResponse2.split(" ");
        for (let i = 0; i < newResponeArray.length; i++) {
            delay(i, newResponeArray[i] + " ");
        }
        setInput("");
        setLoading(false);
    };

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        showResults,
        loading,
        onSent,
        resultData,
        input,
        setInput,
        recentprompts,
        setRecentPrompts,
        newChat,
    };
    return (
        <Context.Provider value={contextValue}>{props.children}</Context.Provider>
    );
};

export default ContextProvider;
export { Context };
