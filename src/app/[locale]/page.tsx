import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function HomePage() {
  const t = useTranslations('Index');
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-slate-50">
      <main className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-8">
        <div className="space-y-6 max-w-4xl">
          <h1 className="text-6xl font-extrabold tracking-tight text-slate-900 mb-8 animate-fade-in-up" style={{ animationDelay: '0s' }}>
            {t('title')}
          </h1>
          <div className="space-y-3">
            {t('description').split('\n').map((line, i) => (
              <p
                key={i}
                className="text-xl md:text-2xl text-slate-600 font-medium opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${(i + 1) * 0.4}s` }}
              >
                {line}
              </p>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-12">
          <Link href="/compliance" className="group p-8 bg-white border border-slate-200 rounded-xl hover:border-slate-400 hover:shadow-md transition-all flex flex-col items-center space-y-4 text-slate-800">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xl group-hover:bg-blue-100 transition-colors">💊</div>
            <h2 className="text-xl font-semibold">Medication Compliance</h2>
            <p className="text-sm text-slate-500 text-center leading-relaxed">Calculate compliance percentages based on dispensed, returned, and lost medications.</p>
          </Link>
          <Link href="/schedule" className="group p-8 bg-white border border-slate-200 rounded-xl hover:border-slate-400 hover:shadow-md transition-all flex flex-col items-center space-y-4 text-slate-800">
            <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center text-xl group-hover:bg-teal-100 transition-colors">🗓️</div>
            <h2 className="text-xl font-semibold">Visit Schedule Generator</h2>
            <p className="text-sm text-slate-500 text-center leading-relaxed">Generate protocol-specific visit windows and acceptable target dates.</p>
          </Link>
          <Link href="/calculators" className="group p-8 bg-white border border-slate-200 rounded-xl hover:border-slate-400 hover:shadow-md transition-all flex flex-col items-center space-y-4 text-slate-800">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-xl group-hover:bg-indigo-100 transition-colors">🧮</div>
            <h2 className="text-xl font-semibold">Clinical Calculators</h2>
            <p className="text-sm text-slate-500 text-center leading-relaxed">Convert units, calculate BMI, BSA, eGFR, and IV drop rates.</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
