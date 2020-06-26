/**
 * Public class to server as a apex controller to login manager lwc component
 * Created By       :       Abhishek Kumar Sharma
 * Created Date     :       22 June 2020
 */
public with sharing class loginManagerCtrl {
   
    /**
     * Method to handle the user login process, it will verify the user and generate respective result
     * Created By       :       Abhishek Kumar Sharma
     * Created Date     :       22 June 2020
     */
    @AuraEnabled
    public static UserMessageHandler verifyUserLoginDetail_Apex(String userInput){
        UserMessageHandler userMessageHandlerObject = new UserMessageHandler();
        UserDetails inputtedUserDetail;
        try {
            inputtedUserDetail = (UserDetails) JSON.deserialize(userInput, UserDetails.class);
            List<User_Login__c> userLoginRecordList = new List<User_Login__c>(); 
            String query = 'SELECT ID,Is_Active__c,Last_Login_Date_Time__c,Password__c,Reason_For_Blocking_User__c,User_Email__c,User_Name__c,User_Phone__c,View_All_Records__c,Block_User_For_24_Hours__c FROM User_Login__c WHERE User_Name__c =\''+inputtedUserDetail.username +'\'AND Password__c =\''+inputtedUserDetail.password+'\' LIMIT 1';
            userLoginRecordList = Database.query(query);
            /**
             * throwing custom errors on different criteria base
             */
            if(userLoginRecordList.isEmpty()){
            userMessageHandlerObject.isSuccess = false; 
            userMessageHandlerObject.Id = null;
            userMessageHandlerObject.successMessage = 'User not found';
            userMessageHandlerObject.errorMessage = 'User not found';
            userMessageHandlerObject.userErrorMessage = 'No user found with this username and password combination.';
            userMessageHandlerObject.responseData = 'Invalid Login';
            userMessageHandlerObject.userInputData = userInput;
            }else if (userLoginRecordList[0].Is_Active__c == false) {
            userMessageHandlerObject.isSuccess = false; 
            userMessageHandlerObject.Id = userLoginRecordList[0].Id;
            userMessageHandlerObject.successMessage = 'User inactive';
            userMessageHandlerObject.errorMessage = 'User inactive';
            userMessageHandlerObject.userErrorMessage = 'Your account is deactivated by admin.';
            userMessageHandlerObject.responseData = 'Invalid Login';
            userMessageHandlerObject.userInputData = userInput;
            }else if (userLoginRecordList[0].Block_User_For_24_Hours__c == true) {
            userMessageHandlerObject.isSuccess = false; 
            userMessageHandlerObject.Id = userLoginRecordList[0].Id;
            userMessageHandlerObject.successMessage = 'User blocked';
            userMessageHandlerObject.errorMessage = 'User blocked';
            userMessageHandlerObject.userErrorMessage = 'Your account is suspended temporarily, will resume after 24 hours.';
            userMessageHandlerObject.responseData = 'Invalid Login';
            userMessageHandlerObject.userInputData = userInput;
            }else{
                userMessageHandlerObject.isSuccess = true; 
                userMessageHandlerObject.Id = userLoginRecordList[0].Id;
                userMessageHandlerObject.successMessage = 'SUCCESS';
                userMessageHandlerObject.errorMessage = null;
                userMessageHandlerObject.userErrorMessage = null;
                userMessageHandlerObject.responseData = String.valueOf(userLoginRecordList[0]);
                userMessageHandlerObject.userInputData = userInput;
                userLoginRecordList[0].Last_Login_Date_Time__c = System.now();
                update userLoginRecordList;
            }
            return userMessageHandlerObject;
        } catch (Exception exce) {
            system.debug('Exception occurred while verifying the user details. \n Message ::'+exce.getMessage()+'\n Cause ::'+exce.getCause()+' \n Line Number ::'+exce.getLineNumber());
            userMessageHandlerObject.isSuccess = false;
            userMessageHandlerObject.Id = null;
            userMessageHandlerObject.successMessage = null;
            userMessageHandlerObject.errorMessage = String.valueOf(exce.getCause());
            userMessageHandlerObject.userErrorMessage = String.valueOf(exce.getMessage());
            userMessageHandlerObject.responseData = null;
            userMessageHandlerObject.userInputData = String.valueOf(JSON.deserializeUntyped(userInput));

            return userMessageHandlerObject;
            
        } 
    }

    /**
     * method to save the new project login credentials
     * Created By       :       Abhishek Kumar Sharma
     * Created Date     :       23 June 2020
     */
    @AuraEnabled
    public static UserMessageHandler addNewLoginCredentials_Apex(Login_Credential__c newLoginCredential){
        UserMessageHandler userMessageHandler = new UserMessageHandler();
        try {
            insert newLoginCredential;
            userMessageHandler.isSuccess = true;
            userMessageHandler.Id = newLoginCredential.Id;
            userMessageHandler.successMessage = 'Credentials Added Successfully.';
            userMessageHandler.errorMessage = null;
            userMessageHandler.userErrorMessage = null;
            userMessageHandler.responseData = String.valueOf(newLoginCredential);
            userMessageHandler.userInputData = String.valueOf(newLoginCredential);
            return userMessageHandler;
        } catch (Exception exce) {
            system.debug('Exception occurred while creating add new login credential. \n Message ::'+exce.getMessage()+'\n Line Number ::'+exce.getLineNumber()+'\n Cause ::'+exce.getCause());
            userMessageHandler.isSuccess = false;
            userMessageHandler.Id = null;
            userMessageHandler.successMessage = null;
            userMessageHandler.errorMessage = String.valueOf(exce.getCause());
            String exceptionString = exce.getMessage().replace(': []', ' ');
            userMessageHandler.userErrorMessage = String.valueOf(exceptionString.replace('Insert failed. First exception on row 0; first error:',' ').trim());
            userMessageHandler.responseData = null;
            userMessageHandler.userInputData = String.valueOf(newLoginCredential);
            return userMessageHandler;
        }
    }

    /**
     * Wrapper class to handle the user messages and request status
     * Created By       :       Abhishek Kumar Sharma
     * Created Date     :       22 June 2020
     */
    public class UserMessageHandler{
        @AuraEnabled public Boolean isSuccess;
        @AuraEnabled public String Id;
        @AuraEnabled public String successMessage;
        @AuraEnabled public String errorMessage;
        @AuraEnabled public String userErrorMessage;
        @AuraEnabled public String responseData;
        @AuraEnabled public String userInputData;
    }

    /**
     * Wrapper class to handle the user input for login details
     * Created By       :       Abhishek Kumar Sharma
     * Created Date     :       22 June 2020
     */
    public class UserDetails {
        @AuraEnabled public String username ;
        @AuraEnabled public String password ;
    }
}