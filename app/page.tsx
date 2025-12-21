"use client";

import Exasvg from "@/public/svgs/exasvg";
import Dots from "@/utils/Dots";
import { useCallback, useEffect, useRef, useState } from "react";
import callExaSearcher from "../utils/exa";
import callOpenAi from "../utils/openai";
import Link from "next/link";

export default function Home() {
  const [writingState, setWritingState] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [timer, setTimer] = useState(null);
  const contentEditableRef = useRef(null);
  const [startGenerating, setStartGenerating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Helper function to remove duplicated text from the beginning of the response.
  // The LLM sometimes repeats part of the input text despite instructions not to.
  // This function detects overlapping text between the end of the current content
  // and the beginning of the response, then removes the duplicate.
  const removeDuplicatedPrefix = useCallback(
    (currentText: string, responseText: string): string => {
      if (!currentText || !responseText) return responseText;

      // Strip HTML tags for comparison
      const stripHtml = (html: string) =>
        html.replace(/<[^>]*>/g, "").trim();
      const cleanCurrent = stripHtml(currentText);
      const cleanResponse = stripHtml(responseText);

      // Find the longest suffix of currentText that matches a prefix of responseText
      // Check up to the last 100 characters of the current text
      const maxOverlapLength = Math.min(100, cleanCurrent.length);
      let longestOverlap = 0;

      for (let i = 1; i <= maxOverlapLength; i++) {
        const suffix = cleanCurrent.slice(-i).toLowerCase();
        const prefix = cleanResponse.slice(0, i).toLowerCase();
        if (suffix === prefix) {
          longestOverlap = i;
        }
      }

      // If we found an overlap, remove it from the response
      if (longestOverlap > 0) {
        return responseText.slice(longestOverlap).trimStart();
      }

      return responseText;
    },
    []
  );

  const generateText = useCallback(
    async (currentWritingState) => {
      if (isGenerating || !currentWritingState) return;

      setIsGenerating(true);
      try {
        let exaSearchResults = await callExaSearcher(currentWritingState);
        console.log("@@@@ WRITING STATE @@@@");
        console.log(currentWritingState);
        const response = await callOpenAi(
          exaSearchResults,
          currentWritingState
        );
        // Remove any duplicated text from the beginning of the response
        const cleanedResponse = removeDuplicatedPrefix(
          currentWritingState,
          response.text
        );
        setWritingState((prev) => prev + " " + cleanedResponse);
      } catch (error) {
        console.error("Error in generateText:", error);
      } finally {
        setIsGenerating(false);
        setStartGenerating(false);
      }
    },
    [isGenerating, removeDuplicatedPrefix]
  );

  const handleStartTrigger = useCallback(() => {
    generateText(writingState);
  }, [generateText]);

  const handleInput = useCallback(
    (event) => {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const start = range.startOffset;
      const end = range.endOffset;

      const newContent = event.currentTarget.innerHTML;

      console.log(newContent);
      setWritingState(newContent);

      // Use setTimeout to ensure DOM is updated before setting the range
      setTimeout(() => {
        const range = document.createRange();
        const selection = window.getSelection();

        // Select the contentEditable div
        range.selectNodeContents(contentEditableRef.current);

        // Collapse the range to the end
        range.collapse(false);

        // Apply the range to the selection
        selection.removeAllRanges();
        selection.addRange(range);

        // Focus on the contentEditable div
        contentEditableRef.current.focus();
      }, 0);

      if (timer) clearTimeout(timer);
      const newTimer = setTimeout(() => {
        if (contentEditableRef.current) {
          contentEditableRef.current.blur();
        }
        // setStartGenerating(true)
        // handleStartTrigger();
        generateText(newContent); // Pass the current content directly
      }, 2000);
      setTimer(newTimer);
    },
    [timer]
  );

  useEffect(() => {
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timer]);

  const renderLinksInText = useCallback((text) => {
    const linkRegex = /\(([^)]+)\)\[([^\]]+)\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      const linkText = match[1] === null ? "Source" : match[1];
      parts.push(
        `<a contenteditable="false" href="${match[2]}" target="_blank" class="text-blue-600 hover:underline">${linkText}</a>`
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.join("");
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (contentEditableRef.current && isMounted) {
      contentEditableRef.current.innerHTML = renderLinksInText(writingState);
    }
  }, [writingState, renderLinksInText, isMounted]);

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        
        <div className="w-full border-6 max-w-4xl p-6 mt-14">
          <p className="text-gray-400">DEMO</p>
          <h1 className="md:text-6xl text-4xl pb-3 font-medium">
            Get realtime{" "}
            <span className="text-brand-default">writing and citation </span>
            assistance
          </h1>

          <p className="text-black mb-3">
            Start writing your paragraph. The assistant will automatically
            generate content and add citations 1 second after you stop typing.
          </p>

          <div
            ref={contentEditableRef}
            id="input-text"
            onInput={handleInput}
            contentEditable={isGenerating ? false : true}
            className="w-full bg-white p-2 border outline-none ring-2 ring-brand-default resize-none min-h-[200px] overflow-auto"
          />

          <div className="mt-2 flex justify-between align-middle">
            <Link href="https://exa.ai" target="_blank">
              <Exasvg />
            </Link>
            <div className="text-brand-default">
              <h1 className="text-2xl text-bold">
                {isGenerating ? <Dots>Generating</Dots> : "Ready"}
              </h1>
            </div>
          </div>
        </div>
  

      <footer className="w-full py-6 px-8 mb-6 mt-auto">
        <div className="max-w-md mx-auto">
          <p className="text-lg text-center text-gray-700">
            <Link 
              href="https://dashboard.exa.ai" 
              target="_blank"
              className="underline cursor-pointer hover:text-gray-800"
            >
              Try Exa API
            </Link>
             <span className="mx-3">|</span>
            <Link 
              href="https://github.com/exa-labs/exa-writing-assist" 
              target="_blank"
              className="underline cursor-pointer hover:text-gray-800"
            >
              Project Code
            </Link>
            <span className="mx-3">|</span>
            <Link 
              href="https://exa.ai/demos" 
              target="_blank"
              className="underline cursor-pointer hover:text-gray-800"
            >
              See More Demo Apps
            </Link>
            <span className="mx-3">|</span>
            <Link 
              href="https://docs.exa.ai/examples/demo-exa-powered-writing-assistant" 
              target="_blank"
              className="underline cursor-pointer hover:text-gray-800"
            >
              Tutorial
            </Link>
          </p>
        </div>
      </footer>
      </main>
    </>
  );
}
