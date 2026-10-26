# Wallpapers Folder

You can drop your default wallpaper images here (e.g. into subfolders like `nature/`, `abstract/`, etc.).

When deployed to **GitHub Pages, Netlify, or Cloudflare Pages**, files in `public/` are served statically at the root of your domain.

### Example:
If you place a file at:
`public/wallpapers/nature/mountain.jpg`

You can add it to `src/data/wallpapers.json`:
```json
{
  "id": "nature-mountain",
  "title": "Mountain Sunset",
  "category": "Nature",
  "url": "/wallpapers/nature/mountain.jpg"
}
```

It will be served instantly from your website CDN with zero server runtime and zero database costs!
