package com.springcourse.springecom.config;

import com.springcourse.springecom.filter.JwtFilter;
import com.springcourse.springecom.model.User;
import com.springcourse.springecom.repository.UserRepo;
import com.springcourse.springecom.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {


    @Autowired
    JwtFilter jwtFilter;
    @Autowired
    JwtService jwtService;
    @Autowired
    UserRepo repo;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtFilter jwtFilter){
        http.csrf(customizer-> customizer.disable());
        http.cors(Customizer.withDefaults());
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        http.sessionManagement(session->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        http.authorizeHttpRequests(auth-> auth.requestMatchers("/register", "/login").permitAll().anyRequest().authenticated());
        http.oauth2Login(Customizer.withDefaults());
        http.oauth2Login(oauth2->oauth2.successHandler((req,res,auth)->{

            OAuth2User oAuth2User = (OAuth2User) auth.getPrincipal();
            String username = oAuth2User.getAttribute("login");
                    if (username == null) username = oAuth2User.
                            getAttribute("email");
                    if (username == null) username = oAuth2User.
                            getAttribute("name");
                    if(repo.findByUsername(username)==null){
                        User user = new User();
                        user.setUsername(username);
                        user.setPassword("");
                        repo.save(user);
                    }
                    String token = jwtService.generateToken(username);
                    res.sendRedirect("http://localhost:5173/ products?token=" + token + "&username=" + username);}));

//        http.oauth2Login(oAuth2-> oAuth2.defaultSuccessUrl("http://localhost:5173/products",true));
        return http.build();
    }
    @Bean
    public BCryptPasswordEncoder encoder(){
        return  new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception{

        return config.getAuthenticationManager();
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173")); // your frontend URL
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }


}
