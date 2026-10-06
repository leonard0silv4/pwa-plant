import type { CSSProperties, ReactNode } from "react";
import { Camera, HardDrive, ShieldCheck, Sparkles, Stethoscope } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Sobre" };

function Section({
  icon,
  title,
  children,
  index,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  index: number;
}) {
  return (
    <section
      className="rise-in rounded-[1.75rem] bg-card/80 p-6 ring-1 ring-ink/[0.04]"
      style={{ "--i": index + 3 } as CSSProperties}
    >
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-full bg-paper-deep text-moss">{icon}</span>
        <h2 className="font-display text-xl font-[460] tracking-tight">{title}</h2>
      </div>
      <div className="mt-3 space-y-3 text-[0.95rem] leading-relaxed text-ink-soft">{children}</div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <main className="flex-1">
      <PageHeader eyebrow="Sobre o projeto" title={<>Um caderno de campo, <em className="text-moss">com IA.</em></>}>
        <p>
          O FloraScan é uma ferramenta educativa que utiliza inteligência artificial para ajudar a identificar
          plantas e entender seus cuidados.
        </p>
      </PageHeader>

      <div className="space-y-4 px-5">
        <Section index={0} icon={<Sparkles className="size-4" />} title="Como funciona">
          <p>
            Você fotografa a planta, a imagem é reduzida no seu aparelho e enviada ao nosso servidor, que pede a um
            modelo de IA multimodal uma análise estruturada: espécie provável, cuidados e sinais visuais.
          </p>
          <p>As análises são baseadas nas informações disponíveis na fotografia e podem conter imprecisões.</p>
        </Section>

        <Section index={1} icon={<Stethoscope className="size-4" />} title="Não é um diagnóstico">
          <p>
            Uma foto mostra apenas parte da história. Sintomas parecidos podem ter causas diferentes — rega, luz,
            pragas, fungos ou nutrientes. Por isso falamos em possibilidades, nunca em certezas.
          </p>
          <p>
            Antes de usar produtos químicos, consumir uma planta ou em caso de suspeita de toxicidade, consulte um
            agrônomo, botânico ou profissional especializado.
          </p>
        </Section>

        <Section index={2} icon={<ShieldCheck className="size-4" />} title="Privacidade">
          <p>
            Não guardamos suas fotos. A imagem passa pelo servidor apenas durante a análise, é enviada à OpenAI para
            processamento e descartada em seguida.
          </p>
          <p>Não há contas, cadastro ou rastreamento de usuários.</p>
        </Section>

        <Section index={3} icon={<HardDrive className="size-4" />} title="Seu histórico fica com você">
          <p>
            As análises e uma miniatura de cada foto ficam salvas somente neste aparelho, no armazenamento local do
            navegador. Você pode apagá-las a qualquer momento.
          </p>
        </Section>

        <Section index={4} icon={<Camera className="size-4" />} title="Dicas para boas fotos">
          <p>Luz natural, planta em foco, folhas visíveis. Se houver um problema, fotografe de perto a área afetada.</p>
        </Section>

        <p className="px-2 pt-4 text-center text-sm text-ink-soft">Desenvolvido para a Feira de Ciências do Colégio MAF.</p>
        <p className="label-mono px-2 pt-2 pb-2 text-center text-ink-soft/60">Gratuito · Educativo · Sem anúncios</p>
      </div>
    </main>
  );
}
