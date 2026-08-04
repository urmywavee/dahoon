import type { EchoMessage,EchoReply,User } from '@/types';
export const me:User={id:'me',name:'서윤',team:'Product Experience',role:'Product Designer'};
export const partner:User={id:'u2',name:'이도현',team:'Platform Team',role:'Backend Engineer'};
export const sampleMessage:EchoMessage={id:'echo-1',senderId:'u2',receiverId:'me',originBackground:'의견을 자유롭게 나누는 작은 조직',cultureConfusion:'회의에서 반대 의견이 잘 나오지 않는 점',desiredChange:'서로 다른 생각도 안전하게 이야기하는 팀',composedMessage:'저는 의견을 자유롭게 나누는 작은 조직에서 왔어요. 지금은 회의에서 반대 의견이 잘 나오지 않는 점이 아직 낯설어요. 서로 다른 생각도 안전하게 이야기하는 팀이 되면 좋겠습니다.',status:'delivered',createdAt:new Date().toISOString(),deliverAt:new Date().toISOString()};
export const sampleReply:EchoReply={id:'reply-1',messageId:'echo-1',senderId:'me',content:'용기 내어 마음을 들려주셔서 고마워요. 저도 비슷한 답답함을 느꼈어요. 다음 회의에서 먼저 작은 질문을 건네볼게요.',createdAt:new Date().toISOString()};
