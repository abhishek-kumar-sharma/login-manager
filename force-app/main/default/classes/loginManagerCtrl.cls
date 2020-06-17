public with sharing class loginManagerCtrl {
   
    @AuraEnabled
    public static UserMessageHandler verifyUserLoginDetail_Apex(String userInput){
        UserMessageHandler userMessageHandlerObject = new UserMessageHandler();
        UserDetails inputtedUserDetail;
        try {
            inputtedUserDetail = (UserDetails) JSON.deserialize(userInput, UserDetails.class);
            List<User_Login__c> userLoginRecordList = new List<User_Login__c>(); 
            String query = 'SELECT ID,Is_Active__c,Last_Login_Date_Time__c,Password__c,Reason_For_Blocking_User__c,User_Email__c,User_Name__c,User_Phone__c,View_All_Records__c,Block_User_For_24_Hours__c FROM User_Login__c WHERE User_Name__c =\''+inputtedUserDetail.username +'\'AND Password__c =\''+inputtedUserDetail.password+'\' LIMIT 1';
            userLoginRecordList = Database.query(query);
            system.debug('userLoginRecordList ::'+userLoginRecordList);
            /**
             * throwing custom errors on different criteria base
             */
            if(userLoginRecordList.isEmpty()){
            userMessageHandlerObject.isSuccess = false; 
            userMessageHandlerObject.successMessage = 'User not found';
            userMessageHandlerObject.errorMessage = 'User not found';
            userMessageHandlerObject.userErrorMessage = 'No user found with this username and password combination.';
            userMessageHandlerObject.responseData = 'Invalid Login';
            userMessageHandlerObject.userInputData = inputtedUserDetail;
            }else if (userLoginRecordList[0].Is_Active__c == false) {
            userMessageHandlerObject.isSuccess = false; 
            userMessageHandlerObject.successMessage = 'User inactive';
            userMessageHandlerObject.errorMessage = 'User inactive';
            userMessageHandlerObject.userErrorMessage = 'Your account is deactivated by admin.';
            userMessageHandlerObject.responseData = 'Invalid Login';
            userMessageHandlerObject.userInputData = inputtedUserDetail;
            }else if (userLoginRecordList[0].Block_User_For_24_Hours__c == true) {
            userMessageHandlerObject.isSuccess = false; 
            userMessageHandlerObject.successMessage = 'User blocked';
            userMessageHandlerObject.errorMessage = 'User blocked';
            userMessageHandlerObject.userErrorMessage = 'Your account is suspended temporarily, will resume after 24 hours.';
            userMessageHandlerObject.responseData = 'Invalid Login';
            userMessageHandlerObject.userInputData = inputtedUserDetail;
            }else{
                userMessageHandlerObject.isSuccess = true; 
                userMessageHandlerObject.successMessage = 'SUCCESS';
                userMessageHandlerObject.errorMessage = null;
                userMessageHandlerObject.userErrorMessage = null;
                userMessageHandlerObject.responseData = String.valueOf(userLoginRecordList[0]);
                userMessageHandlerObject.userInputData = inputtedUserDetail;
            }
            
            return userMessageHandlerObject;
        } catch (Exception exce) {
            system.debug('Exception occurred while verifying the user details. \n Message ::'+exce.getMessage()+'\n Cause ::'+exce.getCause()+' \n Line Number ::'+exce.getLineNumber());
            userMessageHandlerObject.isSuccess = false;
            userMessageHandlerObject.successMessage = null;
            userMessageHandlerObject.errorMessage = String.valueOf(exce.getCause());
            userMessageHandlerObject.userErrorMessage = String.valueOf(exce.getMessage());
            userMessageHandlerObject.responseData = null;
            userMessageHandlerObject.userInputData = inputtedUserDetail;

            return userMessageHandlerObject;
            
        } 
    }

    public class UserMessageHandler{
        @AuraEnabled public Boolean isSuccess;
        @AuraEnabled public String successMessage;
        @AuraEnabled public String errorMessage;
        @AuraEnabled public String userErrorMessage;
        @AuraEnabled public String responseData;
        @AuraEnabled public UserDetails userInputData;
    }

    public class UserDetails {
        @AuraEnabled public String username ;
        @AuraEnabled public String password ;
    }
}