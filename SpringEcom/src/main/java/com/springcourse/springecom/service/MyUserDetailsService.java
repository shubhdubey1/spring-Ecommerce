package com.springcourse.springecom.service;

import com.springcourse.springecom.model.User;
import com.springcourse.springecom.model.UserPrincipal;
import com.springcourse.springecom.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepo repo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user = repo.findByUsername(username);
        if(user==null){
            System.out.println("404 NF");
           throw new UsernameNotFoundException("404 NF");
        }

        return new UserPrincipal(user);
    }
}
