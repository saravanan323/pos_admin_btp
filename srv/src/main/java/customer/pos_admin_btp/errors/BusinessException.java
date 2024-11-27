package customer.pos_admin_btp.errors;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BusinessException extends RuntimeException {
    public String errorCode;
    public String errorDescription;
    public HttpStatus status;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss")
    public LocalDateTime timestamp;

    public BusinessException(String errorCode, String errorDescription, HttpStatus status) {
        this.errorCode = errorCode;
        this.errorDescription = errorDescription;
        this.status = status;
    }
}