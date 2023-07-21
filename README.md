# Mini Store API

Mini Store es una implementación básica de una API desarrollada en Express utilizando Postgres 12 como base de datos. Esta API proporciona endpoints para gestionar productos, usuarios, carritos de compras y órdenes.

## Instalación
- Clona el repositorio desde GitHub:

``git clone https://github.com/kurai021/mini-store.git``
- Instala las dependencias:

```bash
cd mini-store
npm install
```

- Configura las variables de entorno en el archivo .env. Asegúrate de reemplazar los valores por los adecuados:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mydb
DB_USER=postgres
DB_PASSWORD=mysecretpassword
JWT_SECRET=mysecretkey
```

**Nota**: Si utilizas Docker, cambia DB_HOST a db en el archivo .env en lugar de localhost.

## Ejecución
Para ejecutar la API en modo desarrollo, usa el siguiente comando:

```bash
npm run dev
```

La API estará disponible en http://localhost:3000/api.

## Documentación

La documentación de la API está generada con Swagger y se puede acceder en http://localhost:3000/api/api-docs, Swagger es extremadamente util pues puedes aprender a usar esta API desde la interfaz web sin utilizar CURL o Postman.

## Pruebas

Para ejecutar las pruebas unitarias con Jest, usa el siguiente comando:

```bash
npm test
```

## Docker
Si prefieres utilizar Docker, sigue estos pasos:

Construye los contenedores:
```bash
docker-compose build
```

Levanta los contenedores:
```bash
docker-compose up
```

Para detener los contenedores:
```bash
docker-compose down
```

**Nota**: El contenedor de la base de datos puede guardar el contenido de pgdata si creas una carpeta llamada pgdata en la raiz.

## Contacto
Si tienes preguntas o comentarios sobre el proyecto, no dudes en contactarme:

### GitHub: @kurai021
### Correo electrónico: alexanderarmuelles@riseup.net

¡Gracias por utilizar Mini Store API! Espero que sea útil para tus proyectos y desarrollo. Si tienes alguna otra pregunta o necesitas más asistencia, ¡estaré encantado de ayudarte!