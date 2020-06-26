/**
 * Public class to server as a apex controller to data table lwc component
 * Created By       :       Abhishek Kumar Sharma
 * Created Date     :       25 June 2020
 */
public with sharing class dataTableCtrl {
    /**
     * Method to return the data to the user method
     * Created By       :       Abhishek Kumar Sharma
     * Created Date     :       25 June 2020
     */
    @AuraEnabled
    public static UserMessageHandler getDataForTable_Apex(String objectApiName,Boolean viewAllPermissionForUser,String loggedInUserId){
        UserMessageHandler userMessageHandler = new UserMessageHandler();
        try {
            if (String.isNotBlank(objectApiName) && String.isNotBlank(loggedInUserId)) {
                String fieldToQuery = String.join(new List<String>( Schema.getGlobalDescribe().get(objectApiName).getDescribe().fields.getMap().keySet()), ',');
                String query = 'SELECT '+fieldToQuery+' FROM ' + objectApiName;
                if (viewAllPermissionForUser) {
                    query = query+' WITH SECURITY_ENFORCED LIMIT 10000';
                }else {
                    query = query+' WHERE user_login__c =\''+loggedInUserId+'\' WITH SECURITY_ENFORCED LIMIT 10000';
                }
                List<sObject> dataListToReturn = new List<sObject>();
                dataListToReturn = Database.query(query);
                userMessageHandler.isSuccess = true;
                userMessageHandler.errorReason = null;
                userMessageHandler.errorMessage = null;
                userMessageHandler.responseData = dataListToReturn;
                userMessageHandler.userInput = objectApiName;
                userMessageHandler.successMessage = 'Able to fetch record.';
            }else {
                userMessageHandler.isSuccess = false;
                userMessageHandler.errorReason = 'Object Name Not Found';
                userMessageHandler.errorMessage = 'Object api name or logged in user id missing.';
                userMessageHandler.responseData = null;
                userMessageHandler.userInput = objectApiName;
                userMessageHandler.successMessage = null;
            }
            return userMessageHandler;
        } catch (Exception exce) {
            System.debug('Exception occurred while getting the data. \n Message ::'+exce.getMessage()+' \n Cause ::'+exce.getCause()+'\n Line Number ::'+exce.getLineNumber());
            userMessageHandler.isSuccess = false;
            userMessageHandler.errorReason = String.valueOf(exce.getCause());
            userMessageHandler.errorMessage = exce.getMessage();
            userMessageHandler.responseData = null;
            userMessageHandler.userInput = objectApiName;
            userMessageHandler.successMessage = null;
            return userMessageHandler;
        }
    }

/**
 * Wrapper class to handle the data and error messages
 * Created By       :       Abhishek Kumar Sharma
 * Created Date     :       26 June 2020
 */
public class UserMessageHandler {
    @AuraEnabled public Boolean isSuccess;
    @AuraEnabled public String successMessage;
    @AuraEnabled public String errorReason;
    @AuraEnabled public String errorMessage;
    @AuraEnabled public List<SObject> responseData;
    @AuraEnabled public String userInput;
}


}