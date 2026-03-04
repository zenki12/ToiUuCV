# Tối Ưu CV — Hướng dẫn Setup

## Yêu cầu
- Node.js 18+
- npm hoặc yarn
- Tài khoản Supabase (free tier)
- Tài khoản Google Cloud Console
- Tài khoản Vercel (free tier)

---

## Bước 1: Cài đặt dependencies

```bash
npm install
```

---

## Bước 2: Tạo Supabase project

1. Vào https://supabase.com → Đăng ký / Đăng nhập
2. Tạo New Project (chọn region gần nhất, VD: Singapore)
3. Lấy thông tin từ **Settings → API**:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Lấy Database URL từ **Settings → Database → Connection string**:
   - Chọn **Transaction** mode → `DATABASE_URL` (thêm `?pgbouncer=true` cuối)
   - Chọn **Session** mode → `DIRECT_URL`

### Tạo Storage bucket:
1. Vào **Storage** trong Supabase dashboard
2. Tạo bucket tên `cv-uploads`
3. Tắt Public access (để bucket private)

---

## Bước 3: Tạo Google OAuth credentials

1. Vào https://console.cloud.google.com
2. Tạo project mới hoặc chọn project có sẵn
3. Vào **APIs & Services → Credentials**
4. Tạo **OAuth 2.0 Client ID** (loại Web Application)
5. Thêm Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://your-domain.vercel.app/api/auth/callback/google` (prod)
6. Lấy **Client ID** và **Client Secret**

---

## Bước 4: Cấu hình environment variables

```bash
cp .env.example .env.local
```

Điền tất cả các giá trị vào `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
DATABASE_URL=postgresql://postgres.xxx:password@aws-0-xxx.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.xxx:password@aws-0-xxx.pooler.supabase.com:5432/postgres
NEXTAUTH_SECRET=<kết quả lệnh: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx
ADMIN_EMAIL=okthaiday@gmail.com
```

---

## Bước 5: Chạy migrations và seed

```bash
# Generate Prisma client
npm run db:generate

# Push schema lên Supabase
npm run db:push

# Seed FAQ + Testimonials
npm run db:seed
```

---

## Bước 6: Chạy development server

```bash
npm run dev
```

Mở http://localhost:3000

---

## Bước 7: Deploy lên Vercel

```bash
# Cài Vercel CLI
npm i -g vercel

# Deploy
vercel

# Thiết lập env vars trên Vercel
vercel env add NEXTAUTH_SECRET
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
# ... (thêm tất cả env vars)

# Deploy production
vercel --prod
```

---

## Nghiệm thu Milestone 1

Sau khi setup xong, kiểm tra các điểm sau:

- [ ] `npm run dev` chạy thành công, không lỗi
- [ ] Mở http://localhost:3000 → Landing page hiển thị đẹp
- [ ] Click button "Đăng nhập" → Chuyển sang trang login
- [ ] Trang login có nút "Tiếp tục với Google"
- [ ] Click "Tiếp tục với Google" → Popup OAuth Google
- [ ] Đăng nhập thành công → Redirect về /dashboard
- [ ] Navbar hiển thị avatar + tên user
- [ ] Toggle VI/EN hoạt động (texts đổi ngôn ngữ)
- [ ] Landing page counters hiển thị số (có thể là 0 nếu DB trống)
- [ ] Đăng nhập bằng email admin → Thấy menu Admin trong navbar
- [ ] Vào /admin → Không bị redirect nếu là admin

---

## Cấu trúc thư mục

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   ← NextAuth handler
│   │   └── stats/                ← Public counters
│   ├── admin/                    ← Admin pages
│   ├── analyze/                  ← Upload form
│   ├── dashboard/                ← Report history
│   ├── login/                    ← Google OAuth login
│   ├── layout.tsx                ← Root layout + fonts
│   ├── page.tsx                  ← Landing page
│   ├── providers.tsx             ← Session + i18n
│   └── globals.css               ← Design tokens
├── components/
│   ├── landing/                  ← Landing sections
│   └── layout/                   ← Navbar, Footer
├── lib/
│   ├── auth.ts                   ← NextAuth config
│   ├── prisma.ts                 ← Prisma client
│   ├── supabase.ts               ← Supabase client
│   └── i18n/context.tsx          ← VI/EN translations
├── middleware.ts                 ← Route protection
└── types/next-auth.d.ts          ← Type extensions

prisma/
├── schema.prisma                 ← Database schema
└── seed.ts                       ← Seed data
```

---

## Milestones tiếp theo

- **Milestone 2**: Upload API + Text extraction (pdf-parse, mammoth) + PII masking
- **Milestone 3**: CV Analysis Engine (rule-based, không AI)
- **Milestone 4**: Gap Map engine + Report API + Usage limits
- **Milestone 5**: Report UI đầy đủ (radar chart, gap map table, optimization lab)
- **Milestone 6**: Admin panel + Auto-delete + Deploy production
# ToiUuCV
