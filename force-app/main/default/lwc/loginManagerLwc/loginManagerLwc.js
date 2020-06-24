import { LightningElement, track } from 'lwc';
import logo from '@salesforce/resourceUrl/logo';
import validate_login_Apex from '@salesforce/apex/loginManagerCtrl.verifyUserLoginDetail_Apex';
import add_Credentials_Apex from '@salesforce/apex/loginManagerCtrl.addNewLoginCredentials_Apex';
export default class LoginManagerLwc extends LightningElement {

    showHeader = true; // Variable to show hide the page header
    showLogin = false; // Variable to show hide the login box
    showDataTable = true; // Variable to show hide the data table
    showLoginError = false; // Variable to show hide the login page error
    showAddCredentialsError = false; // Variable to show hide the login page error
    showAddCredentials = false; // Variable to show hide the add credentials option
    displayDate; // Variable to hold the date
    header_Logo = logo; // Variable to hold the header logo
    /**
     * Variable section for toast start
     */
    showToast = false;
    toastContext = 'success';
    toastClass = 'slds-notify slds-notify_toast slds-theme_success';
    toastIconName = 'utility:success';
    toastAlternativeText = 'success';
    toastMessage = null;
    /**
     * Variable section for toast end
     */

    @track userDetails = {
        username: null,
        password: null
    }; // to hold the user input details
    @track login_Credential = {
        'sobjectType': 'Login_Credential__c'
    };
    @track userResponseFromServer; // Variable to hold the user response from server


    /**
     * Initalizing the values and checking the previous session
     * Created By       :       Abhishek Kumar Sharma
     * Created Date     :       12 June 2020
     */
    connectedCallback() {
        try {
            /**
             * calculating the current time and setting up the call back for time update on header
             */
            var that = this;
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
            startTime(that);
            function startTime(that) {
                var currentTime = new Date();
                currentTime = currentTime.toLocaleDateString('us-en', options);
                that.displayDate = currentTime;
                var t = setTimeout(startTime, 900, that);
            }

            /**
             * Checking user is logged in or not from session
             */
            if (sessionStorage.getItem('clientMachineId') === null || sessionStorage.getItem('clientMachineSecret') === null || sessionStorage.getItem('clientMachineId') === undefined || sessionStorage.getItem('clientMachineSecret') === undefined) {
                // this.showLogin = true;
            } else {
                //this.showLogin = false;
            }

        } catch (error) {
            console.error('Error occurred while handling the connected call back. \n Message ::', error.message);

        }
    }

    /**
     * Method to handle the value assignment for all the input field on the basis of name
     * Created By       :       Abhishek Kumar Sharma
     * Created Date     :       12 June 2020
     */
    setInputValue(event) {
        try {
            if (event.target.name !== undefined && event.target.name !== null && event.target.value !== undefined && event.target.value !== null && event.target.classList.contains('lgnInput') === true && event.target.checked === false) {
                this.userDetails[event.target.name] = event.target.value.trim();
            } else if (event.target.name !== undefined && event.target.name !== null && event.target.value !== undefined && event.target.value !== null && event.target.classList.contains('addCred') === true) {
                this.login_Credential[event.target.name] = event.target.value.trim();
            } else if (event.target.name !== undefined && event.target.name !== null && event.target.value !== undefined && event.target.value !== null && event.target.classList.contains('addCredCheckbox') === true) {
                this.login_Credential[event.target.name] = event.target.checked;
            }
        } catch (error) {
            console.error('Exception occurred while assigning the value from input field. \n Message ::', error.message);

        }
    }

    /**
     * Method to close the toast
     * Created By       :       Abhishek Kumar Sharma
     * Created Date     :       23 June 2020
     */
    closeToast(that) {
        try {
            if (that) {
                that.showToast = false;
            } else {
                this.showToast = false;
            }

        } catch (error) {
            console.error('Error occurred while closing the toast', error);
        }
    }

    /**
     * Method to show the toast
     * Created By       :       Abhishek Kumar Sharma
     * Created Date     :       23 June 2020
     */
    displayToast(toastMessage, toastContext, toastClass, toastIconName, toastAlternativeText) {
        try {
            this.toastMessage = toastMessage;
            if (toastContext === 'success' && (toastClass === null || toastClass === undefined)) {
                this.toastClass = 'slds-notify slds-notify_toast slds-theme_success';
            } else if (toastContext === 'error' && (toastClass === null || toastClass === undefined)) {
                this.toastClass = 'slds-notify slds-notify_toast slds-theme_error';
            } else if (toastContext === 'warning' && (toastClass === null || toastClass === undefined)) {
                this.toastClass = 'slds-notify slds-notify_toast slds-theme_warning';
            } else {
                this.toastClass = toastClass;
            }

            if (toastIconName !== null && toastIconName !== undefined) {
                this.toastIconName = toastIconName;
            }
            if (toastAlternativeText != null && toastAlternativeText !== undefined) {
                this.toastAlternativeText = toastAlternativeText;
            }
            this.showToast = true;
        } catch (error) {
            console.error('Error occurred while showing the toast. Please refresh the page and try again', error);

        }
    }

    /**
     * Method handle the click of login button, performing the client side validations for input
     * Created By       :       Abhishek Kumar Sharma
     * Created Date     :       12 June 2020
     */
    handleLoginButton() {
        try {
            var usernameClass = this.template.querySelector(".usernameClass");
            var passwordClass = this.template.querySelector(".passwordClass");
            var isUserInputValid = false;
            if (this.userDetails.username === null || this.userDetails.username === undefined || this.userDetails.username.trim() === "") {
                usernameClass.setCustomValidity("username is needed");
                usernameClass.reportValidity();
                isUserInputValid = false;
                return;
            } else {
                usernameClass.setCustomValidity("");
                usernameClass.reportValidity();
                isUserInputValid = true;
            }
            if (this.userDetails.password === null || this.userDetails.password === undefined || this.userDetails.password.trim() === "") {
                passwordClass.setCustomValidity("password is needed");
                passwordClass.reportValidity();
                isUserInputValid = false;
            } else {
                passwordClass.setCustomValidity("");
                passwordClass.reportValidity();
                isUserInputValid = true;
            }
            if (isUserInputValid) {
                validate_login_Apex({
                    userInput: JSON.stringify(this.userDetails)
                }).then(result => {
                    this.userResponseFromServer = result;
                    if (this.userResponseFromServer.isSuccess === false) {
                        this.showLoginError = true;
                    } else {
                        this.showLoginError = false;
                        this.showLogin = false;
                        this.showHeader = true;
                        this.showDataTable = true; 
                        this.login_Credential['User_Login__c'] = result.Id;
                    }
                    console.log('String ::', JSON.stringify(result));
                })
                    .catch(error => {
                        console.error('Error occurred while validating the login process. \n Message ::', error);

                    })
            }

        } catch (error) {
            console.error('Exception occurred while handling the login button. Please reload the page and try again. \n Message ::', error.message);

        }
    }

    /**
     * Method to hide the error text from UI
     * Created By       :       Abhishek Kumar Sharma
     * Created Date     :       17 June 2020
     */
    handleCloseErrorButton() {
        try {
            this.showLoginError = false;
            this.showAddCredentialsError = false;
        } catch (error) {
            console.error('Error occurred while handling the close button click. Please refresh the page. \n Message ::', error);
        }
    }

    /**
     * Method to show the add credentials pop up
     * Created By       :       Abhishek Kumar Sharma
     * Created Date     :       19 June 2020
     */
    openAddCredentialsModal() {
        try {
            this.showAddCredentials = true;
        } catch (error) {
            console.error('Error occurred while handling the close button click. Please refresh the page. \n Message ::', error);
        }
    }

    /**
     * Method to hide the add credentials pop up
     * Created By       :       Abhishek Kumar Sharma
     * Created Date     :       19 June 2020
     */
    closeAddCredentialsModal() {
        try {
            this.showAddCredentials = false;
        } catch (error) {
            console.error('Error occurred while handling the close button click. Please refresh the page. \n Message ::', error);
        }
    }

    /**
     * Method to add the new login credentials to org
     * Created By       :       Abhishek Kumar Sharma
     * Created Date     :       22 June 2020
     */
    handleAddCredentialsButton() {
        try {
            var that = this;
            add_Credentials_Apex({
                newLoginCredential: this.login_Credential
            }).then(result => {
                this.userResponseFromServer = result;
                if (this.userResponseFromServer.isSuccess === false) {
                    this.showAddCredentialsError = true;
                } else {
                    this.showAddCredentialsError = false;
                    this.closeAddCredentialsModal();
                    this.displayToast(this.userResponseFromServer.successMessage, 'success');
                    setTimeout(this.closeToast, 3000, that);
                }
            })
                .catch(error => {
                    console.error('Error occurred while calling the add credentials method. \n Message ::', error);
                })
        } catch (error) {
            console.error('Error occurred while saving the login credentials. Please refresh the page and try again. \n Message ::', error);
        }
    }
}