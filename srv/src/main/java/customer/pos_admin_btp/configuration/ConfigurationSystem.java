package customer.pos_admin_btp.configuration;

import org.springframework.stereotype.Component;

import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
public class ConfigurationSystem {
    @Id
    private Long id;
    private String name;
    private String macAddress;
    private Long company;
    private Long salesOffice;
    private Integer status;
}
