package customer.pos_admin_btp.synchronization;

import java.util.Date;

import org.springframework.stereotype.Component;

import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
public class Synchronization {
    @Id
    private Long id;
    private String name;
    private Long system;
    private Date createdAt;
    private Date updatedAt;
    private Integer status;
}
