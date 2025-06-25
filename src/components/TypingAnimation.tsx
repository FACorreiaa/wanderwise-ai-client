import { createEffect } from 'solid-js';
import { useStreamingText } from '~/lib/hooks/useStreamingText';

export function TypingAnimation(props) {
  const [text, startStreaming] = useStreamingText('', props.speed || 50);

  createEffect(() => {
    if (props.text) {
      startStreaming(props.text);
    }
  });

  return <p>{text()}</p>;
}
