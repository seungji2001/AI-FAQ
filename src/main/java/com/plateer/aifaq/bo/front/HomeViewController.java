package com.plateer.aifaq.bo.front;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/bo")
public class HomeViewController {

    /**
     * BO 홈 화면
     */
    @GetMapping({"", "/", "/home"})
    public String home() {
        return "bo/home";
    }
}