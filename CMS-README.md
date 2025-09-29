# HYENA Portfolio - Decap CMS Integration

Dit project is nu uitgerust met Decap CMS voor eenvoudig contentbeheer.

## Wat is toegevoegd

### 1. Decap CMS Bestanden
- `admin/index.html` - CMS interface
- `admin/config.yml` - CMS configuratie
- `netlify.toml` - Netlify configuratie
- `scripts/cms-loader.js` - Script om CMS content te laden

### 2. Content Mappen
- `_data/` - YAML bestanden voor pagina content
- `_projects/` - Markdown bestanden voor projecten

### 3. Voorbeeld Content
- `_data/home.yml` - Homepage content
- `_data/about.yml` - About pagina content  
- `_data/contact.yml` - Contact informatie
- `_projects/untox-social-media-app.md` - Voorbeeld project

## Setup Instructies

### 1. Netlify Deploy
1. Push je code naar GitHub
2. Verbind je repository met Netlify
3. Deploy je site

### 2. Netlify Identity Activeren
1. Ga naar je Netlify dashboard
2. Navigeer naar Site Settings > Identity
3. Klik op "Enable Identity"
4. Ga naar Registration > Invite only
5. Voeg jezelf toe als gebruiker

### 3. Git Gateway Activeren
1. In Netlify Identity settings
2. Ga naar Services > Git Gateway
3. Klik op "Enable Git Gateway"

### 4. CMS Toegang
- Ga naar `jouw-site.netlify.app/admin`
- Log in met je Netlify Identity account
- Begin met het beheren van je content!

## CMS Functies

### Content Types
1. **Projects** - Beheer je portfolio projecten
2. **Pages** - Bewerk homepage, about en contact content

### Project Fields
- Titel en beschrijving
- Featured image
- Technologieën gebruikt
- Categorie (Web Design, Blender, Branding, UI/UX)
- Featured status
- Uitgebreide markdown content

### Page Content
- Hero teksten
- Services
- Bio en vaardigheden
- Contact informatie
- Social media links

## Content Updates

Content wordt automatisch geladen via `cms-loader.js`. De website haalt content op uit de YAML bestanden in de `_data` map.

## Deployment

Elke keer dat je content bewerkt via de CMS:
1. Wijzigingen worden opgeslagen in je Git repository
2. Netlify detecteert automatisch wijzigingen
3. Je site wordt automatisch herdeployed

## Aanpassingen

### Nieuwe Content Types Toevoegen
Bewerk `admin/config.yml` om nieuwe content types toe te voegen.

### Styling Aanpassen  
De CMS interface gebruikt de standaard Decap CMS styling. Voor custom styling, voeg CSS toe aan `admin/index.html`.

### Content Loading Uitbreiden
Bewerk `scripts/cms-loader.js` om nieuwe content types te ondersteunen.

## Troubleshooting

### CMS laadt niet
- Controleer of Netlify Identity is geactiveerd
- Controleer of Git Gateway is ingeschakeld
- Zorg dat je bent ingelogd

### Content verschijnt niet
- Controleer of `cms-loader.js` correct wordt geladen
- Check browser console voor JavaScript errors
- Verify YAML syntax in data bestanden

### Deploy problemen
- Check Netlify deploy logs
- Verify `netlify.toml` configuratie
- Zorg dat alle bestanden zijn gecommit naar Git