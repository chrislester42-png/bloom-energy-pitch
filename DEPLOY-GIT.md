# Deploy via Git + Netlify auto-deploy

The project is already a git repo with an initial commit. Two short handoffs are
left — pushing to GitHub and linking it in Netlify — because both run through
your accounts.

## 1. Clean stale lock files (one time)

The repo was initialized through the Cowork sync layer, which left a few empty
git lock files behind. Remove them first (harmless, just leftovers):

```bash
cd ~/Documents/"Bloom Energy"/"08 Website"/bloom-site
rm -f .git/index.lock .git/HEAD.lock .git/objects/maintenance.lock
git status        # should say: clean, 1 commit on "master"
```

## 2. Push to GitHub

Create a new **empty** repo at https://github.com/new (no README/.gitignore —
this repo already has them). Then:

```bash
git branch -M main
git remote add origin https://github.com/<your-username>/bloom-energy-pitch.git
git push -u origin main
```

## 3. Connect in Netlify (auto-deploy)

1. app.netlify.com → **Add new site → Import an existing project**
2. **Deploy with GitHub** → authorize → pick `bloom-energy-pitch`
3. Netlify reads `netlify.toml` automatically:
   - Build command: `npm run build`
   - Publish directory: `out`
4. **Deploy site.**

From then on, every `git push` triggers a fresh build and deploy. No env vars or
backend needed.

## Updating later

```bash
# after editing files
git add -A && git commit -m "describe change" && git push
```

Netlify rebuilds automatically. (The local `out/` folder is only needed for the
drag-and-drop route; the Git path rebuilds it on Netlify.)
