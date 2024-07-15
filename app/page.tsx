"use client";

import Exasvg from "@/public/svgs/exasvg";
import Dots from "@/utils/Dots";
import { useCallback, useEffect, useRef, useState } from "react";
import callExaSearcher from "../utils/exa";
import callOpenAi from "../utils/openai";

export default function Home() {
  const [writingState, setWritingState] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [timer, setTimer] = useState(null);
  const contentEditableRef = useRef(null);
  const [startGenerating, setStartGenerating] = useState(false);

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
        setWritingState((prev) => prev + " " + response.text);
      } catch (error) {
        console.error("Error in generateText:", error);
      } finally {
        setIsGenerating(false);
        setStartGenerating(false);
      }
    },
    [isGenerating]
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
    if (contentEditableRef.current) {
      contentEditableRef.current.innerHTML = renderLinksInText(writingState);
    }
  }, [writingState, renderLinksInText]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full border-6 max-w-4xl p-6">
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
          <Exasvg />
          <div className="text-brand-default">
            <h1 className="text-2xl text-bold">
              {isGenerating ? <Dots>Generating</Dots> : "Ready"}
            </h1>
          </div>
        </div>
      </div>
    </main>
  );
}
