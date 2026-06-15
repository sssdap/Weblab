# Анализ требований проекта Weblab

## Обзор текущей структуры

### Архитектура проекта
```
Weblab/
├── app/                        # Next.js App Router
│   ├── (authenticated)/        # Protected routes
│   │   ├── (student)/         # Student UI
│   │   └── admin/             # Admin panel
│   └── auth/                  # Auth pages
├── components/                # React components
│   ├── admin/                 # Admin components
│   ├── settings/              # Settings sections
│   ├── tests/                 # Test/Quiz components
│   └── ui/                    # UI primitives (Radix UI)
├── lib/
│   ├── mock-data.ts           # MOCK DATA (need to replace)
│   ├── types.ts               # TypeScript interfaces
│   ├── firebase/              # Firebase integration
│   └── types/                 # Type definitions
├── services/                  # Business logic
├── repositories/              # Data access layer (empty)
└── providers/                 # Context providers
```

### Stack
- **Frontend**: Next.js 16.2.4, React 19.2.4, TypeScript
- **UI*