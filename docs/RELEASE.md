# Release process

Releases are tag-driven.

## One-time setup

Create a GitHub Actions repository secret named `FOUNDRY_RELEASE_TOKEN`.

Use the package-specific release token from the Foundry VTT package page. Do not commit this token to the repository.

## Publishing a release

1. Update `module.json`, `package.json`, and `package-lock.json` to the same version.
2. Run the local validation:

```powershell
npm run check
npm run build
```

3. Commit the changes, including `dist/main.js` when runtime code changed.
4. Create and push a matching tag:

```powershell
git tag v0.34.5
git push origin v0.34.5
```

The GitHub Actions workflow will:

1. install dependencies with `npm ci`;
2. run `npm run check`;
3. validate that the tag matches `module.json`, `package.json`, and `package-lock.json`;
4. build the Foundry release zip;
5. create a GitHub Release with `module.json` and `paranormal-toolkit.zip`;
6. run the Foundry Package Release API in dry-run mode;
7. publish the new package version to Foundry VTT.

## Important

Do not create the GitHub Release manually before pushing the tag. The tag creates the release.

The Foundry release API receives a version-specific manifest URL, not the `latest/download/module.json` URL used inside `module.json`.
