package com.augusto.login_system.common;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/api/hello")
    public Map<String, String> home() {
        return Map.of("hello", "Hola Mundo");
    }
}