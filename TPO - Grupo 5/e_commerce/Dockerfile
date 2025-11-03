FROM eclipse-temurin:17-jdk-alpine AS build


WORKDIR /app

# Copia los archivos de configuración y el código fuente
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN ./mvnw dependency:go-offline

# Copia el código fuente restante
COPY src src

# Empaqueta la aplicación Spring Boot
RUN ./mvnw package -DskipTests

# ETAPA 2: Crear la imagen final (usando un Java Runtime Environment (JRE) 17 más ligero)
FROM eclipse-temurin:17-jre-alpine

# Expone el puerto por defecto de Spring Boot (8080)
EXPOSE 8080

# Copia el archivo JAR generado desde la etapa de construcción
ARG JAR_FILE=/app/target/*.jar
COPY --from=build ${JAR_FILE} app.jar

# Define el comando para ejecutar la aplicación
ENTRYPOINT ["java","-jar","/app.jar"]