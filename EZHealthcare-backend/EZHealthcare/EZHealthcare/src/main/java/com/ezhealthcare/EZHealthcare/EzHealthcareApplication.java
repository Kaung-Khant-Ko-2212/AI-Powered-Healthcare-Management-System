package com.ezhealthcare.EZHealthcare;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class EzHealthcareApplication {
	public static void main(String[] args) {
		SpringApplication.run(EzHealthcareApplication.class, args);
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**") // Or specify specific endpoints
						.allowedOrigins("http://localhost:3000") // Your React app's URL
						.allowedMethods("GET", "POST", "PUT", "DELETE") // Allowed HTTP methods
						.allowedHeaders("*"); // Allow all headers (or specify)
			}
		};
	}
}
