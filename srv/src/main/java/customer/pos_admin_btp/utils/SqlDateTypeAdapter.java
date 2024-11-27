package customer.pos_admin_btp.utils;

import com.google.gson.TypeAdapter;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonToken;
import com.google.gson.stream.JsonWriter;

import java.io.IOException;
import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;

public class SqlDateTypeAdapter extends TypeAdapter<Date> {
    private final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

    @Override
    public void write(JsonWriter out, Date date) throws IOException {
        if (date == null) {
            out.nullValue();
            return;
        }
        String formattedDate = dateFormat.format(date);
        out.value(formattedDate);
    }

    @Override
    public Date read(JsonReader in) throws IOException {
        if (in.peek() == JsonToken.NULL) {
            in.nextNull();
            return null;
        }
        String dateStr = in.nextString();
        try {
            return new Date(dateFormat.parse(dateStr).getTime());
        } catch (ParseException e) {
            throw new IOException(e);
        }
    }
}