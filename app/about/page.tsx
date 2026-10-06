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
          O FloraScan é um app para aprender sobre plantas. Ele usa inteligência artificial (um programa de computador
          que aprendeu a reconhecer imagens) para descobrir que planta é e como cuidar dela.
        </p>
      </PageHeader>

      <div className="space-y-4 px-5">
        <Section index={0} icon={<Sparkles className="size-4" />} title="Como funciona">
          <p>
            Você tira a foto. Ela fica menor no seu celular e vai para uma inteligência artificial, que olha a planta e
            conta o que viu: o nome provável, como cuidar e se ela parece bem.
          </p>
          <p>Ela só enxerga o que aparece na foto, então às vezes pode errar.</p>
        </Section>

        <Section index={1} icon={<Stethoscope className="size-4" />} title="Não é um médico de plantas">
          <p>
            Uma foto mostra só um pedacinho da história. Folhas amarelas, por exemplo, podem ser falta de água, água
            demais ou pouca luz. Por isso o app fala em “talvez”, nunca em certeza.
          </p>
          <p>
            Antes de usar remédios na planta, comer alguma parte dela ou se achar que ela pode fazer mal, chame um
            adulto e peça ajuda a um especialista.
          </p>
        </Section>

        <Section index={2} icon={<ShieldCheck className="size-4" />} title="Sua foto é só sua">
          <p>
            A gente não guarda suas fotos. A imagem é enviada à OpenAI só para ser analisada e depois é apagada.
          </p>
          <p>Não precisa criar conta nem fazer cadastro.</p>
        </Section>

        <Section index={3} icon={<HardDrive className="size-4" />} title="Suas plantas ficam com você">
          <p>
            As plantas que você analisa ficam guardadas só neste celular, com uma fotinho de cada. Você pode apagar
            quando quiser.
          </p>
        </Section>

        <Section index={4} icon={<Camera className="size-4" />} title="Dicas para uma boa foto">
          <p>Use um lugar claro, chegue perto e mostre bem as folhas. Se tiver uma parte machucada, tire foto dela de perto.</p>
        </Section>

        <p className="px-2 pt-4 text-center text-sm text-ink-soft">Desenvolvido para a Feira de Ciências do Colégio MAF.</p>
        <p className="label-mono px-2 pt-2 pb-2 text-center text-ink-soft/60">Gratuito · Educativo · Sem anúncios</p>
      </div>
    </main>
  );
}
