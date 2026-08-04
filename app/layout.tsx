import './globals.css';import type {Metadata} from 'next';
export const metadata:Metadata={title:'메아리 — 한 사람에게 닿는 마음',description:'직장인을 위한 안전한 익명 1:1 커뮤니케이션'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="ko"><body>{children}</body></html>}
