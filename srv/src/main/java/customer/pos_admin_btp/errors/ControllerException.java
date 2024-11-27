package customer.pos_admin_btp.errors;

import org.springframework.stereotype.Component;

@Component
public class ControllerException extends RuntimeException {
    public String errorCode;
    public String errorDescription;

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public String getErrorDescription() {
        return errorDescription;
    }

    public void setErrorDescription(String errorDescription) {
        this.errorDescription = errorDescription;
    }

}
