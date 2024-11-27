package customer.pos_admin_btp.errors;

import org.springframework.core.annotation.Order;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler {

   // other exception handlers

   @ExceptionHandler(Exception.class)
   protected ResponseEntity<Object> handEntity(
         Exception ex) {
      /**/
      return null;
   }
}
