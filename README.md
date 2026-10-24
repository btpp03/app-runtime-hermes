# ps-runtime-hermes

Small Node runtime for a PandaStack **App** (`npm install` / `node index.js`).

```
public entrance  https://<app-domain>   (TLS ends at the platform edge)
        │
        ├── GET /  , /<S>        -> 200 + base64 share string   (warm-up target)
        └── Upgrade on /<W>      -> raw byte bridge -> 127.0.0.1:3001
                                      └── local core process
optional sidecar -> A1:A2 (TLS)       # status reporter
```

## Env

| var | meaning |
| --- | --- |
| `ID` | user id for the core profile (required) |
| `P` | entrance port (platform injects 3000) |
| `W` | upgrade path, default = first 8 chars of `ID` |
| `S` | share-string path, default `s` |
| `H` | app domain, used to build the share string |
| `NM` | label inside the share string |
| `A1` / `A2` / `A3` | optional sidecar host / port / key |
| `V1` / `V2` | pinned core / sidecar versions |

## Behaviour

- Core and sidecar binaries are fetched once into `.cache/` at first boot, with two
  mirror prefixes as fallback; arch (amd64/arm64) is detected at runtime.
- A child that exits is respawned after 3 s, so a platform restart self-heals.
- Nothing secret lives in the repo — everything comes from env.
- `GET /` always answers 200 so an external pinger can keep the app warm.
