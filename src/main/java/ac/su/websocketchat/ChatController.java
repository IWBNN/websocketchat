package ac.su.websocketchat;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

@Controller
public class ChatController {

    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public ChatMessage send(ChatMessage message) {
        System.out.println("Received message: " + message.getContent()); // 콘솔에 메시지 출력
        return new ChatMessage(HtmlUtils.htmlEscape(message.getContent()));
    }
}
