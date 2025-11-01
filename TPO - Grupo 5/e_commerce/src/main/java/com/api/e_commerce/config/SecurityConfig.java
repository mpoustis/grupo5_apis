package com.api.e_commerce.config;

import com.api.e_commerce.repository.UsuarioRepository;
import com.api.e_commerce.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

import static org.springframework.security.config.Customizer.withDefaults;


// Indica que esta clase contiene configuraciones de Spring
@Configuration
// Habilita la seguridad web de Spring Security
@EnableWebSecurity
// Genera un constructor con los campos final requeridos lombok 
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UsuarioRepository usuarioRepository;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(username -> 
            usuarioRepository.findByEmail(username)
                .orElseThrow(() -> 
                    new UsernameNotFoundException("Usuario no encontrado: " + username))
        );
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(withDefaults())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                            "/v3/api-docs/**",
                            "/swagger-ui/**",
                            "/swagger-ui.html",
                            "/swagger-resources/**",
                            "/webjars/**"
                        ).permitAll()

                        // Endpoints públicos (login y registro)
                        .requestMatchers("/api/auth/**").permitAll()

                        // Rutas públicas que no requieren autenticación
                        .requestMatchers("/api/usuarios/**").authenticated()
                        .requestMatchers(HttpMethod.GET,"/api/productos/mis-productos").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/productos/**").permitAll()
                        
                        // Rutas que requieren autenticación para modificar productos
                        .requestMatchers(HttpMethod.POST, "/api/productos/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/productos/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/productos/**").authenticated()

                        .requestMatchers(HttpMethod.GET, "/api/categorias/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/categorias/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/categorias/**").authenticated()
                        .requestMatchers("/api/categorias/**").authenticated()


                        // Rutas de órdenes protegidas por JWT
                        .requestMatchers("/api/orders/**").authenticated()

                        // Rutas exclusivas para administradores
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // Cualquier otra ruta requiere autenticación
                        .anyRequest().authenticated());

        return http.build();
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:5173") // URL del frontend
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
