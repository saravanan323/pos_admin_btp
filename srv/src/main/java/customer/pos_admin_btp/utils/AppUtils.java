package customer.pos_admin_btp.utils;

import java.util.Date;
import java.nio.charset.StandardCharsets;
import java.text.DateFormat;
import java.text.SimpleDateFormat;

import org.apache.commons.codec.binary.Base64;
import org.springframework.http.HttpStatus;

import customer.pos_admin_btp.errors.ApiError;
import customer.pos_admin_btp.errors.BusinessException;

public final class AppUtils {

    public static String getBasicAuth(String user, String password) {
        final String auth = Base64
                .encodeBase64String(String.format("%s:%s", user, password).getBytes(StandardCharsets.UTF_8));
        return auth;
    }

    public static ApiError getBEErrorDetails(BusinessException ex) {
        return new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, ex.getErrorDescription(), ex.getErrorDescription(),
                ex.getErrorCode());

    }

    public static ApiError getErrorDetails(Exception ex) {
        return new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage(), ex.getMessage(), null);

    }

    /* Convert timestamp to iso string date */
    public static String getISOFormat(Date dateString) {
        if(dateString !=null){
            DateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.S'Z'");
            String my8601formattedDate = df.format(dateString);
            return my8601formattedDate;
        }
        return null;
    }
}
