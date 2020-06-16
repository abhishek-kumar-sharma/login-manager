public with sharing class loginManagerCtrl {
   
    @AuraEnabled
    public static userMessageHandler verifyUserLoginDetail_Apex(String inputtedUserDetail){
        userMessageHandler userMessageHandlerObject = new userMessageHandler();
        try {
            userMessageHandlerObject.isSuccess = true;
            userMessageHandlerObject.successMessage = 'SUCCESS';
            userMessageHandlerObject.errorMessage = null;
            userMessageHandlerObject.userErrorMessage = null;
            userMessageHandlerObject.responseData = 'Valid Login';
            userMessageHandlerObject.userInputData = inputtedUserDetail;

            return userMessageHandlerObject;
        } catch (Exception exce) {
            System.debug('Exception occurred while verifying the user details. \n Message ::'+exce.getMessage()+'\n Cause ::'+exce.getCause()+' \n Line Number ::'+exce.getLineNumber());
            userMessageHandlerObject.isSuccess = false;
            userMessageHandlerObject.successMessage = null;
            userMessageHandlerObject.errorMessage = String.valueOf(exce.getCause());
            userMessageHandlerObject.userErrorMessage = String.valueOf(exce.getMessage());
            userMessageHandlerObject.responseData = null;
            userMessageHandlerObject.userInputData = inputtedUserDetail;

            return userMessageHandlerObject;
            
        } 
    }

    public class userMessageHandler{
        @AuraEnabled public Boolean isSuccess;
        @AuraEnabled public String successMessage;
        @AuraEnabled public String errorMessage;
        @AuraEnabled public String userErrorMessage;
        @AuraEnabled public String responseData;
        @AuraEnabled public String userInputData;

    }
}