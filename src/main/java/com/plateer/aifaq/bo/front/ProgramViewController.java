package com.plateer.aifaq.bo.front;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/bo/program")
public class ProgramViewController {

    @GetMapping("/list")
    public String programListPage() {
        return "bo/program/list";
    }

    @GetMapping("/broadcast")
    public String broadcastPage() {
        return "bo/program/broadcast";
    }
}