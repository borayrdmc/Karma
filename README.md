<div align="center">

<img src="apps/web/src/app/icon.svg" alt="Karma Logo" width="96" height="96" />

# Karma

### İndirim gerçek mi, yoksa önce bindirim sonra indirim mi?

**Trendyol ve Hepsiburada ürünlerini tek bir panelden takip edin; fiyat geçmişini görün, sahte indirimleri yakalayın.**

<a href="https://karmatakip.com"><strong>🌐 Canlı Demo: karmatakip.com</strong></a>
&nbsp;·&nbsp;
<a href="#-özellikler">Özellikler</a>
&nbsp;·&nbsp;
<a href="#-sistem-mimarisi">Mimari</a>
&nbsp;·&nbsp;
<a href="#-mühendislik-detayları">Mühendislik</a>
&nbsp;·&nbsp;
<a href="#-yerel-kurulum">Kurulum</a>

<br />

[![CI](https://github.com/borayrdmc/Karma/actions/workflows/ci.yml/badge.svg)](https://github.com/borayrdmc/Karma/actions/workflows/ci.yml)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Fastify](https://img.shields.io/badge/Fastify-5-000000?logo=fastify&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Drizzle_ORM-4169E1?logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-BullMQ-DC382D?logo=redis&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Turborepo](https://img.shields.io/badge/Turborepo-pnpm-EF4444?logo=turborepo&logoColor=white)

<br />

<img src="apps/web/public/landing/dashboard-hero-new.webp" alt="Karma Dashboard" width="100%" />

</div>

---

## 💡 Neden Karma?

Türkiye'deki e-ticaret kampanyalarında sık görülen bir durum var: Ürünün fiyatı kampanyadan birkaç gün önce **yükseltiliyor**, sonra "%30 indirim" etiketiyle **eski fiyatına ya da biraz altına** geri çekiliyor. Bu indirimlerin gerçek olup olmadığını anlamak için ürünün fiyat geçmişini bilmek gerekiyor.

**Karma** tam olarak bu işi yapıyor:

1. 🔗 Ürün linkini yapıştırın (Trendyol veya Hepsiburada).
2. ⏱️ Karma fiyatı **her 4 saatte bir** arka planda otomatik kontrol eder.
3. 📈 Fiyat geçmişi grafikle gösterilir; dip ve zirve noktaları işaretlenir.
4. 🧠 **Price Insight** motoru, indirimin **gerçek mi sahte mi** olduğunu söyler.

---

## ✨ Özellikler

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>🔗 Tek Tıkla Ürün Takibi</h3>
      <p>Linki yapıştırın, isterseniz <em>"Anneme alacağım kahve makinesi"</em> gibi kendinize özel bir isim verin. Platform ve ürün kodu URL'den otomatik çıkarılır.</p>
      <img src="apps/web/public/landing/add-product.webp" alt="Ürün Ekleme" width="100%" />
    </td>
    <td width="50%" valign="top">
      <h3>📈 Fiyat Geçmişi ve Analiz</h3>
      <p>Her ürün için güncel fiyat, en düşük (dip) ve en yüksek (zirve) değerler ile etkileşimli fiyat değişim grafiği.</p>
      <img src="apps/web/public/landing/detail-chart-new.webp" alt="Fiyat Değişim Grafiği" width="100%" />
    </td>
  </tr>
</table>

| | Özellik | Açıklama |
|:-:|---|---|
| 🛒 | **Platformlar Arası Ortak Liste** | Trendyol ve Hepsiburada ürünleri tek panelde; platforma göre filtreleme |
| 🧠 | **Sahte İndirim Tespiti** | 30 günlük hareketli pencereyle gerçek ve sahte indirim ayrımı |
| 🏷️ | **İndirim / Zam Rozetleri** | Her kartta son fiyat değişimi (₺) ve ne kadar önce değiştiği |
| ⏰ | **Otomatik Güncelleme** | BullMQ cron job'ları ile 4 saatte bir arka planda fiyat kontrolü |
| 🔐 | **Güvenli Hesap Sistemi** | Better Auth ile e-posta/şifre girişi, oturum yönetimi ve e-postayla şifre sıfırlama |
| 🎨 | **Özenli Arayüz** | Koyu tema, GSAP animasyonları, boş/hata/404 durumları için özel illüstrasyonlar |

<div align="center">
  <img src="apps/web/public/empty-state.webp" alt="Boş Durum" height="120" />
  &nbsp;&nbsp;&nbsp;
  <img src="apps/web/public/error-state.webp" alt="Hata Durumu" height="120" />
  &nbsp;&nbsp;&nbsp;
  <img src="apps/web/public/not-found.webp" alt="404" height="120" />
  <br />
  <sub>Boş durum, hata ve 404 sayfaları için özel illüstrasyonlar</sub>
</div>

---

## 🧠 Price Insight: Sahte İndirim Tespit Motoru

Projenin temel algoritması. Son **30 günlük** fiyat hareketine ve pencereden önceki son referans fiyata bakarak bir indirimin gerçekten "indirim" olup olmadığına karar verir. %1'in altındaki dalgalanmalar gürültü olarak değerlendirilir.

```mermaid
flowchart LR
    A["Fiyat Geçmişi"] --> B{"2'den az kayıt?"}
    B -- Evet --> C["insufficient_data"]
    B -- Hayır --> D{"Değişim %1'den az mı?"}
    D -- Evet --> E["no_change"]
    D -- Hayır --> F{"Son fiyat yükseldi mi?"}
    F -- Evet --> G["price_increase"]
    F -- Hayır --> H{"Zirve öncesi dibin altında mı?"}
    H -- Evet --> I["✅ real_discount"]
    H -- Hayır --> J["⚠️ fake_discount"]
```

| Durum | Anlamı |
|---|---|
| ✅ `real_discount` | Fiyat, zirveden önceki dip seviyesinin **altına** indi. Gerçek bir fırsat. |
| ⚠️ `fake_discount` | Fiyat zirveden düştü ama hâlâ **zirve öncesi dibin üzerinde**. Önce bindirim, sonra indirim. |
| 📈 `price_increase` | Fiyat yükseldi; dip noktaya göre artış tutarı ve yüzdesi hesaplanır. |
| ➖ `no_change` | Fiyat sabit ya da değişim %1 eşiğinin altında. |
| ⏳ `insufficient_data` | Analiz için en az 2 fiyat kaydı gerekir. |

---

## 🏗️ Sistem Mimarisi

Karma, sorumlulukları birbirinden ayrılmış bir **pnpm + Turborepo monorepo** olarak tasarlandı. Kullanıcıya dönük web katmanı ile kazıma (scraping) yapan worker sunucusu **tamamen ayrı süreçlerde** çalışır. Worker dış dünyaya kapalıdır ve sadece web uygulamasının BFF katmanı üzerinden erişilebilir.

```mermaid
flowchart LR
    U["👤 Kullanıcı"] -->|HTTPS| W

    subgraph WEB["apps/web · Next.js 16"]
        W["App Router UI<br/>React 19 + Tailwind v4"]
        BA["Better Auth<br/>Session + Middleware"]
        BFF["BFF Proxy<br/>Zod Validation"]
        PI["Price Insight Engine"]
    end

    subgraph SVC["apps/services · Fastify 5 (iç ağ)"]
        API["REST API<br/>internalAuth + Rate Limit"]
        SCR["Scraper Orkestratörü"]
        Q["BullMQ Worker<br/>+ Scheduler"]
    end

    W --> BA
    W --> BFF
    W --> PI
    BFF -->|"x-internal-api-key<br/>x-user-id"| API
    API --> SCR
    Q --> SCR
    SCR -->|"İç API (JSON)"| HB["Hepsiburada"]
    SCR -->|"Fetch → Patchright"| TY["Trendyol"]

    BA --> DB[("PostgreSQL<br/>Drizzle ORM")]
    API --> DB
    Q --> DB
    Q <--> R[("Redis")]
```

### 📦 Monorepo Yapısı

```
Karma/
├── apps/
│   ├── web/                # Next.js 16: UI, Better Auth, BFF Proxy, Price Insight
│   └── services/           # Fastify 5: REST API, Scraper'lar, BullMQ Queue/Worker
└── packages/
    ├── db/                 # Drizzle şemaları (Auth + Product), migration'lar, modüler sorgular
    ├── errors/             # ServiceError + isFatalError (retry sınıflandırması)
    ├── types/              # Uçtan uca paylaşılan TypeScript tipleri
    ├── validations/        # Ortak Zod şemaları
    ├── utils/              # Platform bağımsız yardımcılar
    ├── eslint-config/      # Paylaşılan ESLint preset'leri
    └── typescript-config/  # Paylaşılan tsconfig preset'leri
```

### 🔄 Ürün Ekleme Akışı (Smart Tracking)

```mermaid
sequenceDiagram
    participant C as Tarayıcı
    participant W as Next.js BFF
    participant S as Fastify Services
    participant D as PostgreSQL
    participant P as Trendyol / Hepsiburada

    C->>W: POST /api/products { productUrl }
    W->>W: Session doğrula + Zod ile URL doğrula
    W->>S: POST /api/products (x-internal-api-key, x-user-id)
    S->>S: URL'den platform + ürün kodu çıkar
    S->>D: Ürün zaten kayıtlı mı?
    alt Ürün kayıtlı
        D-->>S: productId
        Note over S,P: Scraping atlanır, kaynak tasarrufu
    else Yeni ürün
        S->>P: Ürün verisini kazı
        P-->>S: Ad + en ucuz fiyat
        S->>D: Ürünü ve ilk fiyatı kaydet
    end
    S->>D: Kullanıcıyı ürüne bağla (409 on conflict)
    S-->>W: 201 { TrackedProductItem }
    W-->>C: Dashboard güncellenir
```

---

## 🔬 Mühendislik Detayları

### 🕷️ Hibrit Kazıma ve WAF Atlatma

| Platform | Strateji |
|---|---|
| **Hepsiburada** | Dokümante edilmemiş, public iç listing API'si (`api/v1/product/listings/<code>`) üzerinden structured JSON. Tüm satıcılar arasından **en ucuz listing** seçilir. `-p-` ve `-pm-` (merchant) URL formatlarının ikisi de desteklenir. |
| **Trendyol** | **İki aşamalı fallback:** Önce hafif Node `fetch` + gerçekçi Chrome header'ları denenir. WAF/Captcha'ya takılırsa `patchright` (stealth Playwright fork'u) ile gerçek Chromium'a geçilir. İki yöntem de başarısız olursa hatalar `AggregateError` olarak toplanır. |

Tüm istekler, Türkiye havuzundan **otomatik IP rotasyonlu residential proxy** üzerinden geçer (`undici` `ProxyAgent` ve Patchright proxy konfigürasyonu).

### ⚡ Bant Genişliği Optimizasyonları

Residential proxy trafiği GB başına ücretlendirildiği için her istekten gereksiz byte'ları atmak doğrudan maliyeti düşürüyor:

| Optimizasyon | Teknik | Önce → Sonra | Tasarruf |
|---|---|---|:-:|
| **Stream Early-Cutoff** (Hepsiburada) | `response.body.getReader()` ile akış dinlenir; gereken veri `<head>` içinde yakalandığı anda `reader.cancel()` ile soket kapatılır | 1.036 KB → 127 KB | **%88** |
| **Document-Only Intercept** (Trendyol) | `page.route('**/*')` ile sadece ana HTML dokümanına izin verilir; resim, CSS, font ve script istekleri `abort()` edilir | ~8 MB → ~200 KB | **%97** |

### 🔁 Dayanıklı Arka Plan İşleri (Redis + BullMQ)

- **Producer/Consumer mimarisi:** Scheduler 4 saatte bir tüm takip edilen ürünler için **ayrı ayrı job'lar** oluşturur (`addBulk`), böylece tek bir üründeki hata diğerlerini etkilemez.
- **Rate limiting:** Worker `concurrency: 1` ve `2 saniyede 1 istek` limitiyle çalışır; hedef sitelere yük bindirmez.
- **Jitter'lı exponential backoff:** Geçici ağ hataları artan ve rastgeleleştirilmiş aralıklarla yeniden denenir.
- **Akıllı hata sınıflandırması (`isFatalError`):** `429`, `403`, *"invalid product code"*, *"no listings were found"* gibi kalıcı hatalar `UnrecoverableError`'a çevrilir ve **boşuna yeniden denenmez**.
- **Delta-only yazım:** Yeni fiyat son bilinen fiyattan farklı değilse veritabanına kayıt atılmaz.
- **Çöp toplama:** Her Pazar 03:00'te, hiçbir kullanıcının takip etmediği ürünler temizlenir.

### 🔐 Güvenlik

- **BFF (Backend-for-Frontend) deseni:** Tarayıcı worker sunucusuyla hiçbir zaman doğrudan konuşmaz. Kullanıcı kimliği istemciden değil, sunucu tarafındaki **session'dan** alınır.
- **Gizli servis:** Fastify sunucusu dış dünyaya kapalıdır ve sadece Docker iç ağı üzerinden, `x-internal-api-key` başlığını doğrulayan `internalAuth` plugin'iyle erişilebilir.
- **Katmanlı doğrulama:** Next.js middleware ile route koruması, Zod ile girdi doğrulaması ve `@fastify/rate-limit` ile istek sınırlama.
- **Merkezi hata yönetimi:** Tüm katmanlarda tek tip `ServiceError` ve Fastify `setErrorHandler`; iç hata detayları istemciye sızdırılmaz.
- **Veritabanı bütünlüğü:** `(platform, productCode)` ve `(userId, productId)` unique kısıtları, cascade silme ve `(productId, checkedAt)` bileşik indeksi.

### 🚀 CI/CD ve Canlı Ortam

```mermaid
flowchart LR
    A["git push main"] --> B["GitHub Actions"]
    B --> C["check-types"]
    C --> D["lint"]
    D --> E["build"]
    E -->|"✅ success()"| F["Coolify Webhook"]
    F --> G["Hetzner ARM64<br/>Docker"]
    E -->|"❌ fail"| H["Deploy durur"]
```

- **CI-gated deployment:** Coolify `Manual deployments only` modundadır. Sadece tip kontrolü, lint ve build adımları **yeşil** yandığında webhook tetiklenir; hatalı kod canlıya çıkmaz.
- **Altyapı:** Hetzner CAX11 (ARM64) üzerinde Coolify v4 ile Docker container'ları, Traefik + Let's Encrypt SSL, Cloudflare DNS, Supabase PostgreSQL.
- **Gözlemlenebilirlik:** Sentry (client, server ve edge runtime'ları; release health), Better Stack ile 7/24 uptime izleme, Dependabot ile bağımlılık güvenlik taraması.

---

## 🧰 Teknoloji Yığını

| Katman | Teknolojiler |
|---|---|
| **Dil** | TypeScript (uçtan uca tip güvenliği) |
| **Frontend** | Next.js 16 (App Router, Server Components, Route Handlers), React 19, Tailwind CSS v4, shadcn/ui, Radix UI, Recharts, GSAP |
| **Kimlik Doğrulama** | Better Auth (Drizzle adapter), Resend (şifre sıfırlama e-postası) |
| **Backend** | Fastify 5, fastify-plugin, @fastify/rate-limit |
| **Veritabanı** | PostgreSQL, Drizzle ORM, drizzle-kit |
| **Kuyruk** | Redis, BullMQ, ioredis |
| **Kazıma** | Patchright (stealth Playwright), undici, residential proxy |
| **Doğrulama** | Zod |
| **Monorepo** | pnpm workspaces, Turborepo |
| **DevOps** | GitHub Actions, Docker, Coolify, Hetzner, Cloudflare |
| **İzleme** | Sentry, Better Stack, Dependabot |

---

## 🛠️ Yerel Kurulum

### Gereksinimler

- **Node.js** ≥ 22
- **pnpm** 9
- **PostgreSQL** (yerel veya Supabase/Neon)
- **Redis** (örn. Docker ile)

### Adımlar

```bash
# 1. Repoyu klonla
git clone https://github.com/borayrdmc/Karma.git
cd Karma

# 2. Bağımlılıkları yükle
pnpm install

# 3. Ortam değişkenlerini ayarla
cp apps/web/.env.example apps/web/.env
cp apps/services/.env.example apps/services/.env
cp packages/db/.env.example packages/db/.env

# 4. Redis'i başlat
docker run -d --name karma-redis -p 6379:6379 redis:7-alpine

# 5. Veritabanı migration'larını çalıştır
pnpm --filter @repo/db db:migrate

# 6. Patchright için Chromium'u kur
pnpm --filter services exec patchright install chromium

# 7. Tüm uygulamaları geliştirme modunda başlat
pnpm dev
```

| Uygulama | Adres |
|---|---|
| Web (Next.js) | http://localhost:3000 |
| Services (Fastify) | http://localhost:3001 |

### Önemli Ortam Değişkenleri

| Değişken | Konum | Açıklama |
|---|---|---|
| `DATABASE_URL` | web, services, db | PostgreSQL bağlantı adresi |
| `INTERNAL_API_KEY` | web, services | Web ve services arasındaki ortak gizli anahtar (**iki tarafta aynı olmalı**) |
| `BETTER_AUTH_SECRET` | web | Oturum imzalama anahtarı (`openssl rand -base64 32`) |
| `SERVICES_URL` | web | Fastify sunucusunun adresi |
| `REDIS_URL` | services | BullMQ için Redis bağlantısı |
| `PROXY_URL` | services | *(Opsiyonel)* Residential proxy adresi |
| `RESEND_API_KEY` | web | *(Opsiyonel)* Şifre sıfırlama e-postaları |
| `NEXT_PUBLIC_SENTRY_DSN` | web | *(Opsiyonel)* Sentry hata takibi |

### Faydalı Komutlar

```bash
pnpm build          # Tüm paketleri derle (Turborepo cache ile)
pnpm lint           # ESLint denetimi
pnpm check-types    # Monorepo genelinde TypeScript tip kontrolü
pnpm format         # Prettier ile formatla
```

---

## 🗺️ Yol Haritası

- [x] Trendyol ve Hepsiburada desteği
- [x] Price Insight: sahte indirim tespiti
- [x] Otomatik fiyat güncelleme (BullMQ)
- [x] Better Auth ile kullanıcı sistemi ve şifre sıfırlama
- [x] CI-gated production deployment
- [ ] Hedef fiyat alarmları (e-posta / push bildirimi)
- [ ] Amazon ve N11 desteği
- [ ] Aynı ürünün platformlar arası fiyat karşılaştırması
- [ ] Tarayıcı eklentisi ile tek tıkla takip

---

<div align="center">

**[karmatakip.com](https://karmatakip.com)** üzerinden canlı olarak deneyebilirsiniz.

[@borayrdmc](https://github.com/borayrdmc) tarafından geliştirildi.

<sub>Bu projeyi beğendiyseniz ⭐ vermeyi unutmayın!</sub>

</div>
