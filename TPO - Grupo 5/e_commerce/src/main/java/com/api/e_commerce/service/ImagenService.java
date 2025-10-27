package com.api.e_commerce.service;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Service
public class ImagenService {

    private final String uploadDir = "uploads/"; // puedes ajustar la ruta

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(Paths.get(uploadDir));
        } catch (IOException e) {
            throw new RuntimeException("No se pudo crear el directorio de uploads", e);
        }
    }

    public String guardarImagen(String base64Image, Long productId) throws IOException {
        if (base64Image == null || base64Image.isEmpty()) {
            throw new IllegalArgumentException("La imagen base64 está vacía");
        }

        // Eliminar el prefijo "data:image/jpeg;base64," si existe
        String[] parts = base64Image.split(",");
        String imageString = parts.length > 1 ? parts[1] : parts[0];

        // Decodificar el base64
        byte[] imageBytes = Base64.getDecoder().decode(imageString);

        // Cree nombre de archivo unico que es esta vinculado con el id del producto al que pertenece esa imagen
        String nombreArchivo = productId + "_" + UUID.randomUUID() + ".jpg";

        // Guardar el archivo
        Path path = Paths.get(uploadDir + nombreArchivo);
        Files.write(path, imageBytes);

        // Retornar la ruta pública (lo que guardamos en la base de datos)
        return "/uploads/" + nombreArchivo;
    }

    public List<String> guardarImagenes(List<String> base64Images, Long productoId) {
        List<String> urls = new ArrayList<>();
        for (String base64 : base64Images) {
            try {
                String url = guardarImagen(base64, productoId);
                urls.add(url);
            } catch (IOException e) {
                throw new RuntimeException("Error al guardar imagen", e);
            }
        }
        return urls;
    }

    public void eliminarImagen(String url) {
        try {
            Path path = Paths.get(url.replace("/uploads/", "uploads/"));
            Files.deleteIfExists(path);
        } catch (IOException e) {
            System.err.println("Error al eliminar imagen: " + url);
        }
    }
}
