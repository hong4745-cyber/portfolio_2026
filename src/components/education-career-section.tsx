import type { ReactNode } from 'react'
import { BriefcaseBusiness, GraduationCap, MapPin, Sparkles } from 'lucide-react'
import { Timeline } from '@/components/ui/timeline'

interface ResumeCardProps {
  icon: typeof GraduationCap
  category: string
  title: string
  period: string
  location: string
  children?: ReactNode
  accent: 'purple' | 'blue' | 'emerald'
}

const accentClasses = {
  purple: 'text-purple-600 bg-purple-50',
  blue: 'text-blue-600 bg-blue-50',
  emerald: 'text-emerald-600 bg-emerald-50',
}

function ResumeCard({ icon: Icon, category, title, period, location, children, accent }: ResumeCardProps) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.05)] md:p-8">
      <div className={`mb-5 inline-flex items-center gap-3 rounded-full px-3 py-2 ${accentClasses[accent]}`}>
        <Icon className="h-5 w-5" aria-hidden="true" />
        <span className="text-xs font-semibold uppercase tracking-[0.16em]">{category}</span>
      </div>
      <h4 className="text-xl font-bold text-neutral-900 md:text-2xl">{title}</h4>
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-neutral-500">
        <span>{period}</span>
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          {location}
        </span>
      </div>
      {children}
    </div>
  )
}

const listClassName = 'mt-6 list-disc space-y-2.5 pl-5 text-sm leading-7 text-neutral-700 marker:text-neutral-400 md:text-base'
const groupClassName = 'space-y-6'

export default function EducationCareerSection() {
  const data = [
    {
      title: '학력',
      content: (
        <div className={groupClassName}>
          <ResumeCard icon={GraduationCap} category="Education" title="청양여자정보고등학교" period="1999.03 — 2001.02" location="청양" accent="purple" />
          <ResumeCard icon={GraduationCap} category="Education" title="우송정보대학 비주얼패키지디자인과" period="2013.03 — 2015.02" location="대전" accent="purple" />
        </div>
      ),
    },
    {
      title: '경력',
      content: (
        <div className={groupClassName}>
          <ResumeCard icon={BriefcaseBusiness} category="Career" title="디자인핏" period="2017.05 — 2025.12" location="대전" accent="blue">
            <ul className={listClassName}>
              <li>공주야행 포스터 디자인 및 홍보물 제작</li>
              <li>충남문화재단 브로슈어, 리플렛 디자인</li>
              <li>관공서 브로슈어, 리플렛 편집디자인</li>
              <li>전시 홍보물 및 각종 편집디자인 전반 담당</li>
            </ul>
          </ResumeCard>
          <ResumeCard icon={BriefcaseBusiness} category="Career" title="케이씽킹" period="2016.07 — 2016.11" location="대전" accent="blue">
            <ul className={listClassName}>
              <li>기업 홍보 브로슈어 및 광고 디자인</li>
              <li>리플렛 등 인쇄 홍보물 디자인</li>
              <li>굿즈 기획 및 디자인 제작</li>
            </ul>
          </ResumeCard>
          <ResumeCard icon={BriefcaseBusiness} category="Career · Intern" title="크리시드 [인턴]" period="2016.03 — 2016.05" location="대전" accent="blue">
            <ul className={listClassName}>
              <li>관공서 홍보 패널 디자인 및 편집 제작</li>
              <li>브로슈어, 리플렛, 포스터 등 인쇄물 편집디자인 및 출력 데이터 제작</li>
              <li>프랜차이즈 브랜드 브랜딩 디자인 보조 및 디자인 시안 제작</li>
              <li>다양한 편집디자인 실무 및 디자인 수정, 운영 업무 수행</li>
            </ul>
          </ResumeCard>
          <ResumeCard icon={BriefcaseBusiness} category="Career" title="우송정보대학" period="2015.03 — 2016.03" location="대전" accent="blue">
            <ul className={listClassName}>
              <li>학과 행정 및 행사 운영 지원</li>
              <li>학과 행정업무 및 조교 업무 수행</li>
            </ul>
          </ResumeCard>
        </div>
      ),
    },
    {
      title: '교육',
      content: (
        <div className={groupClassName}>
          <ResumeCard icon={Sparkles} category="Training" title="그린컴퓨터아트학원" period="2026.04 — 2026.07" location="대전" accent="emerald">
            <p className="mt-6 font-semibold leading-7 text-neutral-900">[AI Worker] 취업을 위한 AI 바이브코딩 웹비즈니스 구축 및 마케팅 실전 과정</p>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              <div>
                <h5 className="font-bold text-neutral-900">웹 개발</h5>
                <ul className={listClassName}>
                  <li>HTML · CSS · JavaScript</li>
                  <li>반응형 웹 · UI/UX</li>
                  <li>바이브코딩 웹사이트 제작</li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-neutral-900">AI 활용</h5>
                <ul className={listClassName}>
                  <li>ChatGPT 기획·자료조사</li>
                  <li>AI 자동화 · 이미지 생성</li>
                  <li>프롬프트 엔지니어링</li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-neutral-900">마케팅</h5>
                <ul className={listClassName}>
                  <li>시장조사 · 경쟁사 분석</li>
                  <li>타깃 설정 · 브랜드 기획</li>
                  <li>SNS 브랜딩 · 채널 운영</li>
                  <li>콘텐츠 기획 · 홍보물 제작</li>
                </ul>
              </div>
            </div>
          </ResumeCard>
          <ResumeCard icon={Sparkles} category="Training" title="(주)모두의연구소" period="2026.04 — 2026.05" location="온라인" accent="emerald">
            <p className="mt-6 font-semibold leading-7 text-neutral-900">생성형 AI를 활용한 15초 광고 만들기 과정</p>
            <ul className={listClassName}>
              <li>실습 프로젝트: 화장품 광고 영상 제작</li>
              <li>콘셉트 기획부터 이미지 생성, 영상 편집까지 전 과정 수행</li>
            </ul>
          </ResumeCard>
          <ResumeCard icon={Sparkles} category="Training" title="그린컴퓨터학원" period="2026.03 — 2026.04" location="대전" accent="emerald">
            <p className="mt-6 font-semibold leading-7 text-neutral-900">[영상편집] 최신 밈을 이용한 유튜브 쇼츠, 릴스 제작</p>
            <ul className={listClassName}>
              <li>인스타그램 콘텐츠 제작</li>
              <li>홍보 이미지 제작</li>
            </ul>
          </ResumeCard>
        </div>
      ),
    },
  ]

  return (
    <Timeline
      data={data}
      eyebrow="Resume"
      heading="Education / Career / Training"
      description="디자인을 공부하고 실무 경험을 쌓아 온 과정과 새로운 기술을 익혀 가는 여정입니다."
    />
  )
}
