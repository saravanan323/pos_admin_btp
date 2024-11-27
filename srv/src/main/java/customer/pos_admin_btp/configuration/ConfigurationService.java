package customer.pos_admin_btp.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ConfigurationService {
    @Autowired
    ConfigurationDAO configurationDAO;

    public String getCheckAuthenticationService(String url) {
        try {
            return configurationDAO.getCheckAuthentication(url);
        } catch (Exception e) {
            throw e;
        }
    }
}
