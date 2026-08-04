'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { addDays } from 'date-fns';
import { ChevronLeft, Save, ShieldCheck, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { AppShell } from '@/components/layout/app-shell';
import { Button, Card, Pill } from '@/components/ui';
import { checkSafety, polishText } from '@/lib/safety-check';
import { useEchoStore } from '@/store/echo-store';
import type { EchoMessage } from '@/types';

const schema = z.object({
  origin: z.string().min(10, '조금 더 들려주세요. (10자 이상)'),
  confusion: z.string().min(10, '상황을 조금 더 설명해주세요. (10자 이상)'),
  change: z.string().min(10, '바라는 모습을 조금 더 적어주세요. (10자 이상)'),
});

type FormValues = z.infer<typeof schema>;
type FieldName = keyof FormValues;

const fields: Array<{
  name: FieldName;
  label: string;
  helper: string;
  placeholder: string;
}> = [
  {
    name: 'origin',
    label: '1. 당신은 어떤 환경에서 왔나요?',
    helper: '이전 조직이나 익숙했던 일하는 방식을 들려주세요.',
    placeholder: '예: 의견을 자유롭게 나누는 작은 조직에서 일했어요.',
  },
  {
    name: 'confusion',
    label: '2. 지금 조직 문화에서 이해하기 어려운 점은 무엇인가요?',
    helper: '특정인을 지목하지 않고, 내가 경험한 상황에 집중해보세요.',
    placeholder: '예: 회의에서 반대 의견이 거의 나오지 않는 점이 낯설어요.',
  },
  {
    name: 'change',
    label: '3. 어떤 방향으로 바뀌면 좋겠나요?',
    helper: '작더라도 함께 만들어보고 싶은 변화를 적어주세요.',
    placeholder: '예: 다른 생각도 편하게 이야기할 수 있으면 좋겠어요.',
  },
];

const defaultValues: FormValues = {
  origin: '',
  confusion: '',
  change: '',
};

function asSentence(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  return /[.!?。！？]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

export default function WritePage() {
  const router = useRouter();
  const send = useEchoStore((state) => state.send);
  const saveDraft = useEchoStore((state) => state.saveDraft);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPolishing, setIsPolishing] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onBlur',
  });

  const values = watch();
  const hasContent = Object.values(values).some((value) => value.trim().length > 0);
  const composedMessage = [values.origin, values.confusion, values.change]
    .map(asSentence)
    .filter(Boolean)
    .join('\n');
  const safetyIssues = checkSafety(composedMessage);

  const createMessage = (): EchoMessage => ({
    id: crypto.randomUUID(),
    senderId: 'me',
    originBackground: values.origin,
    cultureConfusion: values.confusion,
    desiredChange: values.change,
    composedMessage,
    status: 'draft',
    createdAt: new Date().toISOString(),
    deliverAt: addDays(new Date(), 1).toISOString(),
  });

  const handleSaveDraft = () => {
    if (!hasContent) return;
    saveDraft(createMessage());
    setDraftSaved(true);
  };

  const handlePolish = async () => {
    if (!hasContent) return;
    setIsPolishing(true);

    const [origin, confusion, change] = await Promise.all([
      polishText(values.origin),
      polishText(values.confusion),
      polishText(values.change),
    ]);

    setValue('origin', origin, { shouldDirty: true, shouldValidate: true });
    setValue('confusion', confusion, { shouldDirty: true, shouldValidate: true });
    setValue('change', change, { shouldDirty: true, shouldValidate: true });
    setIsPolishing(false);
  };

  const openConfirmation = () => setConfirmOpen(true);

  const handleSend = () => {
    send(createMessage());
    router.push('/waiting');
  };

  return (
    <AppShell>
      <form className="px-5 pb-8" onSubmit={handleSubmit(openConfirmation)}>
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="이전 화면으로 이동"
          className="focus-ring rounded-full p-2"
        >
          <ChevronLeft />
        </button>

        <div className="mt-5">
          <Pill>오늘의 메아리</Pill>
          <h1 className="mt-4 text-3xl font-black leading-tight">
            세 가지 마음을
            <br />한 번에 들려주세요.
          </h1>
          <p className="mt-3 text-sm leading-6 text-black/50">
            순서대로 짧게 적으면 하나의 자연스러운 편지로 이어드릴게요.
          </p>
        </div>

        <div className="mt-8 space-y-5">
          {fields.map((field) => (
            <Card key={field.name} className="p-5">
              <label htmlFor={field.name} className="block font-bold leading-6">
                {field.label}
              </label>
              <p id={`${field.name}-helper`} className="mt-1 text-xs leading-5 text-black/45">
                {field.helper}
              </p>
              <textarea
                {...register(field.name)}
                id={field.name}
                maxLength={300}
                rows={4}
                aria-describedby={`${field.name}-helper ${field.name}-error`}
                aria-invalid={Boolean(errors[field.name])}
                className="focus-ring mt-4 w-full rounded-2xl border border-black/10 bg-cream/50 p-4 text-sm leading-6"
                placeholder={field.placeholder}
              />
              <div className="mt-2 flex min-h-5 justify-between gap-3 text-xs">
                <span id={`${field.name}-error`} role="alert" className="text-red-600">
                  {errors[field.name]?.message}
                </span>
                <span className="shrink-0 text-black/35">{values[field.name].length}/300</span>
              </div>
            </Card>
          ))}
        </div>

        <Card className="paper mt-6" aria-live="polite">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-bold">편지 미리보기</h2>
            <span className="text-xs text-black/35">{composedMessage.length}자</span>
          </div>
          <p className={`mt-4 whitespace-pre-wrap text-[15px] leading-8 ${hasContent ? '' : 'text-black/35'}`}>
            {hasContent
              ? composedMessage
              : '위 세 가지 질문에 답하면 이곳에서 완성된 메아리를 바로 확인할 수 있어요.'}
          </p>
        </Card>

        {safetyIssues.map((issue) => (
          <p
            key={issue.message}
            className="mt-3 rounded-xl bg-orange-50 p-3 text-sm leading-6 text-orange-800"
          >
            <ShieldCheck className="mr-2 inline" size={16} aria-hidden="true" />
            {issue.message}
          </p>
        ))}

        <button
          type="button"
          className="focus-ring mt-4 w-full rounded-xl py-3 text-sm font-bold text-leaf disabled:opacity-40"
          disabled={!hasContent || isPolishing}
          onClick={handlePolish}
        >
          <Sparkles className="mr-2 inline" size={17} aria-hidden="true" />
          {isPolishing ? '문장을 다듬고 있어요...' : 'AI로 더 부드럽게 다듬기'}
        </button>

        <div className="mt-4 flex gap-3">
          <Button
            type="button"
            className="bg-white text-leaf"
            disabled={!hasContent}
            onClick={handleSaveDraft}
          >
            <Save className="mr-2 inline" size={17} aria-hidden="true" />
            {draftSaved ? '저장됨' : '임시 저장'}
          </Button>
          <Button type="submit">보내기 전에 확인</Button>
        </div>
      </form>

      {confirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="send-confirm-title"
          className="fixed inset-0 z-50 grid place-items-end bg-black/35 p-4 md:place-items-center"
        >
          <Card className="w-full max-w-md">
            <h2 id="send-confirm-title" className="text-xl font-black">
              이 메아리를 보낼까요?
            </h2>
            <p className="mt-3 text-sm leading-6 text-black/55">
              내일 오전 9시, 무작위 팀원 한 명에게만 배달됩니다. 이름과 소속은 함께
              전하지 않아요.
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                type="button"
                className="bg-black/5 text-ink"
                onClick={() => setConfirmOpen(false)}
              >
                더 살펴보기
              </Button>
              <Button type="button" onClick={handleSend}>
                내일 한 사람에게 보내기
              </Button>
            </div>
          </Card>
        </div>
      )}
    </AppShell>
  );
}
