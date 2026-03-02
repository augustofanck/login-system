package com.augusto.login_system.common;

import org.springframework.web.bind.annotation.*;

@RestController
public class HomeController {
    @GetMapping("/home")
    public String home() { return "Hola Mundo"; }
}