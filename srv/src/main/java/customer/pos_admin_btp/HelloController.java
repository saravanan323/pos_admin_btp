package customer.pos_admin_btp;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/")
public class HelloController {

    @GetMapping(" ")
    public String getAllEmployees() {
        return "Welcome SpringBoot!!";
    }
}
