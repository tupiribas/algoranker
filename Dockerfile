# Estágio 1: Construir (Build) o App
# Usamos 'AS build' para nomear este estágio
FROM node:20-alpine AS build

WORKDIR /app

# Copia os arquivos de dependência e instala (usando yarn, como você fez)
COPY package.json yarn.lock* ./
RUN yarn install

# Copia o resto do código-fonte
COPY . .

# Roda o script de build do package.json
RUN yarn build

# Estágio 2: Rodar (Run) o App
# Usamos uma imagem limpa para produção
FROM node:20-alpine

WORKDIR /app

# Instala SOMENTE as dependências necessárias para rodar
# (incluindo 'vite', que é necessário para o 'yarn preview')
COPY package.json yarn.lock* ./
RUN yarn install

# Copia os arquivos construídos (da pasta 'dist') do estágio 'build'
COPY --from=build /app/dist ./dist

# ADICIONE ESTA LINHA:
# Copia o arquivo de configuração para o Vite 'preview' ler
COPY vite.config.ts ./

# Expõe a porta que configuramos no script 'preview'
EXPOSE 3000

# Comando para iniciar o app
CMD ["yarn", "preview"]