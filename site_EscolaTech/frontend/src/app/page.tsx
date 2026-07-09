'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [instances, setInstances] = useState<number[]>([]);
  const [userCount, setUserCount] = useState(2540);
  const [sliderValue, setSliderValue] = useState(2540);

  useEffect(() => {
    const count = Math.ceil(sliderValue / 1000);
    setInstances(Array.from({ length: count }, (_, i) => i));
    setUserCount(sliderValue);
  }, [sliderValue]);

  return (
    <div className="relative overflow-x-hidden">
      {/* Global Grid */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        backgroundImage: 'linear-gradient(#112B4A 1px, transparent 1px), linear-gradient(90deg, #112B4A 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        opacity: 0.12
      }} />

      {/* ─── HERO ─── */}
      <section className="relative z-10 max-w-container mx-auto px-lg pb-3xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl items-center min-h-[560px]">
          {/* Left */}
          <div className="relative">
            <span className="absolute -top-16 -left-8 text-[140px] font-playfair font-bold italic select-none pointer-events-none opacity-[0.06] text-primary leading-none">CLOUD</span>
            <p className="text-label-caps text-primary tracking-widest mb-sm">AWS TRAINING PLATFORM</p>
            <h1 className="text-[56px] leading-[1.08] font-playfair font-bold text-white mb-lg">
              Construa seu futuro <br />
              na <span className="italic text-primary">nuvem</span>
            </h1>
            <p className="text-body-lg text-on-surface-variant mb-xl max-w-lg">
              Domine AWS, Azure e Google Cloud com a metodologia DevOps que as maiores Techs utilizam. De zero ao nível Pro em infraestrutura elástica.
            </p>
            <div className="flex flex-col sm:flex-row gap-md">
              <Link href="/enrollment" className="bg-gradient-to-r from-primary to-secondary text-on-primary px-xl py-md rounded-lg font-bold flex items-center justify-center gap-sm transition-all duration-300 hover:scale-105 hover:shadow-[0_0_24px_rgba(142,213,255,0.4)]">
                Quero me matricular
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
              <button className="border border-outline-variant bg-surface/40 backdrop-blur-md text-on-surface px-xl py-md rounded-lg font-bold hover:bg-surface-variant transition-all">
                Conhecer a plataforma
              </button>
            </div>
          </div>
          {/* Right — Live Dashboard */}
          <div className="glass-card rounded-2xl p-xl animate-float relative overflow-hidden">
            <div className="absolute top-0 right-0 p-md flex items-center gap-xs">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-label-caps text-secondary">LIVE SYSTEM</span>
            </div>
            <div className="mb-xl">
              <h3 className="font-semibold text-headline-md mb-xs">Infrastructure Dashboard</h3>
              <p className="text-body-sm text-on-surface-variant">Real-time AWS environment monitoring</p>
            </div>
            <div className="grid grid-cols-2 gap-md">
              {[
                { label: 'UPTIME', value: '99.99%', color: 'text-primary' },
                { label: 'AUTO SCALING', value: 'ATIVO', color: 'text-secondary' },
                { label: 'INSTÂNCIAS EC2', value: '08', color: 'text-on-surface' },
                { label: 'LATÊNCIA MÉDIA', value: '24ms', color: 'text-tertiary' },
              ].map((m) => (
                <div key={m.label} className="bg-surface-container-low p-md rounded-lg border border-outline-variant/10">
                  <p className="text-label-caps text-outline mb-xs">{m.label}</p>
                  <p className={`text-3xl font-mono ${m.color}`}>{m.value}</p>
                </div>
              ))}
            </div>
            {/* Mini chart */}
            <div className="mt-lg h-16 w-full flex items-end gap-1">
              {[48, 32, 64, 56, 40, 80, 48, 36, 72, 60, 44, 88].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm transition-all duration-500 hover:opacity-100 opacity-70"
                  style={{ height: `${h}%`, background: i % 3 === 0 ? 'rgba(142,213,255,0.5)' : i % 3 === 1 ? 'rgba(93,230,255,0.4)' : 'rgba(142,213,255,0.3)' }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── ROADMAP ─── */}
      <section className="relative z-10 bg-surface-container-lowest py-48">
        <div className="max-w-container mx-auto px-lg">
          <div className="text-center mb-2xl">
            <span className="text-label-caps text-primary tracking-widest">THE ROADMAP</span>
            <h2 className="text-[40px] font-playfair mt-sm">Sua Carreira Escalável</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-lg relative">
            <div className="hidden md:block absolute top-8 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            {[
              { icon: 'school', title: 'Fundamentos', desc: 'Entenda a infraestrutura física e virtual global.', color: 'border-primary text-primary' },
              { icon: 'code', title: 'Certificação', desc: 'Prepare-se para AWS Solutions Architect, DevOps Engineer e mais.', color: 'border-secondary text-secondary' },
              { icon: 'construction', title: 'Projetos Reais', desc: 'Construa e deploy arquiteturas do zero em produção real.', color: 'border-tertiary text-tertiary' },
              { icon: 'trending_up', title: 'Nível Pro', desc: 'Multi-cloud, SRE, FinOps, Observabilidade avançada.', color: 'border-primary-container text-primary-container' },
            ].map((step) => (
              <div key={step.title} className="flex flex-col items-center text-center group">
                <div className={`w-16 h-16 rounded-full bg-surface-container-high border-2 ${step.color} flex items-center justify-center mb-md group-hover:scale-110 transition-transform`}
                  style={{ boxShadow: '0 0 20px rgba(56,189,248,0.2)' }}>
                  <span className={`material-symbols-outlined ${step.color.split(' ')[1]}`}>{step.icon}</span>
                </div>
                <h4 className="font-bold text-lg mb-sm">{step.title}</h4>
                <p className="text-body-sm text-on-surface-variant">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ELASTICIDADE ─── */}
      <section className="relative z-10 py-48">
        <div className="max-w-container mx-auto px-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl items-center">
            <div>
              <span className="text-label-caps text-secondary tracking-widest">ELASTICIDADE EM AÇÃO</span>
              <h2 className="text-[40px] font-playfair mt-sm mb-md">Escale com AWS Auto Scaling</h2>
              <p className="text-body-lg text-on-surface-variant mb-xl">
                Simule tráfego real e veja como a AWS cria e destrói instâncias EC2 automaticamente para manter performance e reduzir custos.
              </p>
              <div className="glass-card p-xl rounded-2xl space-y-md">
                <div className="flex justify-between items-center text-label-caps text-outline">
                  <span>TRÁFEGO SIMULADO</span>
                  <span className="text-secondary font-mono">{userCount.toLocaleString()} usuários</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="10000"
                  value={sliderValue}
                  onChange={(e) => setSliderValue(Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{ accentColor: '#5de6ff' }}
                />
                <div className="flex gap-sm flex-wrap mt-lg min-h-[60px]">
                  {instances.map((i) => (
                    <div key={i} className="w-12 h-12 glass-card rounded-lg flex items-center justify-center text-secondary border border-secondary/30 animate-float" style={{ animationDelay: `${i * 0.2}s` }}>
                      <span className="material-symbols-outlined text-sm">dns</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="relative h-64 lg:h-full bg-surface-container-lowest/50 rounded-2xl border border-outline-variant/10 overflow-hidden flex items-center justify-center min-h-[280px]">
              <div className="text-center">
                <span className="material-symbols-outlined text-[80px] text-secondary animate-pulse" style={{ filter: 'drop-shadow(0 0 15px rgba(56,189,248,0.5))' }}>cloud_sync</span>
                <p className="font-mono text-secondary mt-md font-bold tracking-wider text-sm">AWS Auto Scaling Engine</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CURSOS ─── */}
      <section id="cursos" className="relative z-10 py-48 max-w-container mx-auto px-lg">
        <div className="flex flex-col md:flex-row justify-between items-end mb-2xl gap-md">
          <div>
            <h2 className="text-[40px] font-playfair">Trilhas de Especialização</h2>
            <p className="text-on-surface-variant mt-sm">Dos fundamentos à automação avançada.</p>
          </div>
          <button className="text-primary font-bold flex items-center gap-xs hover:gap-sm transition-all">
            Ver todos os cursos <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-xl">
          {[
            {
              icon: 'cloud_queue', title: 'AWS Solutions Architect',
              desc: 'Domine os serviços core da AWS: EC2, S3, RDS, Lambda e VPC.', hours: '60 HORAS',
              iconBox: 'text-primary border-primary/20 bg-primary/10 group-hover:bg-primary group-hover:text-on-primary',
              accentText: 'text-primary',
            },
            {
              icon: 'terminal', title: 'DevOps Engineer Pro',
              desc: 'CI/CD, GitHub Actions, Docker e Kubernetes em produção.', hours: '85 HORAS',
              iconBox: 'text-secondary border-secondary/20 bg-secondary/10 group-hover:bg-secondary group-hover:text-on-secondary',
              accentText: 'text-secondary',
            },
            {
              icon: 'description', title: 'Terraform Masterclass',
              desc: 'Infraestrutura como código (IaC) do absoluto zero ao avançado.', hours: '20 HORAS',
              iconBox: 'text-tertiary border-tertiary/20 bg-tertiary/10 group-hover:bg-tertiary group-hover:text-on-tertiary',
              accentText: 'text-tertiary',
            },
            {
              icon: 'security', title: 'Cloud Security Specialist',
              desc: 'Proteja seus ativos na nuvem com IAM, GuardDuty e WAF.', hours: '45 HORAS',
              iconBox: 'text-primary-container border-primary-container/20 bg-primary-container/10 group-hover:bg-primary-container group-hover:text-on-primary-container',
              accentText: 'text-primary-container',
            },
            {
              icon: 'database', title: 'Data Engineering na AWS',
              desc: 'Pipelines escaláveis com Glue, Athena e Redshift.', hours: '55 HORAS',
              iconBox: 'text-secondary-container border-secondary-container/20 bg-secondary-container/10 group-hover:bg-secondary-container group-hover:text-on-secondary-container',
              accentText: 'text-secondary-container',
            },
            {
              icon: 'api', title: 'Serverless Application',
              desc: 'Construa aplicações modernas sem gerenciar servidores.', hours: '30 HORAS',
              iconBox: 'text-outline border-outline/20 bg-outline/10 group-hover:bg-outline group-hover:text-surface',
              accentText: 'text-outline',
            },
          ].map((course) => (
            <div key={course.title} className="glass-card group p-lg rounded-2xl transition-all duration-500 cursor-pointer flex flex-col gap-md hover:border-primary/50 hover:shadow-[0_0_20px_rgba(56,189,248,0.15)]">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center border transition-all ${course.iconBox}`}>
                <span className="material-symbols-outlined">{course.icon}</span>
              </div>
              <div>
                <h3 className="font-bold text-xl mb-xs">{course.title}</h3>
                <p className="text-on-surface-variant text-body-sm">{course.desc}</p>
              </div>
              <div className="mt-auto flex items-center justify-between border-t border-outline-variant/10 pt-md">
                <span className={`text-label-caps ${course.accentText}`}>{course.hours}</span>
                <span className={`material-symbols-outlined group-hover:translate-x-2 transition-transform ${course.accentText}`}>arrow_forward</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── ARQUITETURA AWS ─── */}
      <section id="arquitetura" className="relative z-10 py-48 bg-surface-container-lowest/80 border-y border-outline-variant/10">
        <div className="max-w-container mx-auto px-lg">
          <h2 className="text-[40px] font-playfair text-center mb-2xl">Blueprint de Alta Disponibilidade</h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-lg overflow-x-auto pb-lg">
            {[
              { icon: 'public', label: 'Route 53', color: 'text-primary' },
              { icon: 'swap_calls', label: 'ALB', color: 'text-secondary' },
              { icon: 'unfold_more', label: 'Auto Scaling', color: 'text-tertiary' },
              { icon: 'dns', label: 'EC2 Fleet', color: 'text-primary-container' },
              { icon: 'database', label: 'RDS (Multi-AZ)', color: 'text-secondary-container' },
            ].map((node, i) => (
              <div key={node.label} className="flex items-center gap-lg">
                <div className="flex flex-col items-center gap-sm group cursor-pointer min-w-[110px]">
                  <div className={`p-md rounded-xl bg-surface/80 border border-outline-variant/30 ${node.color} flex flex-col items-center group-hover:scale-110 transition-transform glass-card`}>
                    <span className="material-symbols-outlined text-3xl">{node.icon}</span>
                    <span className="font-mono text-[10px] mt-sm">{node.label}</span>
                  </div>
                </div>
                {i < 4 && (
                  <span className="material-symbols-outlined text-outline-variant animate-pulse hidden md:block">keyboard_double_arrow_right</span>
                )}
              </div>
            ))}
          </div>
          <p className="text-center mt-xl text-on-surface-variant text-body-sm italic">
            "Visualize o tráfego fluindo através de cada camada de rede em milissegundos."
          </p>
        </div>
      </section>

      {/* ─── STATS / ESCALA GLOBAL ─── */}
      <section className="relative z-10 py-48">
        <div className="max-w-container mx-auto px-lg text-center">
          <h2 className="text-[56px] font-playfair mb-md">
            <span className="italic text-white">Escala Global</span> Imediata
          </h2>
          <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-2xl">
            Aprenda a implantar infraestruturas que cobrem o mundo todo em segundos. Explore as 31 regiões e centenas de Edge Locations da AWS.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-xl mb-3xl">
            {[
              { value: '31+', label: 'REGIÕES AWS', color: 'text-primary', glow: 'rgba(142,213,255,0.3)' },
              { value: '99+', label: 'ZONAS DISP.', color: 'text-secondary', glow: 'rgba(93,230,255,0.3)' },
              { value: '450+', label: 'EDGE LOCATIONS', color: 'text-tertiary', glow: 'rgba(255,193,118,0.3)' },
              { value: '100Gb', label: 'BACKBONE REDE', color: 'text-primary-container', glow: 'rgba(56,189,248,0.3)' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className={`text-5xl font-bold ${stat.color} mb-sm`} style={{ filter: `drop-shadow(0 0 10px ${stat.glow})` }}>{stat.value}</p>
                <p className="text-label-caps text-outline tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* CTA Final */}
          <div className="glass-card p-xl rounded-3xl max-w-3xl mx-auto flex flex-col items-center"
            style={{ border: '1px solid rgba(56,189,248,0.2)' }}>
            <h3 className="font-semibold text-2xl mb-sm">Pronto para dominar a nuvem?</h3>
            <p className="text-on-surface-variant mb-lg text-center max-w-lg">
              Junte-se a milhares de profissionais que já escalaram suas carreiras. O acesso à infraestrutura global começa aqui.
            </p>
            <Link
              href="/enrollment"
              className="bg-gradient-to-r from-primary to-secondary text-on-primary px-3xl py-lg rounded-xl font-bold text-lg flex items-center justify-center gap-sm transition-all duration-300 hover:scale-105 hover:shadow-[0_0_24px_rgba(56,189,248,0.5)] w-full md:w-auto"
            >
              Começar Jornada Agora
              <span className="material-symbols-outlined">rocket_launch</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
