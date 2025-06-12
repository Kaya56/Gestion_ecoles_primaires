package com.school.management.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.List;

/**
 * Configuration CORS pour l'application de gestion scolaire
 * Permet aux applications frontend de communiquer avec l'API backend
 */

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Utilise uniquement allowedOriginPatterns, pas allowedOrigins
        configuration.setAllowedOriginPatterns(Arrays.asList(
                "http://localhost:*",
                "https://*.school-management.com",
                "https://school-management-*.vercel.app"
        ));

        configuration.setAllowedMethods(Arrays.asList("GET","POST","PUT","DELETE","PATCH","OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}

//@Configuration
//public class CorsConfig implements WebMvcConfigurer {
//
//    /**
//     * Configuration CORS globale pour tous les endpoints
//     */
//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/api/**")
//                .allowedOrigins(
//                        "http://localhost:3000",     // React dev server
//                        "http://localhost:4200",     // Angular dev server
//                        "http://localhost:8080",     // Vue.js dev server
//                        "http://localhost:5173",     // Vite dev server
//                        "https://school-management-frontend.com" // Production frontend
//                )
//                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
//                .allowedHeaders("*")
//                .allowCredentials(true)
//                .maxAge(3600); // Cache preflight requests for 1 hour
//    }
//
//    /**
//     * Configuration CORS alternative via CorsConfigurationSource
//     * Utile pour une configuration plus fine ou pour Spring Security
//     */
//    @Bean
//    public CorsConfigurationSource corsConfigurationSource() {
//        CorsConfiguration configuration = new CorsConfiguration();
//
//        // Origines autorisées
//        configuration.setAllowedOriginPatterns(Arrays.asList(
//                "http://localhost:*",
//                "https://*.school-management.com",
//                "https://school-management-*.vercel.app"
//        ));
//
//        // Méthodes HTTP autorisées
//        configuration.setAllowedMethods(Arrays.asList(
//                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"
//        ));
//
//        // Headers autorisés
//        configuration.setAllowedHeaders(Arrays.asList(
//                "Authorization",
//                "Content-Type",
//                "X-Requested-With",
//                "Accept",
//                "Origin",
//                "Access-Control-Request-Method",
//                "Access-Control-Request-Headers"
//        ));
//
//        // Headers exposés au client
//        configuration.setExposedHeaders(Arrays.asList(
//                "Access-Control-Allow-Origin",
//                "Access-Control-Allow-Credentials",
//                "Authorization",
//                "Content-Disposition"
//        ));
//
//        // Autoriser les cookies/credentials
//        configuration.setAllowCredentials(true);
//
//        // Durée de cache pour les requêtes preflight
//        configuration.setMaxAge(3600L);
//
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/api/**", configuration);
//
//        return source;
//    }
//
//    /**
//     * Configuration CORS spécifique pour les endpoints d'authentification
//     */
//    @Bean("authCorsConfigurationSource")
//    public CorsConfigurationSource authCorsConfigurationSource() {
//        CorsConfiguration configuration = new CorsConfiguration();
//
//        configuration.setAllowedOriginPatterns(List.of(
//                "http://localhost:3000",
//                "http://localhost:5173",
//                "https://school-management-frontend.com"
//        ));
//        configuration.setAllowedMethods(Arrays.asList("POST", "OPTIONS"));
//        configuration.setAllowedHeaders(List.of("*"));
//        configuration.setAllowCredentials(true);
//        configuration.setMaxAge(3600L);
//
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/api/auth/**", configuration);
//
//        return source;
//    }
//
//
//    /**
//     * Configuration CORS pour les endpoints de upload de fichiers
//     */
//    @Bean("fileCorsConfigurationSource")
//    public CorsConfigurationSource fileCorsConfigurationSource() {
//        CorsConfiguration configuration = new CorsConfiguration();
//
//        configuration.setAllowedOriginPatterns(List.of(
//                "http://localhost:*",
//                "https://school-management-frontend.com"
//        ));
//
//
//        configuration.setAllowedMethods(Arrays.asList("POST", "PUT", "OPTIONS"));
//        configuration.setAllowedHeaders(Arrays.asList(
//                "Content-Type",
//                "Authorization",
//                "X-Requested-With"
//        ));
//
//        configuration.setAllowCredentials(true);
//
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/api/documents/upload/**", configuration);
//
//        return source;
//    }
//}