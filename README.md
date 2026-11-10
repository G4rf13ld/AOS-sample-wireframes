# AOS – Sample Wireframes & Dynamic Planning Prototypes

Interaktivní prototyp a reimplementace wireframů aplikace **AOS** (Advertising / Agency Operating System) s novým navigačním modelem **„sloupce sbalené do cesty“**.

Postaveno na **Vite + React + TypeScript + Tailwind CSS** s využitím komponent ve stylu **shadcn/ui** (Radix UI) a animací **Framer Motion**.

---

## Klíčové koncepty a funkce

### 1. Sloupce sbalené do cesty (`BreadcrumbPath`)
- **Navigace v horní liště**: Ukazuje aktuální hloubku v hierarchii (`Kampaně › Jarní kampaň 2027 › Online 1`).
- **Sloupce na vyžádání**: Každý článek cesty je rozbalovací seznam sourozenců (všechny kampaně, sourozenecké kampaně, mediální části). Poskytuje plný komfort sloupcové navigace bez trvalého zabírání pixelů na šířku.
- **Přeskakování pro kampaně s jedinou částí**: Pokud má kampaň pouze 1 část (např. *Launch Vela Aqua*), úroveň výběru části se přeskočí a otevře se rovnou plán. Článek části se v cestě ukáže, až když má kampaň alespoň dvě části.

### 2. Posuvné sloupce přes sebe (Sliding Columns)
- Plynulý posun obrazovek zprava doleva s fyzikálním spring přechodem (`Framer Motion`).
- Návrat zpět (tlačítkem Zpět nebo kliknutím v cestě) plynule odsouvá vrchní sloupec zpět doprava.

### 3. Sbalitelné levé menu modulů
- V detailu mediaplánu se levé menu modulů automaticky sbalí na úzký pruh ikon (56 px) s tooltips, aby týdenní plánovací matice měla maximální prostor na obrazovce.

### 4. Režim srovnání (Přepínač v hlavičce)
- **Sbalené do cesty**: Doporučený model šetřící pixely.
- **3 Sloupce vedle sebe**: Původní desktopový pohled z wireframu `Přístup 3 – Sloupce` (Kampaně \| Mediální části \| Detail/Mediaplán) pro přímé porovnání UX.

### 5. Kompletní reimplementace wireframů
- **Nová kampaň**: Dvoukrokový průvodce (Kampaň → Mediální část).
- **Nová mediální část**: Založení části s převzetím termínů a limitací rozpočtu.
- **Detail kampaně**: Přehled částí, progress bar čerpání, správa rozpočtu a varování při překročení.
- **Mediaplán – plánování po týdnech**: Matice týdnů T9–T16 s editovatelnými impressemi, skupinami (Awareness, Výkon, Ostatní) a DPH.
- **Mediaplán – přehled**: Mini grafy rozložení objemu v čase, stavy rezervací a kalkulace Client cost.
- **Údaje kampaně a části**: Formuláře se zamčenými poli a povinným zadáním důvodu změny.

---

## Spuštění lokálně

### Požadavky
- Node.js 18+
- npm 9+

### Instalace a start
```bash
# Instalace závislostí
npm install

# Spuštění vývojového serveru
npm run dev
```

Aplikace poběží na `http://localhost:5173`.

### Produkční build
```bash
npm run build
npm run preview
```
