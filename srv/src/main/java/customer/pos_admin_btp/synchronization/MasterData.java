package customer.pos_admin_btp.synchronization;

import org.springframework.stereotype.Component;

import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Component
@Getter
@Setter
public class MasterData {
    @Id
    private Long id;
    private Long master;
    private String url;
    private Integer syncType;
    private Integer status;
}
