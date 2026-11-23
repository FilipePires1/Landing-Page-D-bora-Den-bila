# Deploy — Débora Denúbila

Site estático em HTML/CSS/JS, servido por Nginx em container. O deploy é feito por GitHub Actions e a produção passa pela aprovação do Gestor (Hub).

## Ambientes

| Ambiente | URL | Branch | Container |
|---|---|---|---|
| Teste | `https://debora-teste.116-203-100-189.sslip.io` | `develop` | `nextep-debora-teste-web` |
| Produção | `https://debora.116-203-100-189.sslip.io` | `main` | `nextep-debora-web` |

O domínio oficial `deboradenubila.adv.br` continua apontando para a hospedagem atual até a troca do DNS. Quando o A record apontar para `116.203.100.189`, basta adicionar o domínio no bloco de produção do Caddy.

## Fluxo

1. Push em `develop` → build da imagem no GHCR + deploy no ambiente de teste + solicitação de aprovação no Hub.
2. Aprovação no Hub → merge `develop` → `main` + `repository_dispatch` para este repositório.
3. O workflow de produção confere a aprovação, builda a imagem do commit testado e atualiza o container de produção.

Não existe deploy de produção por push direto na `main`.

## Imagens

- `ghcr.io/filipepires1/nextep-debora-web:test-<sha>` e `:test`
- `ghcr.io/filipepires1/nextep-debora-web:<sha>` e `:latest`

## Servidor

- Produção: `/opt/nextep/debora` (`compose.prod.yml`)
- Teste: `/opt/nextep/debora-teste` (`compose.test.yml`)
- Rede: `nextep_edge` (externa), compartilhada com o Caddy.
- Sem portas publicadas no host; o Caddy faz o proxy para a porta 80 do container.

## Segredos do repositório

- `SSH_PRIVATE_KEY` — chave SSH do usuário `filipe` no VPS.
- `HUB_DEPLOY_TOKEN` — token interno do Hub (`DEPLOY_WEBHOOK_TOKEN`).

## DNS (quando for trocar o domínio oficial)

No provedor de DNS de `deboradenubila.adv.br`:

- `A @ 116.203.100.189`
- `A www 116.203.100.189` (ou CNAME para o domínio raiz)

Depois, adicionar no `/opt/nextep/edge/Caddyfile`:

```caddyfile
deboradenubila.adv.br, www.deboradenubila.adv.br {
    encode zstd gzip
    reverse_proxy nextep-debora-web:80
}
```

Recarregar o Caddy e validar o certificado HTTPS.
