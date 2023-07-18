# Base image
FROM node:18-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /src

# Copia los archivos del proyecto al directorio de trabajo del contenedor
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el código fuente al directorio de trabajo del contenedor
COPY . .

# Puerto expuesto por la aplicación
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npx", "nodemon", "--require", "dotenv/config", "src/app.js", "--watch", "src"]