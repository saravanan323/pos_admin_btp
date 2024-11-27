package customer.pos_admin_btp.synchronization;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class SynchronizationService {
    @Autowired
    SynchronizationDAO synchronizationDAO;

    public String getCheckAuthenticationService(String url) {
        try {
            return synchronizationDAO.getCheckAuthentication(url);
        } catch (Exception e) {
            throw e;
        }
    }
}
