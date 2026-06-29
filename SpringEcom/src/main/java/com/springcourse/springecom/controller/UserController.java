package com.springcourse.springecom.controller;

import com.springcourse.springecom.model.User;
import com.springcourse.springecom.service.JwtService;
import com.springcourse.springecom.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @Autowired
    UserService service;

    @Autowired
    JwtService jwtService;

    @Autowired
    private AuthenticationManager AuthenticationManager;


    @PostMapping("register")
    public ResponseEntity<?> saveUser(@RequestBody User user){
        User user1 =  service.getUser(user);
        if(user1==null){
            service.saveUser(user);
            return new ResponseEntity<>("redirect:/login", HttpStatus.OK);
        }
        else {

            return new ResponseEntity<>("redirect:/login", HttpStatus.CONFLICT);
        }

    }

    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody User user) {

        User user1 = service.getUser(user);
        if (user1 == null) {
            return new ResponseEntity<>("redirect:/register", HttpStatus.UNAUTHORIZED);
        }
        Authentication authentication = null;
        try {
            authentication = AuthenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        } catch (BadCredentialsException e) {
            return new ResponseEntity<>("failed", HttpStatus.UNAUTHORIZED);
        }

        if (authentication.isAuthenticated()) {
            return new ResponseEntity<>(jwtService.generateToken(user.getUsername()), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("failed", HttpStatus.UNAUTHORIZED);
        }


    }

    @PostMapping("logout")
    public ResponseEntity<?> logOut(){

        SecurityContextHolder.clearContext();
        return new ResponseEntity<>("redirect:/login", HttpStatus.OK);
    }


}
