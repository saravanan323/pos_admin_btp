package customer.pos_admin_btp.configuration;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import customer.pos_admin_btp.errors.ApiError;
import customer.pos_admin_btp.utils.AppConstants;
import customer.pos_admin_btp.utils.AppUtils;

@RestController
@RequestMapping("/configuration")
public class ConfigurationController {

    @Autowired
    ConfigurationService configurationService;

    @PostMapping("/check")
    public ResponseEntity<?> getCheck(@RequestBody Map<String, Object> requestBody) throws Exception {
        try {
            String url = AppConstants.base_url + requestBody.get("url") + "?$format=json&$top=1";
            return new ResponseEntity<>(configurationService.getCheckAuthenticationService(url), HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<ApiError>(AppUtils.getErrorDetails(ex), HttpStatus.BAD_REQUEST);
        }
    }
}
