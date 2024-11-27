package customer.pos_admin_btp.utils.olingo;

import java.io.InputStream;
import java.net.URI;
import java.util.Date;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.StringJoiner;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.reflect.Field;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.apache.olingo.client.api.ODataClient;
import org.apache.olingo.client.api.communication.ODataClientErrorException;
import org.apache.olingo.client.api.communication.request.cud.ODataEntityCreateRequest;
import org.apache.olingo.client.api.communication.request.cud.ODataEntityUpdateRequest;
import org.apache.olingo.client.api.communication.request.cud.UpdateType;
import org.apache.olingo.client.api.communication.request.retrieve.ODataRawRequest;
import org.apache.olingo.client.api.communication.response.ODataResponse;
import org.apache.olingo.client.api.domain.ClientEntity;
import org.apache.olingo.client.api.domain.ClientPrimitiveValue;
import org.apache.olingo.client.api.uri.QueryOption;
import org.apache.olingo.client.api.uri.URIBuilder;
import org.apache.olingo.client.core.ODataClientFactory;
import org.apache.olingo.commons.api.edm.FullQualifiedName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;

import customer.pos_admin_btp.utils.AppConstants;

@Component
public class ODataServiceUtils {

    @Autowired
    HttpSession session;

    @Autowired
    HttpServletRequest req;

    ODataClient client = ODataClientFactory.getClient();
    public static Map<String, Object> convertedObj = new HashMap<>();

    // Get data without filters //String cookie,
    public Map<String, Object> getOData(URI serviceUri) throws Exception {
        // if (!serviceUrl.isEmpty()) {
        try {
            // Create the request
            ODataRawRequest request = client.getRetrieveRequestFactory().getRawRequest(serviceUri);

            // String cookie = (String) session.getAttribute("sessionCookie");// Login
            // session cookie

            request.addCustomHeader("Accept", "*/*");
            request.addCustomHeader("Cookie", setSession(AppConstants.login, null));// request.addCustomHeader("Cookie",
                                                                                    // cookie);

            // Execute the request
            ODataResponse response = request.execute();
            InputStream inStream = response.getRawResponse();
            ObjectMapper mapper = new ObjectMapper();

            @SuppressWarnings("unchecked")
            Map<String, Object> jsonMap = mapper.readValue(inStream, Map.class);

            return jsonMap;

        } catch (Exception e) {
            throw e;
        }

        // }
    }

    public Map<String, Object> getODataById(String serviceUrl) throws Exception {
        if (!serviceUrl.isEmpty()) {
            try {

                URI entitySetURI = client.newURIBuilder(serviceUrl).build();
                // Create the request
                ODataRawRequest request = client.getRetrieveRequestFactory().getRawRequest(entitySetURI);

                // String cookie = (String) session.getAttribute("sessionCookie");// Login
                // session cookie

                request.addCustomHeader("Accept", "*/*");
                request.addCustomHeader("Cookie", setSession(AppConstants.login, null));

                // Execute the request
                ODataResponse response = request.execute();
                InputStream inStream = response.getRawResponse();
                ObjectMapper mapper = new ObjectMapper();

                @SuppressWarnings("unchecked")
                Map<String, Object> jsonMap = mapper.readValue(inStream, Map.class);

                return jsonMap;

            } catch (Exception e) {
                throw e;
            }

        }
        return null;
    }

    // Post Data
    public Map<String, Object> postOData(String serviceUrl, ClientEntity ce) throws Exception {
        if (!serviceUrl.isEmpty()) {
            try {

                URI entitySetURI = client.newURIBuilder(serviceUrl).build();

                // Create the request
                ODataEntityCreateRequest<ClientEntity> request = client.getCUDRequestFactory()
                        .getEntityCreateRequest(entitySetURI, ce);

                // String cookie = (String) session.getAttribute("sessionCookie");

                request.addCustomHeader("Accept", "*/*");
                request.addCustomHeader("Cookie", setSession(AppConstants.login, null));

                // Execute the request
                ODataResponse response = request.execute();
                InputStream inStream = response.getRawResponse();
                ObjectMapper mapper = new ObjectMapper();

                @SuppressWarnings("unchecked")
                Map<String, Object> jsonMap = mapper.readValue(inStream, Map.class);

                return jsonMap;

            } catch (Exception e) {
                throw e;
            }

        }
        return null;
    }

    // Patch data
    public String patchOData(String serviceUrl, ClientEntity ce) throws Exception {
        if (!serviceUrl.isEmpty()) {
            try {

                URI entitySetURI = client.newURIBuilder(serviceUrl).build();

                // Create the request
                ODataEntityUpdateRequest<ClientEntity> request = client.getCUDRequestFactory()
                        .getEntityUpdateRequest(entitySetURI, UpdateType.PATCH, ce);

                // String cookie = (String) session.getAttribute("sessionCookie");

                request.addCustomHeader("Accept", "*/*");
                request.addCustomHeader("Cookie", setSession(AppConstants.login, null));

                // Execute the request
                ODataResponse response = request.execute();

                return response.getStatusCode() + "-" + response.getStatusMessage();

            } catch (ODataClientErrorException ex) {
                System.out.println("Error: " + ex.getMessage());
                throw ex;
            } catch (Exception e) {
                e.printStackTrace();
                throw e;
            }

        }
        return null;
    }

    // Patch data
    public String batchODataFetch(String serviceUrl, ClientEntity ce) throws Exception {
        if (!serviceUrl.isEmpty()) {
            try {

                // client.getConfiguration().setDefaultPubFormat(ContentType.APPLICATION_JSON);
                URI entitySetURI = client.newURIBuilder(serviceUrl).build();

                // Create the request
                ODataEntityCreateRequest<ClientEntity> request = client.getCUDRequestFactory()
                        .getEntityCreateRequest(entitySetURI, ce);

                // String cookie = (String) session.getAttribute("sessionCookie");

                request.addCustomHeader("Accept", "*/*");
                request.addCustomHeader("Cookie", setSession(AppConstants.login, null));

                // Execute the request
                ODataResponse response = request.execute();

                return response.getStatusCode() + "-" + response.getStatusMessage();

            } catch (ODataClientErrorException ex) {
                System.out.println("Error: " + ex.getMessage());
                throw ex;
            } catch (Exception e) {
                e.printStackTrace();
                throw e;
            }

        }
        return null;
    }

    // Set session for after login
    public String setSession(String serviceUrl, ClientEntity ce) throws Exception {

        if (!serviceUrl.isEmpty()) {
            try {

                URI entitySetURI = client.newURIBuilder(serviceUrl).build();

                // Create the request
                ODataEntityCreateRequest<ClientEntity> request = client.getCUDRequestFactory()
                        .getEntityCreateRequest(entitySetURI, loginCE());

                request.addCustomHeader("Accept", "*/*");
                request.addCustomHeader("X-CSRF-Token", "fetch");

                // Execute the request
                ODataResponse response = request.execute();

                List<String> cookies = new ArrayList<>(response.getHeader("Set-Cookie"));

                @SuppressWarnings({ "rawtypes" })
                Optional filterSessionCookie = cookies.stream().filter(e -> ((String) e).contains("B1SESSION"))
                        .findFirst();

                String sessionCookie = (String) filterSessionCookie.get();

                return sessionCookie;

            } catch (ODataClientErrorException ex) {
                System.out.println("Error: " + ex.getMessage());
                throw ex;
            } catch (Exception e) {
                e.printStackTrace();
                throw e;
            }

        }
        return null;
    }

    public ClientEntity loginCE() {

        ClientEntity clientEntity = client.getObjectFactory()
                .newEntity(new FullQualifiedName("customer.pos_admin_btp.login.Login"));

        // Set properties of the entity
        clientEntity.getProperties().add(client.getObjectFactory().newPrimitiveProperty("CompanyDB",
                client.getObjectFactory().newPrimitiveValueBuilder().buildString("C21315_BHACKER_T01")));
        clientEntity.getProperties().add(client.getObjectFactory().newPrimitiveProperty("UserName",
                client.getObjectFactory().newPrimitiveValueBuilder().buildString("manager")));
        clientEntity.getProperties().add(client.getObjectFactory().newPrimitiveProperty("Password",
                client.getObjectFactory().newPrimitiveValueBuilder().buildString("Sap@2023")));

        return clientEntity;
    }

    public ClientEntity clientEntityConversionHelper(String enitityName, Object object) {

        ClientEntity clientEntity = client.getObjectFactory().newEntity(new FullQualifiedName(enitityName));

        JsonObject jsonObject = new Gson().toJsonTree(object).getAsJsonObject();

        for (Map.Entry<String, JsonElement> entry : jsonObject.entrySet()) {

            String name = entry.getKey(); // Get the name of the element

            entry.getValue().getClass().getName();
            JsonElement value = entry.getValue(); // Get the value of the element

            // Handle different types of values
            ClientPrimitiveValue clientValue = null;
            if (value.isJsonPrimitive()) {
                JsonPrimitive primitive = value.getAsJsonPrimitive();
                if (primitive.isString()) {
                    clientValue = client.getObjectFactory().newPrimitiveValueBuilder()
                            .buildString(primitive.getAsString());
                } else if (primitive.isBoolean()) {
                    clientValue = client.getObjectFactory().newPrimitiveValueBuilder()
                            .buildBoolean(primitive.getAsBoolean());
                } else if (primitive.isNumber()) {
                    clientValue = client.getObjectFactory().newPrimitiveValueBuilder().buildInt32(primitive.getAsInt());
                }
            }

            clientEntity.getProperties().add(client.getObjectFactory().newPrimitiveProperty(name, clientValue));

            System.out.println("Name: " + name + ", Value: " + value);
        }
        return clientEntity;
    }

    @SuppressWarnings("rawtypes")
    public URI buildUri(String serviceUrl, Map<String, Object> filterParams, Class className, String operatorSign)
            throws NoSuchFieldException, SecurityException {
        URIBuilder entitySetURI = client.newURIBuilder(serviceUrl);
        URI uri;

        entitySetURI.addQueryOption(QueryOption.COUNT, "allpages");
        String fQuery = "";
        for (Map.Entry<String, Object> obj : filterParams.entrySet()) {
            System.out.println(obj.getKey() + obj.getValue());
            String Query = "";

            if (obj.getValue() != null) {
                switch (obj.getKey().toLowerCase()) {
                    case "top":
                        entitySetURI.addQueryOption(QueryOption.TOP, obj.getValue().toString());
                        break;
                    case "skip":
                        entitySetURI.addQueryOption(QueryOption.SKIP, obj.getValue().toString());
                        break;
                    case "orderby":
                        entitySetURI.addQueryOption(QueryOption.ORDERBY, obj.getValue().toString());
                        break;
                    case "select":
                        entitySetURI.addQueryOption(QueryOption.SELECT, obj.getValue().toString());
                        break;
                    default:
                        Set<String> invalidKeys = Set.of("top", "skip", "orderBy", "OrderBy", "count", "select");
                        if (!invalidKeys.contains(obj.getKey())) {
                            String valueType = obj.getValue().getClass().getName();
                            String fKey = StringUtils.capitalize(obj.getKey());
                            if (valueType.contains("String")) {
                                if (obj.getKey().toString().contains("Collection")) {
                                    fKey = fKey.replace("Collection", "");
                                    // Create Field object
                                    String firstLetter = fKey.substring(0, 1);
                                    String camelCaseKey = fKey.replaceFirst(firstLetter, firstLetter.toLowerCase());
                                    Field privateField = className.getDeclaredField(camelCaseKey); //

                                    // Set the accessibility as true
                                    privateField.setAccessible(true);
                                    Class<?> tp = privateField.getType();// gets the data type
                                    String[] splittedValue = obj.getValue().toString().split(",");
                                    int index = 0;
                                    if (tp.getName().contains("String")) {
                                        if (!operatorSign.isEmpty() && operatorSign.equals("equal")) {
                                            for (String ele : splittedValue) {

                                                if (fQuery == "") {
                                                    Query = index == 0 ? "and ((" + fKey + " eq '" + ele + "')"
                                                            : index == splittedValue.length - 1
                                                                    ? " or (" + fKey + " eq '" + ele + "'))"
                                                                    : " or (" + fKey + " eq '" + ele + "')";
                                                    if (splittedValue.length == 1)
                                                        Query = "and (" + fKey + " eq '" + ele + "')";
                                                } else {
                                                    if (splittedValue.length == 1) {
                                                        Query = "and ((" + fKey + " eq '" + ele + "'))";
                                                    } else {
                                                        Query = index == 0 ? "and ((" + fKey + " eq '" + ele + "')"
                                                                : index == splittedValue.length - 1
                                                                        ? " or (" + fKey + " eq '" + ele + "'))"
                                                                        : " or (" + fKey + " eq '" + ele + "')";
                                                    }
                                                }

                                                entitySetURI.addQueryOption(QueryOption.FILTER, Query);
                                                index++;
                                            }
                                        } else {
                                            for (String ele : splittedValue) {

                                                if (fQuery == "") {
                                                    Query = index == 0
                                                            ? "and (contains (" + fKey + ",'" + ele + "')"
                                                            : index == splittedValue.length - 1
                                                                    ? " or contains (" + fKey + ",'" + ele + "'))"
                                                                    : " or contains (" + fKey + ",'" + ele + "')";
                                                    if (splittedValue.length == 1)
                                                        Query = "and contains (" + fKey + ",'" + ele + "')";
                                                } else {
                                                    if (splittedValue.length == 1) {
                                                        Query = "and (contains (" + fKey + ",'" + ele + "'))";
                                                    } else {
                                                        Query = index == 0
                                                                ? "and (contains (" + fKey + ",'" + ele + "')"
                                                                : index == splittedValue.length - 1
                                                                        ? " or contains (" + fKey + ",'" + ele
                                                                                + "'))"
                                                                        : " or contains (" + fKey + ",'" + ele
                                                                                + "')";
                                                    }
                                                }
                                            }
                                            entitySetURI.addQueryOption(QueryOption.FILTER, Query);
                                            index++;
                                        }

                                    } else if (tp.getName().contains("Integer")) {
                                        for (String ele : splittedValue) {

                                            if (fQuery == "") {
                                                Query = index == 0 ? "and (" + fKey + " eq " + ele
                                                        : index == splittedValue.length - 1
                                                                ? " or " + fKey + " eq " + ele + ")"
                                                                : " or " + fKey + " eq " + ele;
                                                if (splittedValue.length == 1)
                                                    Query = "and " + fKey + " eq " + ele;
                                            } else {
                                                Query = index == 0 ? "and (" + fKey + " eq " + ele
                                                        : index == splittedValue.length - 1
                                                                ? " or " + fKey + " eq " + ele + ")"
                                                                : " or " + fKey + " eq " + ele;
                                            }

                                            entitySetURI.addQueryOption(QueryOption.FILTER, Query);
                                            index++;
                                        }
                                    } else if (tp.getName().contains("Date")) {
                                        fQuery = fQuery == ""
                                                ? fKey + " ge " + splittedValue[0] + " and " + fKey + " le "
                                                        + splittedValue[1]
                                                : " and " + fKey + " ge " + splittedValue[0] + " and " + fKey + " le "
                                                        + splittedValue[1];
                                        entitySetURI.addQueryOption(QueryOption.FILTER, fQuery);
                                    }

                                } else {
                                    if (!operatorSign.isEmpty() && operatorSign.equals("equal")) {
                                        fQuery = fQuery == "" ? "(" + fKey + " eq '" + obj.getValue() + "')"
                                                : "and (" + fKey + " eq '" + obj.getValue() + "')";
                                        entitySetURI.addQueryOption(QueryOption.FILTER, fQuery);
                                    } else {
                                        fQuery = fQuery == "" ? "contains (" + fKey + ",'" + obj.getValue() + "')"
                                                : "and contains (" + fKey + ",'" + obj.getValue() + "')";
                                        entitySetURI.addQueryOption(QueryOption.FILTER, fQuery);
                                    }
                                }
                            } else {
                                fQuery = fQuery == "" ? fKey + " eq " + obj.getValue()
                                        : " and " + fKey + " eq " + obj.getValue();
                                entitySetURI.addQueryOption(QueryOption.FILTER, fQuery);
                            }
                        }
                        break;
                }
            }
        }
        uri = entitySetURI.build();
        return uri;
    }

    public <T> URI buildUriForB1WithItemFilter(String serviceUrl, T filterParams,
            T responseEntity)
            throws NoSuchFieldException, SecurityException, IllegalArgumentException, IllegalAccessException,
            InstantiationException, ClassNotFoundException {

        URIBuilder entitySetURI = client.newURIBuilder(serviceUrl);
        URI uri;

        String corseStr = "";
        String expandStr = "";
        String fQuery = "";
        Map<String, Object> convertedStr = new HashMap<>();
        setConvertedObj(convertedStr);
        Map<String, Object> convertedStrings = buildSelectQueryString(responseEntity, ""); // make a select query string
                                                                                           // by using entity properties
        String filterQuery = buildFilterQueryString(filterParams, getClassAlias(filterParams.getClass()));

        Object valueCollection = convertedStrings.get("stringValues");
        if (valueCollection instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, Object> nestedMap = (Map<String, Object>) valueCollection;
            for (Map.Entry<String, Object> entry : nestedMap.entrySet()) {
                String key = entry.getKey();
                String value = entry.getValue().toString();
                corseStr += corseStr.isEmpty() ? "$crossjoin(" + key : "," + key;
                fQuery += fQuery.isEmpty() ? key + "/DocEntry" : " eq " + key + "/DocEntry";
                expandStr += expandStr.isEmpty() ? key + "($select=" + value + ")"
                        : "," + key + "($select=" + value + ")";
            }
            corseStr += ")";
        }
        fQuery += filterQuery.isEmpty() ? "" : " and " + filterQuery;

        Field[] fields = filterParams.getClass().getDeclaredFields();
        Set<String> invalidKeys = Set.of("top", "skip", "orderBy", "OrderBy", "count");
        for (Field field : fields) {
            field.setAccessible(true);
            Object value = field.get(filterParams);
            if (value != null) {
                if (isPrimitiveOrWrapper(value.getClass()) && invalidKeys.contains(field.getName())) {
                    switch (field.getName().toLowerCase()) {
                        case "top":
                            entitySetURI.addQueryOption(QueryOption.TOP, value.toString());
                            break;
                        case "skip":
                            entitySetURI.addQueryOption(QueryOption.SKIP, value.toString());
                            break;
                        case "orderby":
                            entitySetURI.addQueryOption(QueryOption.ORDERBY, value.toString());
                            break;
                        default:
                            break;
                    }
                }
            }
        }
        entitySetURI.addQueryOption(QueryOption.COUNT, "allpages");
        entitySetURI.appendEntitySetSegment(corseStr)
                .expand(expandStr)
                .filter(fQuery); // "Orders/DocEntry eq Orders/DocumentLines/DocEntry and
                                 // Orders/DocumentLines/DocEntry eq 28");

        uri = entitySetURI.build();
        return uri;
    }

    public static void setConvertedObj(Map<String, Object> obj) {
        convertedObj = obj;
    }

    private static String getJsonAlias(Field field) {
        JsonAlias jsonAlias = field.getAnnotation(JsonAlias.class);
        if (jsonAlias != null) {
            return jsonAlias.value()[0]; // Return the first alias if there are multiple
        }
        return field.getName(); // Fallback to field name if no alias is present
    }

    @Retention(RetentionPolicy.RUNTIME)
    public @interface JsonClassAlias {
        String value();
    }

    private String getClassAlias(Class<?> clazz) {
        JsonClassAlias classAlias = clazz.getAnnotation(JsonClassAlias.class);
        if (classAlias != null) {
            return classAlias.value();
        }
        return StringUtils.capitalize(clazz.getSimpleName()); // Fallback to class name if no alias is present
    }

    private static boolean isPrimitiveOrWrapper(Class<?> type) {
        return type.isPrimitive() ||
                type == Integer.class ||
                type == Long.class ||
                type == Short.class ||
                type == Byte.class ||
                type == Float.class ||
                type == Double.class ||
                type == Boolean.class ||
                type == Character.class ||
                type == String.class ||
                type == java.util.Date.class ||
                type == Date.class;
    }

    @SuppressWarnings("deprecation")
    public <T> Map<String, Object> buildSelectQueryString(T subEntity, String parentName)
            throws IllegalArgumentException, IllegalAccessException,
            InstantiationException, ClassNotFoundException {

        if (!convertedObj.containsKey("stringValues")) {
            Map<String, Object> convertedStrings = new LinkedHashMap<>();
            convertedObj.put("stringValues", convertedStrings);
        }
        @SuppressWarnings("unchecked")
        Map<String, Object> convertedStrings = (Map<String, Object>) convertedObj.get("stringValues");
        Class<?> clazz = subEntity.getClass();
        for (Field subField : clazz.getDeclaredFields()) {
            // String className = StringUtils.capitalize(clazz.getSimpleName()); // Normal
            // File name of the class
            String className = getClassAlias(clazz); // Json alise name of the class
            // String fieldName = subField.getName(); // Normal name of the property or
            // field
            String fKey = getJsonAlias(subField); // Json alise name of the property or field
            Class<?> fieldType = subField.getType();
            // String fKey = StringUtils.capitalize(fieldName);
            if (!isPrimitiveOrWrapper(fieldType)) {
                setConvertedObj(convertedObj);
                String sub = subField.getGenericType().toString();
                String subPath = sub.substring(sub.indexOf('<') + 1, sub.indexOf('>'));
                String pathName = className + "/" + fKey;
                if (!parentName.isEmpty()) {
                    int lastSlashIndex = parentName.lastIndexOf("/");
                    if (lastSlashIndex > -1) {
                        String lastPart = parentName.substring(lastSlashIndex + 1);
                        if (lastPart.equals(className)) {
                            pathName = parentName + "/" + fKey;
                        }
                    }
                }
                buildSelectQueryString(Class.forName(subPath).newInstance(), pathName);
            } else {
                if (convertedStrings.containsKey(className)) {
                    Object value = (String) convertedStrings.get(className);
                    value += "," + fKey;
                    convertedStrings.put(className, value);
                } else {
                    if (!parentName.isEmpty()) {
                        if (convertedStrings.containsKey(parentName)) {
                            Object value = (String) convertedStrings.get(parentName);
                            value += "," + fKey;
                            convertedStrings.put(parentName, value);
                        } else {
                            convertedStrings.put(parentName, fKey);
                        }
                    } else {
                        convertedStrings.put(className, fKey);
                    }
                }
                setConvertedObj(convertedObj);
            }
        }
        return convertedObj;
    }

    private static String buildFilterQueryString(Object filter, String parentKey)
            throws NoSuchFieldException, SecurityException {
        StringJoiner joiner = new StringJoiner(" and ");
        Field[] fields = filter.getClass().getDeclaredFields();
        Set<String> invalidKeys = Set.of("top", "skip", "orderBy", "OrderBy", "count");
        for (Field field : fields) {
            field.setAccessible(true);
            try {
                Object value = field.get(filter);
                if (value != null) {
                    String key = (parentKey == null) ? getJsonAlias(field) : parentKey + "/" + getJsonAlias(field);
                    if (isPrimitiveOrWrapper(value.getClass())) {
                        if (!invalidKeys.contains(field.getName())) {
                            // joiner.add(buildOrQuery((String) value, key));
                            String Query = "";
                            if (value instanceof String) {
                                if (getJsonAlias(field).contains("Collection")) {
                                    String fname = getJsonAlias(field).replace("Collection", "");
                                    key = (parentKey == null) ? StringUtils.capitalize(fname)
                                            : parentKey + "/" + StringUtils.capitalize(fname);
                                    // Create Field object
                                    String firstLetter = fname.substring(0, 1);
                                    String camelCaseKey = fname.replaceFirst(firstLetter, firstLetter.toLowerCase());
                                    String tp = filter.getClass().getDeclaredField(camelCaseKey).getType().getName();

                                    String[] splittedValue = value.toString().split(",");
                                    int index = 0;
                                    if (tp.contains("String")) {
                                        for (String ele : splittedValue) {
                                            Query += index == 0 ? " (contains (" + key + ",'" + ele + "')"
                                                    : index == splittedValue.length - 1
                                                            ? " or contains (" + key + ",'" + ele + "'))"
                                                            : " or contains (" + key + ",'" + ele + "')";
                                            if (splittedValue.length == 1)
                                                Query += "contains (" + key + ",'" + ele + "')";
                                            index++;
                                        }
                                        joiner.add(Query);
                                    } else if (tp.contains("Integer") || tp.contains("Long") || tp.contains("Short")
                                            || tp.contains("Byte")) {
                                        for (String ele : splittedValue) {
                                            Query += index == 0 ? "(" + key + " eq " + ele
                                                    : index == splittedValue.length - 1
                                                            ? " or " + key + " eq " + ele + ")"
                                                            : " or " + key + " eq " + ele;
                                            if (splittedValue.length == 1)
                                                Query += key + " eq " + ele;

                                            index++;
                                        }
                                        joiner.add(Query);
                                    } else if (tp.contains("Date")) {
                                        Query = key + " ge '" + splittedValue[0] + "' and " + key + " le '"
                                                + splittedValue[1] + "'";
                                        joiner.add(Query);
                                    }
                                } else {
                                    Query = "contains (" + key + ",'" + value + "')";
                                    joiner.add(Query);

                                }
                            } else {
                                Query = key + " eq " + value;

                                joiner.add(Query);
                            }
                        }
                    } else {
                        String nestedQuery = buildFilterQueryString(value, key);
                        if (!nestedQuery.isEmpty()) {
                            if (!invalidKeys.contains(field.getName())) {
                                joiner.add(nestedQuery);
                            }
                        }
                    }
                }
            } catch (IllegalAccessException e) {
                // Handle exception
                e.printStackTrace();
            }
        }
        return joiner.toString();
    }

}
