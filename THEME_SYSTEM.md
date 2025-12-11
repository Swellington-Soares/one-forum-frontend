# 🎨 Sistema de Temas - Dark & Light Mode

## Visão Geral

Sistema completo de temas claro e escuro implementado na aplicação One Forum, utilizando Angular Material 3, CSS Variables e Angular Signals.

## Arquitetura

### 1. **ThemeService** (`src/app/core/services/theme.service.ts`)
Serviço responsável por gerenciar o estado do tema e aplicar as mudanças.

**Funcionalidades:**
- Detecta preferência do sistema operacional
- Persiste preferência no localStorage
- Aplica classes CSS no documento raiz
- Usa Angular Signals para reatividade

**Métodos:**
```typescript
toggleTheme(): void  // Alterna entre light/dark
setTheme(theme: Theme): void  // Define tema específico
theme: Signal<Theme>  // Estado atual do tema
```

### 2. **Variáveis CSS** (`src/custom-theme.scss`)
Paleta de cores customizadas para cada tema.

**Tema Claro:**
```scss
--bg-primary: #F9FAFB;      // Fundo principal
--bg-secondary: #ffffff;     // Fundo secundário (cards)
--bg-tertiary: #f3f4f6;      // Fundo terciário (inputs)
--text-primary: #111827;     // Texto principal
--text-secondary: #6b7280;   // Texto secundário
--text-tertiary: #9ca3af;    // Texto terciário
--border-color: #e5e7eb;     // Bordas
--button-primary-bg: #0f172a; // Botão primário
--button-primary-text: #ffffff;
--button-secondary-bg: #e5e7eb; // Botão secundário
--button-secondary-text: #0f172a;
--card-shadow: rgba(0, 0, 0, 0.1);
```

**Tema Escuro:**
```scss
--bg-primary: #0f172a;       // Fundo principal escuro
--bg-secondary: #1e293b;     // Fundo secundário
--bg-tertiary: #334155;      // Fundo terciário
--text-primary: #f8fafc;     // Texto claro
--text-secondary: #cbd5e1;   // Texto secundário claro
--text-tertiary: #94a3b8;    // Texto terciário claro
--border-color: #334155;     // Bordas escuras
--button-primary-bg: #3b82f6; // Botão azul
--button-primary-text: #ffffff;
--button-secondary-bg: #334155;
--button-secondary-text: #f8fafc;
--card-shadow: rgba(0, 0, 0, 0.3);
```

### 3. **Estilos Globais** (`src/theme-globals.css`)
Aplicação automática de variáveis em componentes do Angular Material.

**Componentes estilizados:**
- Cards (mat-card)
- Dialogs (mat-dialog-container)
- Form Fields (mat-form-field)
- Menus (mat-menu)
- Tooltips (mat-tooltip)
- Snackbars
- Select/Options
- Scrollbars customizadas

### 4. **Botão de Toggle** (Topbar)
Interface para alternar entre temas.

**Localização:** `src/app/components/topbar/`

**Features:**
- Ícone dinâmico (dark_mode/light_mode)
- Tooltip descritivo
- Integração com ThemeService

## Uso

### Aplicando Tema em Novos Componentes

**CSS:**
```css
.my-component {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.my-button {
  background: var(--button-primary-bg);
  color: var(--button-primary-text);
}
```

**TypeScript (se precisar do tema no código):**
```typescript
import { ThemeService } from '@core/services/theme.service';

export class MyComponent {
  themeService = inject(ThemeService);
  
  get isDarkMode(): boolean {
    return this.themeService.theme() === 'dark';
  }
}
```

### Criando Botão de Toggle Customizado

```html
<button (click)="themeService.toggleTheme()">
  <mat-icon>
    {{ themeService.theme() === 'light' ? 'dark_mode' : 'light_mode' }}
  </mat-icon>
</button>
```

## Componentes Atualizados

✅ **Core:**
- Topbar (toggle de tema)
- Theme Service

✅ **Páginas:**
- Home
- Profile
- Login
- Register

✅ **Features - Home:**
- Search Bar
- Filters Card
- Topic List
- Topic List Card

✅ **Features - Topics:**
- Topic Card
- Answer Card
- Answer Form
- No Answers Card

✅ **Shared:**
- Todos os componentes de diálogo

## Persistência

O tema escolhido é salvo no `localStorage` com a chave `app-theme` e restaurado automaticamente ao recarregar a página.

## Detecção Automática

Se o usuário não tiver escolhido um tema, o sistema detecta a preferência do sistema operacional via `prefers-color-scheme` e aplica automaticamente.

## Transições

Todas as mudanças de cor são animadas com `transition: 0.3s ease` para uma experiência suave.

## Acessibilidade

- Contraste adequado em ambos os temas
- Suporte a `prefers-color-scheme`
- Tooltips descritivos
- Ícones intuitivos

## Extensibilidade

### Adicionando Nova Cor ao Tema

1. Adicione a variável em `custom-theme.scss`:
```scss
html.light-theme {
  --my-custom-color: #value;
}

html.dark-theme {
  --my-custom-color: #value;
}
```

2. Use nos componentes:
```css
.element {
  color: var(--my-custom-color);
}
```

### Adicionando Novo Tema

1. Crie nova classe em `custom-theme.scss`
2. Defina variáveis CSS
3. Atualize `ThemeService` para suportar o novo tema
4. Adicione opção na UI

## Troubleshooting

**Cores não mudam:**
- Verifique se está usando `var(--nome-variavel)`
- Confirme se o componente importa os estilos globais

**Tema não persiste:**
- Verifique localStorage
- Confirme que `ThemeService` está no root

**Transições lentas:**
- Ajuste duração em `theme-globals.css`
- Remova transições de elementos específicos se necessário

## Manutenção

- Variáveis centralizadas facilitam mudanças globais
- Todas as cores devem usar variáveis CSS
- Evite cores hardcoded (#hex) em novos componentes
- Teste ambos os temas ao fazer alterações visuais
