import { Component } from 'solid-js';
import ChatInterface from '~/components/ui/ChatInterface';
import { useChatSession } from '~/lib/hooks/useChatSession';

interface FloatingChatProps {
    // Optional initial message or context could be passed here
    initialMessage?: string;
    getStreamingData?: () => any;
    setStreamingData?: (data: any) => void;
}

export const FloatingChat: Component<FloatingChatProps> = (props) => {
    const {
        showChat,
        setShowChat,
        chatMessage,
        setChatMessage,
        chatHistory,
        isLoading,
        sendChatMessage,
    } = useChatSession({
        getStreamingData: props.getStreamingData,
        setStreamingData: props.setStreamingData,
    });

    const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage();
        }
    };

    return (
        <ChatInterface
            showChat={showChat()}
            setShowChat={setShowChat}
            chatMessage={chatMessage()}
            setChatMessage={setChatMessage}
            chatHistory={chatHistory()}
            isLoading={isLoading()}
            sendChatMessage={sendChatMessage}
            handleKeyPress={handleKeyPress}
            title="Loci Assistant"
            placeholder="Ask about your trip..."
        />
    );
};

export default FloatingChat;
