import { Box, Button, Throbber, Tooltip } from '@rocket.chat/fuselage';
import type { Meta, StoryFn } from '@storybook/react';

import '@rocket.chat/icons/dist/rocketchat.css';
import {
	MessageComposer,
	MessageComposerAction,
	MessageComposerToolbarActions,
	MessageComposerInput,
	RichTextComposerInput,
	MessageComposerToolbar,
	MessageComposerActionsDivider,
	MessageComposerToolbarSubmit,
	MessageComposerSkeleton,
	MessageComposerHint,
} from '.';
import React, { useEffect, useRef, useState } from 'react';

export default {
	title: 'Components/MessageComposer',
	component: MessageComposer,
} satisfies Meta<typeof MessageComposer>;

const MessageToolbarActions = () => (
	<MessageComposerToolbarActions>
		<MessageComposerAction icon='emoji' />
		<MessageComposerActionsDivider />
		<MessageComposerAction icon='bold' />
		<MessageComposerAction icon='italic' />
		<MessageComposerAction icon='underline' />
		<MessageComposerAction icon='strike' />
		<MessageComposerAction icon='code' />
		<MessageComposerAction icon='multiline' />
		<MessageComposerAction icon='link' />
		<MessageComposerAction icon='katex' />
		<MessageComposerAction icon='arrow-return' />
		<MessageComposerActionsDivider />
		<MessageComposerAction icon='mic' />
		<MessageComposerAction icon='video' />
		<MessageComposerAction icon='clip' />
		<MessageComposerAction icon='plus' />
	</MessageComposerToolbarActions>
);

export const MessageToolberActions: StoryFn<typeof MessageComposerToolbarActions> = () => <MessageToolbarActions />;

export const _MessageComposer: StoryFn<typeof MessageComposer> = () => (
	<MessageComposer>
		<MessageComposerInput placeholder='Text' />
		<MessageComposerToolbar>
			<MessageToolbarActions />
		</MessageComposerToolbar>
	</MessageComposer>
);

export const RichTextComposer: StoryFn<typeof MessageComposer> = (args) => (
	<>
		<MessageComposerHint icon='flask' helperText=''>
			Experiment: Real Time Composer
		</MessageComposerHint>
		<MessageComposer>
			<RichTextComposerInput placeholder={args.placeholder || 'Placeholder text'} hidePlaceholder={args.hidePlaceholder} />
			<MessageComposerToolbar>
				<MessageToolbarActions />
				<MessageComposerToolbarSubmit>
					<MessageComposerAction aria-label='Send' icon='send' disabled={false} secondary={true} info={true} />
				</MessageComposerToolbarSubmit>
			</MessageComposerToolbar>
		</MessageComposer>
	</>
);

RichTextComposer.args = {
	// Define the props (args) you want to control
	placeholder: 'Type a message...',
	hidePlaceholder: false,
};

export const MessageComposerWithHints: StoryFn<typeof MessageComposer> = () => (
	<>
		<MessageComposerHint
			icon='pencil'
			helperText={
				<>
					<strong>esc</strong> to cancel · <strong>enter</strong> to save
				</>
			}
		>
			Editing message
		</MessageComposerHint>
		<MessageComposer>
			<MessageComposerInput placeholder='Text' value='Lorem ipsum dolor' />
			<MessageComposerToolbar>
				<MessageToolbarActions />
				<MessageComposerToolbarSubmit>
					<MessageComposerAction aria-label='Send' icon='send' disabled={false} secondary={true} info={true} />
				</MessageComposerToolbarSubmit>
			</MessageComposerToolbar>
		</MessageComposer>
	</>
);

export const MessageComposerWithSubmitActions: StoryFn<typeof MessageComposer> = () => (
	<MessageComposer>
		<MessageComposerInput placeholder='Text' />
		<MessageComposerToolbar>
			<MessageToolbarActions />
			<MessageComposerToolbarSubmit>
				<Button small>Preview</Button>
				<Button primary small>
					Send
				</Button>
			</MessageComposerToolbarSubmit>
		</MessageComposerToolbar>
	</MessageComposer>
);

let nextSpanId = 0;

export const MessageComposerAIEnhanced = () => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [html, setHtml] = useState('<p>Select text to enhance&hellip;</p>');
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });

  const simulateApiCall = (type: 'enhance' | 'emoji' | 'translate' , input: string): Promise<string> => {
    let delay = Math.floor(Math.random() * 15000) + 15000;
    if(type==='enhance'){
      delay = 30000; // 25 seconds for enhance
    }
    else if(type==='emoji'){
      delay = 10000; // 5 seconds for emoji
    }
    return new Promise((resolve) =>
      setTimeout(
        () => {
        const result =
          type === 'enhance'
            ? input.split('\n').map(() => `Rocket.Chat 2025 GSoC contributors Ishan Mitra and Ayush Kumar are doing amazing work. Ishan's real-time rendering composer is a complete rewrite of the composer that is extensible and has a migration path to mobile app on ReactNative. Ayush is building on Ishan's work and allowing full control over Al enhancements as user compose their messages.`).join('\n')
            : type === 'emoji'
            ? input
            .split('\n')
            .map((line) =>
              line
                .replace(/exciting/, 'exciting🚀')
                .replace(/kick it around/, 'kick it around 💣')
                .replace(/don’t forget/, 'don’t forget 🤔')
                .replace(/feedback and comments/, 'feedback and comments 😉👍')
            )
            .join('\n')
            : input.split('\n').map(() => '--Translate--').join('\n');
        resolve(result);  
    },
        delay,
      ),
    );
  };

  // const simulateApiCall = (
  //   type: 'enhance' | 'emoji' | 'translate',
  //   input: string
  // ): Promise<string> => {
  //   const delay = Math.floor(Math.random() * 15000) + 15000;
  //   return new Promise((resolve) =>
  //     setTimeout(() => {
  //       const core =
  //         type === 'enhance'
  //           ? 'Summarization'
  //           : type === 'emoji'
  //           ? '😊Emojification😊'
  //           : 'Translate';

  //       // build a line-by-line placeholder that's exactly as long as each line of input
  //       const result = input
  //         .split('\n')
  //         .map((line) => {
  //           const totalLen = line.length;
  //           const padLen = Math.max(0, totalLen - core.length);
  //           const leftPad = Math.floor(padLen / 2);
  //           const rightPad = padLen - leftPad;
  //           return '-'.repeat(leftPad) + core + '-'.repeat(rightPad);
  //         })
  //         .join('\n');

  //       resolve(result);
  //     }, delay)
  //   );
  // };

  /**
   * Check selection and update tooltip
   */
  function updateTooltipPosition(e: MouseEvent) {
    const sel = document.getSelection();
    if (!sel || sel.isCollapsed || !containerRef.current) {
      return setShowTooltip(false);
    }
    if(sel.isCollapsed){
      return setShowTooltip(false);
    }
    // place tooltip at pointer location
    const containerRect = containerRef.current.getBoundingClientRect();
    setTooltipPos({
      top: e.clientY - containerRect.top - 40,
      left: e.clientX - containerRect.left,
    });
    setShowTooltip(true);
  }

  /**
   * Enhance the selected text
   */
  const wrapSelectionAndEnhance = (type: 'enhance' | 'emoji' | 'translate') => {
    const sel = document.getSelection();
    if (!sel || sel.isCollapsed || !editorRef.current) {
      return;
    }

    const range = sel.getRangeAt(0);
    const raw = sel.toString();
    range.deleteContents();

    const span = document.createElement('span');
    const id = ++nextSpanId;
    span.className = `ai-placeholder ai-${type}`;
    span.dataset.id = id.toString();
    span.textContent = raw;
    range.insertNode(span);

    sel.removeAllRanges();
    setHtml(editorRef.current.innerHTML);
    setShowTooltip(false);

    simulateApiCall(type, raw).then((enhanced) => {
      if (!editorRef.current) {
        return;
      }
      const el = editorRef.current.querySelector<HTMLSpanElement>(
        `span.ai-placeholder.ai-${type}[data-id=\"${id}\"]`
      );
      if (!el) {
        return;
      }
      el.textContent = enhanced;
      el.classList.replace('ai-placeholder', 'ai-enhanced');
      setHtml(editorRef.current.innerHTML);
    });
  };

  // Attach mouseup listener to track selection
  useEffect(() => {  
    document.addEventListener('mouseup', updateTooltipPosition);
    return () => {
      document.removeEventListener('mouseup', updateTooltipPosition);
    };
  }, []); // ← run *once* after first mount

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {showTooltip && (
        <div
          className="enhance-tooltip"
          style={{
            position: 'absolute',
            top: tooltipPos.top,
            left: tooltipPos.left,
            transform: 'translateX(-50%)',
            zIndex: 9999,
            display: 'flex',
          }}
        >
          <div className="tooltip">
            <Button small  borderRadius={0} onClick={() => wrapSelectionAndEnhance('enhance')} >Σ</Button>
            <span className="tooltiptext">AI Summary</span>
          </div>
          <div className="tooltip">
            <Button small icon="emoji" borderRadius={0} onClick={() => wrapSelectionAndEnhance('emoji')} />
            <span className="tooltiptext">AI Emojify</span>
          </div>
          <div className="tooltip">
            <Button small icon="language" borderRadius={0} onClick={() => wrapSelectionAndEnhance('translate')} />
            <span className="tooltiptext">AI Translate</span>
          </div>
        </div>
      )}

      <MessageComposer>
        <RichTextComposerInput
          ref={editorRef}
          value={html}
          onInput={() => {
            setHtml(editorRef.current!.innerHTML);
          }}
          contentEditable
        />
        <MessageComposerToolbar>
          <MessageToolbarActions />
          <MessageComposerToolbarSubmit>
            <MessageComposerAction aria-label="Send" icon="send" disabled={false} secondary info />
          </MessageComposerToolbarSubmit>
        </MessageComposerToolbar>
      </MessageComposer>

      <style>{`
        .ai-placeholder {
          padding: 0.1em 0;
          white-space: pre-wrap;
          color: transparent;
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        .ai-enhanced {
          background: transparent;
          color: inherit;
        }
        @keyframes shimmer {
          0% { background-position: -100% 0; }
          100% { background-position: 200% 0; }
        }

        /* placeholders per type */
        .ai-enhance.ai-placeholder {
          background-image: linear-gradient(90deg, #ffe0e0 0%, #ffb2b2 50%, #ffe0e0 100%);
        }
        .ai-emoji.ai-placeholder {
          background-image: linear-gradient(90deg, #e0ffe0 0%, #b2ffb2 50%, #e0ffe0 100%);
        }
        .ai-translate.ai-placeholder {
          background-image: linear-gradient(90deg, #e0e0ff 0%, #b2b2ff 50%, #e0e0ff 100%);
        }

        .enhance-tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-width: 5px 5px 0 5px;
          border-style: solid;
          border-color: #E4E7EA transparent transparent transparent;
        }
        .tooltip {
          position: relative;
          display: inline-block;
        }
        .tooltip .tooltiptext {
          visibility: hidden;
          background-color: rgba(0,0,0,0.8);
          color: #fff;
          text-align: center;
          border-radius: 4px;
          padding: 4px 8px;
          font-size: 12px;
          position: absolute;
          bottom: 125%;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10000;
          white-space: nowrap;
        }
        .tooltip .tooltiptext::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-width: 5px;
          border-style: solid;
          border-color: rgba(0,0,0,0.8) transparent transparent transparent;
        }
        .tooltip:hover .tooltiptext {
          visibility: visible;
        }
      `}</style>
    </div>
  );
};


export const MessageComposerLoading: StoryFn<typeof MessageComposer> = () => <MessageComposerSkeleton />;
