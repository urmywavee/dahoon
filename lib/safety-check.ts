export type SafetyIssue={kind:'personal'|'aggressive'|'identity';message:string};
const rules=[{kind:'personal',re:/\b[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}\b|01[016789]-?\d{3,4}-?\d{4}/i,message:'이메일이나 전화번호는 익명성을 해칠 수 있어요.'},{kind:'aggressive',re:/바보|멍청|최악|무능|꺼져/i,message:'상대가 공격적으로 느낄 수 있는 표현이 있어요.'},{kind:'identity',re:/김\s?[가-힣]{1,3}\s?(팀장|대리|과장)|몇\s?팀|누구인지|이름이/i,message:'특정인이나 신원을 추측할 수 있는 표현이 있어요.'}] as const;
export function checkSafety(value:string):SafetyIssue[]{return rules.filter(r=>r.re.test(value)).map(r=>({kind:r.kind,message:r.message}))}
export async function polishText(value:string){await new Promise(r=>setTimeout(r,450));return value.replace(/최악/gi,'아쉽게 느껴지는').replace(/무능/gi,'도움이 필요한').replace(/꺼져/gi,'거리를 두고 싶어')}
