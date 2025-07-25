import { Button } from '@rocket.chat/fuselage';
import type { Meta, StoryFn } from '@storybook/react';
import { useCallback, useEffect, useState, useRef, type RefObject, type ReactElement } from 'react';
import { createPortal } from 'react-dom';

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

// ##################################################################
// ## Full implementation of the useAIEnhancement hook and styles  ##
// ##################################################################

const PULSE_ANIMATION_STYLE = `
/* ... (existing animation styles) ... */
@keyframes aiBackgroundPulse {
  0% { background-color: var(--pulse-color-start); }
  50% { background-color: var(--pulse-color-end); }
  100% { background-color: var(--pulse-color-start); }
}

@keyframes aiPopupAnimate {
	from {
		opacity: 0;
		transform: translate(-50%, -90%) scale(0.95);
	}
	to {
		opacity: 1;
		transform: translate(-50%, -110%) scale(1);
	}
}
.ai-enhancement-transform {
  user-select: none;
  animation: aiBackgroundPulse 1.5s ease-in-out infinite;
  margin-left: 1px;
  margin-right: 1px;
}

.ai-enhancement-summary {
  --pulse-color-start: rgba(255, 220, 0, 0.25);
  --pulse-color-end: rgba(255, 220, 0, 0.45);
}

.ai-enhancement-emoji {
  --pulse-color-start: rgba(0, 200, 255, 0.25);
  --pulse-color-end: rgba(0, 200, 255, 0.45);
}

.ai-enhancement-translation {
  --pulse-color-start: rgba(0, 255, 120, 0.25);
  --pulse-color-end: rgba(0, 255, 120, 0.45);
}

.ai-enhancement-suggestion {
	position: relative;
	border-radius: 4px;
	margin: -2px -3px;
	cursor: default;
	display: inline;
	transition: all 0.2s ease-in-out;
}

.ai-enhancement-suggestion:hover {
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ai-suggestion-summary {
	background-color: #fffbe6;
  color: rgb(5, 151, 255);
	border: 2px dashed rgb(0, 0, 0);
  margin-left: 1px;
  margin-right: 1px;
}

.ai-suggestion-emoji {
	background-color: #e6f7ff;
  color: rgb(5, 151, 255);
	border: 2px dashed rgb(0, 0, 0);
  margin-left: 1px;
  margin-right: 1px;
}

.ai-suggestion-translation {
	background-color: #f6ffed;
  color: rgb(5, 151, 255);
	border: 2px dashed rgb(0, 0, 0);
  margin-left: 1px;
  margin-right: 1px;
}

.ai-enhancement-suggestion:hover .ai-suggestion-actions {
	display: flex;
}

.ai-suggestion-actions {
	position: absolute;
	top: -12px;
	left: -12px;
	display: none;
	gap: 4px;
	background: #fff;
	border-radius: 16px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	padding: 3px;
	z-index: 10;
	line-height: 1;
}

.ai-suggestion-actions button {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 20px;
	height: 20px;
	border-radius: 50%;
	border: none;
	cursor: pointer;
	font-size: 12px;
	color: #fff;
	transition: all 0.2s ease-in-out;
}

.ai-suggestion-actions .accept {
	background-color: #52c41a;
}
.ai-suggestion-actions .accept:hover {
	background-color: #73d13d;
}

.ai-suggestion-actions .reject {
	background-color: #f5222d;
}
.ai-suggestion-actions .reject:hover {
	background-color: #ff4d4f;
}

.ai-enhancement-popup {
  display: flex;
  gap: 0;
  background: var(--rc-color-surface, #fff);
  border: 1px solid var(--rc-color-border-light, #ccc);
  border-radius: 3px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  transform: translate(-50%, -110%);
  animation: aiPopupAnimate 0.25s ease-out;
  padding: 1px;
}
.ai-enhancement-popup button {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 0.6rem;
  border-radius: 2px;
  color: var(--rc-color-font-default, #1f2329);
  line-height: 1;
  padding: 2px;
}
.ai-enhancement-popup button:hover {
  background: var(--rc-color-primary-light, #e8f0fe);
}

/* **FIX**: Add generic CSS for the tooltip to make it visible */
.with-tooltip {
  position: relative;
}
.with-tooltip::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 110%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #1f2329;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 10000;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s, visibility 0.2s;
}
.with-tooltip:hover::after {
  visibility: visible;
  opacity: 1;
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
display: inline;
z-index: 10000;
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
`;

let styleElement: HTMLStyleElement | null = null;

const ensureStylesInjected = () => {
	if (styleElement) {
		return;
	}
	styleElement = document.createElement('style');
	styleElement.innerHTML = PULSE_ANIMATION_STYLE;
	document.head.appendChild(styleElement);
};

type PopupState = { x: number; y: number } | null;

type AIAction = 'summary' | 'emoji' | 'translation';
let nextSpanId = 0;
const useAIEnhancement = (contentRef: RefObject<HTMLDivElement>): ReactElement | null => {
	const [popup, setPopup] = useState<PopupState>(null);

	useEffect(() => {
		ensureStylesInjected();
	}, []);

	const clearPopup = useCallback(() => setPopup(null), []);

	useEffect(() => {
		const refNode = contentRef.current;
		if (!refNode) {
			return;
		}

		const handleMouseUp = (event: MouseEvent) => {
			const selection = window.getSelection();
			if (!selection || selection.isCollapsed) {
				setPopup(null);
				return;
			}
			const range = selection.getRangeAt(0);
			if (!refNode.contains(range.commonAncestorContainer)) {
				setPopup(null);
				return;
			}
			const cursorPosition = { x: event.clientX, y: event.clientY };
			setPopup(cursorPosition);
		};

		refNode.addEventListener('mouseup', handleMouseUp);
		return () => {
			refNode.removeEventListener('mouseup', handleMouseUp);
		};
	}, [contentRef]);

	const runAIAction = useCallback(
		async (type: AIAction) => {
			const selection = window.getSelection();
			if (!selection || selection.isCollapsed || !contentRef.current) {
				clearPopup();
				return;
			}
			const range = selection.getRangeAt(0);
			const selectedText = range.toString();

			// 1. Create a placeholder span with a unique ID, similar to the example
			const id = ++nextSpanId;
			const span = document.createElement('span');
			span.className = `ai-enhancement-transform ai-enhancement-${type}`;
			span.dataset.id = id.toString(); // Add unique ID
			span.textContent = selectedText;
			span.dataset.originalText = selectedText;

			range.deleteContents();
			range.insertNode(span);

			selection.removeAllRanges();
			clearPopup();

			span.setAttribute('contenteditable', 'false');

			// 2. Simulate the API call with logic from the example
			const result = await new Promise<string>((resolve) => {
				let delay: number = 2000;
				if(type === 'summary') {
					delay = 15000;
				} else if(type === 'emoji') {
					delay = 7000;
				}
				setTimeout(() => {
					let enhancedText = '';
					switch (type) {
						case 'summary':
						
							// Replaces the original text with a fixed paragraph
							enhancedText = `They are working on two projects: \n*  realtime rendering composer \n*  realtime AI enhancements \n\nAnd are making good headways on the projects. Even though it is only mid-term, they already offer us a preview of the work done that we can actually try hands-on. `;
							break;
						case 'emoji':
							// Modifies the original text with specific replacements
							enhancedText = selectedText
								.replace(/exciting/g, 'exciting🚀')
								.replace(/kick it around/g, 'kick it around 💣')
								.replace(/don’t forget/g, 'don’t forget 🤔')
								.replace(/comments you have/g, 'comments you have 😉👍');
								
							break;
						case 'translation':
						default:
							// Replaces the original text with a simple placeholder
							enhancedText = '--Translate--';
							break;
					}
					resolve(enhancedText);
				}, delay);
			});

			// Find the correct span using the unique ID before modifying it
			const elementToUpdate = contentRef.current.querySelector<HTMLSpanElement>(`span[data-id='${id}']`);
			if (!elementToUpdate) {
				return;
			}

			// 3. The rest of the logic (typing effect, adding buttons) remains the same
			await new Promise<void>((resolveTyping) => {
				const chars = result.split('');
				let idx = 0;
				elementToUpdate.classList.remove('ai-enhancement-transform', `ai-enhancement-${type}`);
				const interval = setInterval(() => {
					elementToUpdate.textContent = result.slice(0, idx + 1);
					idx += 1;
					if (idx === chars.length) {
						clearInterval(interval);
						resolveTyping();
					}
				}, 30);
			});

			const finalTransformedText = elementToUpdate.textContent;

			elementToUpdate.removeAttribute('contenteditable');
			elementToUpdate.className = `ai-enhancement-suggestion ai-suggestion-${type}`;

			const actions = document.createElement('span');
			actions.className = 'ai-suggestion-actions';
			actions.setAttribute('contenteditable', 'false');

			const acceptBtn = document.createElement('button');
			acceptBtn.textContent = '✓';
			acceptBtn.className = 'accept';
			acceptBtn.setAttribute('type', 'button');
			acceptBtn.onclick = () => {
				if (elementToUpdate.parentNode) {
					const textNode = document.createTextNode(finalTransformedText || '');
					elementToUpdate.parentNode.replaceChild(textNode, elementToUpdate);
				}
			};

			const rejectBtn = document.createElement('button');
			rejectBtn.textContent = '✗';
			rejectBtn.className = 'reject';
			rejectBtn.setAttribute('type', 'button');
			rejectBtn.onclick = () => {
				if (elementToUpdate.parentNode) {
					const textNode = document.createTextNode(elementToUpdate.dataset.originalText || '');
					elementToUpdate.parentNode.replaceChild(textNode, elementToUpdate);
				}
			};

			actions.appendChild(acceptBtn);
			actions.appendChild(rejectBtn);

			let tooltipText = '';
			switch (type) {
				case 'summary':
					tooltipText = 'AI Summary';
					break;
				case 'emoji':
					tooltipText = 'AI Emojify';
					break;
				case 'translation':
					tooltipText = 'AI Translation';
					break;
			}

			const tooltipSpan = document.createElement('span');
			tooltipSpan.className = 'tooltiptext';
			tooltipSpan.textContent = tooltipText;

			elementToUpdate.classList.add('tooltip');
			elementToUpdate.appendChild(actions);
			elementToUpdate.appendChild(tooltipSpan);
		},
		[clearPopup, contentRef],
	);

	if (!popup) {
		return null;
	}

	const popupElement = (
		<div
			className='ai-enhancement-popup'
			style={{ position: 'fixed', top: popup.y, left: popup.x }}
			onMouseDown={(e) => e.preventDefault()}
		>
			<div className='tooltip'>
				<Button small onClick={() => runAIAction('summary')} icon='keyboard' data-tooltip={'AI summarize'} />
				<span className='tooltiptext'>AI Summary</span>
			</div>
			<div className='tooltip'>
				<Button small onClick={() => runAIAction('emoji')} icon='emoji' data-tooltip={'AI emojify'} />
				<span className='tooltiptext'>AI Emojify</span>
			</div>
			<div className='tooltip'>
				<Button small onClick={() => runAIAction('translation')} icon='language' data-tooltip={'AI translate'} />
				<span className='tooltiptext'>AI Translate</span>
			</div>
		</div>
	);

	return createPortal(popupElement, document.body);
};
// ##################################################################
// ##                      Storybook Stories                       ##
// ##################################################################

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

export const RichTextComposer: StoryFn<typeof RichTextComposerInput> = (args) => (
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

const AIEnhancementStoryComponent = (): ReactElement => {
	const contentEditableRef = useRef<HTMLDivElement>(null);
	const aiPopup = useAIEnhancement(contentEditableRef);

	return (
		<>
			{aiPopup}
			<MessageComposer>
				<RichTextComposerInput
					ref={contentEditableRef}
					// placeholder={'Select some text in this input to see the AI enhancement options...'}
				/>
				<MessageComposerToolbar>
					<MessageToolbarActions />
					<MessageComposerToolbarSubmit>
						<MessageComposerAction aria-label='Send' icon='send' />
					</MessageComposerToolbarSubmit>
				</MessageComposerToolbar>
			</MessageComposer>
		</>
	);
};

export const RichTextComposerWithAIEnhancement: StoryFn<typeof MessageComposer> = () => <AIEnhancementStoryComponent />;

RichTextComposerWithAIEnhancement.storyName = 'Rich Text Composer with AI Enhancement';

export const MessageComposerLoading: StoryFn<typeof MessageComposer> = () => <MessageComposerSkeleton />;