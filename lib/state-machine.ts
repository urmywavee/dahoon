import type { EchoStatus } from '@/types';
const transitions:Record<EchoStatus,EchoStatus[]>={draft:['scheduled'],scheduled:['delivered'],delivered:['replied'],replied:['waiting_for_match'],waiting_for_match:['matched','closed'],matched:[],closed:[]};
export const canTransition=(from:EchoStatus,to:EchoStatus)=>transitions[from].includes(to);
