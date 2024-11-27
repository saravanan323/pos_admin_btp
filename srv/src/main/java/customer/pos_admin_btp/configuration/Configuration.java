package customer.pos_admin_btp.configuration;

import java.util.Date;

import org.springframework.stereotype.Component;

import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
public class Configuration {
    @Id
    private Long id;
    private String name;
    private Long type;
    private String endpoint;
    private String username;
    private String password;
    private Long systemType;

    private Date createdAt;
    private Date updatedAt;
    private Integer status;
}
