export type EchoStatus='draft'|'scheduled'|'delivered'|'replied'|'waiting_for_match'|'matched'|'closed';
export type User={id:string;name:string;team:string;role:string;avatarUrl?:string};
export type EchoMessage={id:string;senderId:string;receiverId?:string;originBackground:string;cultureConfusion:string;desiredChange:string;composedMessage:string;status:EchoStatus;createdAt:string;deliverAt:string};
export type EchoReply={id:string;messageId:string;senderId:string;content:string;createdAt:string};
export type MatchDecision={messageId:string;writerLiked?:boolean;receiverLiked?:boolean};
export type Connection={id:string;messageId:string;userIds:[string,string];createdAt:string};
