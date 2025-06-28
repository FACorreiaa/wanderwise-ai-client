import { createEffect, JSX } from 'solid-js';
// @ts-ignore - Hook import type
import { useStreamingText } from '~/lib/hooks/useStreamingText';

interface TypingAnimationProps {
  text: string;
  speed?: number;
}

export function TypingAnimation(props: TypingAnimationProps): JSX.Element {
  const [text, startStreaming] = useStreamingText('', props.speed || 50);

  createEffect(() => {
    if (props.text) {
      startStreaming(props.text);
    }
  });

  return <p>{text()}</p>;
}
