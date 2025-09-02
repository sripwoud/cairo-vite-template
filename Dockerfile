FROM nginx:alpine AS base
WORKDIR /usr/share/nginx/html

FROM oven/bun:latest AS builder
WORKDIR /app
COPY . .
RUN apt-get update && apt-get install -y curl git && rm -rf /var/lib/apt/lists/*
RUN curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash
ENV PATH="/root/.nargo/bin:$PATH"
RUN /root/.nargo/bin/noirup
RUN bun i --frozen-lockfile
RUN mkdir -p web/public && \
    cd circuit && \
    nargo compile && \
    bun build.ts && \
    bun tsc -p tsconfig.build.json && \
    cp dist/worker.js \
       target/circuit.json \
       ../node_modules/@noir-lang/acvm_js/web/acvm_js_bg.wasm \
       ../node_modules/@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm \
       ../web/public/
RUN cd web && bun run vite build

FROM base AS runtime
RUN rm -fr ./*
COPY --from=builder /app/web/dist ./
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
