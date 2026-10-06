# FloraScan

Identificador educativo de plantas com IA. Fotografe uma planta e descubra a espécie provável, os cuidados e possíveis sinais de que ela precisa de atenção.

## Sobre

O FloraScan é uma ferramenta **gratuita e educativa**: sem contas, planos ou anúncios. Uma foto é otimizada no aparelho, enviada ao servidor e analisada por um modelo multimodal da OpenAI, que devolve uma resposta estruturada. O histórico fica salvo apenas no dispositivo do usuário.

## Funcionalidades

- Captura pela câmera traseira ou escolha da galeria, com prévia grande
- Redimensionamento e compressão no navegador (máx. 1280 px, WebP/JPEG ~0.8)
- Análise com efeito de scanner sobre a própria foto (sem percentuais falsos)
- Resultado com identificação, nível de confiança, descrição, características, cuidados (luz, rega, solo, temperatura, umidade, adubação), saúde, possíveis problemas (baixa/média/alta), recomendações por prioridade, toxicidade e avisos
- Perguntas de acompanhamento quando a foto não basta (`needsMoreInformation` / `followUpQuestions`)
- Histórico local em IndexedDB com miniatura otimizada; funciona offline
- PWA instalável (Android e iOS), shell offline e aviso de conexão
- Estados de erro calmos: não é planta, foto ruim, limite de uso, serviço indisponível
- Respeita `prefers-reduced-motion`

## Tecnologias

- [Next.js 16](https://nextjs.org) (App Router, Route Handlers) + TypeScript
- Tailwind CSS 4 + shadcn/ui
- [OpenAI API](https://platform.openai.com/docs) (Responses API + Structured Outputs com Zod)
- [Serwist](https://serwist.pages.dev) (service worker)
- IndexedDB nativo, Canvas/`createImageBitmap` nativos
- Vercel

## Arquitetura

```text
Browser / PWA
  ├─ captura + compressão (lib/image.ts)
  ├─ histórico local IndexedDB (lib/history.ts)
  └─ POST /api/analyze  (multipart, imagem já otimizada)
          │  valida origem, tamanho, magic bytes, rate limit
          ▼
      OpenAI Responses API  (schema Zod → JSON Schema estrito)
          │
          ▼
      JSON estruturado → resultado  (imagem descartada; nada é gravado no servidor)
```

Pastas principais:

| Caminho | Conteúdo |
| --- | --- |
| `app/page.tsx` | Fluxo principal: foto → prévia → scanner → resultado |
| `app/api/analyze/route.ts` | Endpoint de análise |
| `app/history`, `app/analysis` | Histórico e análise salva (`/analysis?id=…`; `/analysis/[id]` redireciona) |
| `lib/analysis-schema.ts` | Schema único (OpenAI, validação e tipos) |
| `lib/prompt.ts` | Prompt do sistema |
| `lib/server/*` | Logger, validação de upload, rate limit |
| `components/scanner` | Efeito de scanner (CSS puro) |
| `app/sw.ts` | Service worker |

## Como executar

Requisitos: Node.js 20+.

```bash
npm install
cp .env.example .env.local   # preencha OPENAI_API_KEY
npm run dev                  # http://localhost:3000
```

Outros scripts:

```bash
npm run lint
npm run typecheck
npm run build    # build de produção (webpack, necessário para o Serwist)
npm run start
npm run icons    # regenera ícones a partir de public/icons/icon.svg
```

O service worker só é gerado no build de produção. Para testar PWA/offline localmente use `npm run build && npm run start`.

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `OPENAI_API_KEY` | sim | Chave da OpenAI. Existe apenas no servidor. |
| `OPENAI_MODEL` | não | Modelo multimodal (padrão `gpt-5.4-mini`). |
| `RATE_LIMIT_PER_HOUR` | não | Análises por hora por IP (padrão `200`; numa escola todos compartilham o mesmo IP). |

Nunca faça commit de `.env.local`.

## OpenAI

- Chamada feita **somente no servidor** (`/api/analyze`); o navegador nunca vê a chave.
- `responses.parse` com `zodTextFormat` — a resposta é JSON validado contra o schema, sem parsing de texto livre.
- Controle de custo: imagem reduzida no cliente, `reasoning.effort: "low"`, `max_output_tokens` limitado, listas com tamanho máximo no schema, `store: false`.
- Timeout de 45 s e 1 nova tentativa.
- Logs em JSON com `requestId`, modelo, status, latência e `input_tokens` / `output_tokens` / `total_tokens` — sem imagem, base64 ou chave.

## PWA

- `app/manifest.ts` → `/manifest.webmanifest` (standalone, ícones 192/512 `any` e `maskable`)
- `apple-touch-icon`, favicon, `theme-color`, `viewport-fit=cover`
- Service worker (Serwist) com precache do shell (`/`, `/history`, `/analysis`, `/about`, `/offline`), `NetworkOnly` para `/api/*` e página de fallback offline
- Cartão de instalação: prompt nativo no Android/Chromium e instruções no Safari iOS

## Deploy

Hospedado na Vercel, conectado a este repositório (push em `main` → produção).

1. Importe o repositório na Vercel (framework Next.js; o script `build` já usa `--webpack`).
2. Em **Settings → Environment Variables**, adicione `OPENAI_API_KEY` (Production e Preview).
3. Faça deploy e confira os logs de runtime da função `/api/analyze`.

## Privacidade

- As fotos **não são armazenadas** no servidor: a imagem fica em memória durante a requisição, é enviada à OpenAI e descartada.
- O histórico (resultado + miniatura) fica apenas no IndexedDB do navegador do usuário e pode ser apagado a qualquer momento.
- Sem contas, cookies de rastreamento ou analytics.

## Limitações da IA

- A análise usa apenas uma fotografia e pode conter erros de identificação.
- Sintomas parecidos podem ter causas diferentes; problemas são apresentados como possibilidades, nunca como diagnóstico.
- Não substitui agrônomo, botânico ou profissional especializado — especialmente em casos de fungos, bactérias, pragas, toxicidade, consumo da planta ou uso de produtos químicos.
- O rate limit em memória vale por instância da função (proteção básica). Para um limite global, considere Upstash Redis.
