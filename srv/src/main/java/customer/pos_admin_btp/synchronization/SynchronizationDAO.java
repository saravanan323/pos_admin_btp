package customer.pos_admin_btp.synchronization;

import java.util.Base64;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import customer.pos_admin_btp.utils.AppConstants;

@Component
public class SynchronizationDAO {

    public String getCheckAuthentication(String url) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            // Create headers with basic authentication
            HttpHeaders headers = new HttpHeaders();
            String auth = AppConstants.user + ":" + AppConstants.password; // Use your actual credentials
            String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());
            headers.set("Authorization", "Basic " + encodedAuth);

            // Create an HttpEntity with headers
            HttpEntity<String> entity = new HttpEntity<>(headers);

            // Send the GET request
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            
            // Return the response body
            return response.getStatusCode().toString();
        } catch (Exception e) {
            // Handle exception
            throw e; // Optionally log or handle specific exceptions
        }
    }

}
