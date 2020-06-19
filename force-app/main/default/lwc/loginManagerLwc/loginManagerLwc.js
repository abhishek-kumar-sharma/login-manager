import { LightningElement, track } from 'lwc';
import logo from '@salesforce/resourceUrl/logo';
import validate_login_Apex from '@salesforce/apex/loginManagerCtrl.verifyUserLoginDetail_Apex';
export default class LoginManagerLwc extends LightningElement {

    showHeader = false; // Variable to show hide the page header
    showLogin = true; // Variable to show hide the login box
    showDataTable = false; // Variable to show hide the data table
    showLoginError = false; // Variable to show hide the login page error
    loginErrorMessage; // Variable to hold the login page
    displayDate; // Variable to hold the date
    header_Logo = logo; // Variable to hold the header logo
    @track userDetails = {
        username: null,
        password: null
    }; // to hold the user input details

    @track userResponseFromServer; // Variable to hold the user response from server

    /**
     * Initalizing the values and checking the previous session
     * Created By       :       Abhishek Kumar Sharma
     * Created Date     :       12 May 2020
     */
    connectedCallback() {
        try {
            var that = this;
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
            startTime(that);
            function startTime(that) {
                var currentTime = new Date();
                currentTime = currentTime.toLocaleDateString('us-en', options);
                that.displayDate = currentTime;
                var t = setTimeout(startTime, 900 , that);
            }
            
            /**
             * Checking user is logged in or not from session
             */
            if (sessionStorage.getItem('clientMachineId') === null || sessionStorage.getItem('clientMachineSecret') === null || sessionStorage.getItem('clientMachineId') === undefined || sessionStorage.getItem('clientMachineSecret') === undefined) {
                this.showLogin = true;
                console.log('hello');

            } else {
                this.showLogin = false;
                console.log('world');

            }

        } catch (error) {
            console.error('Error occurred while handling the connected call back. \n Message ::', error.message);

        }
    }

    /**
     * Method to handle the value assignment for all the input field on the basis of name
     * Created By       :       Abhishek Kumar Sharma
     * Created Date     :       12 May 2020
     */
    setInputValue(event) {
        try {
            if (event.target.name !== undefined && event.target.name !== null && event.target.value !== undefined && event.target.value !== null) {
                this.userDetails[event.target.name] = event.target.value.trim();
            }

        } catch (error) {
            console.error('Exception occurred while assigning the value from input field. \n Message ::', error.message);

        }
    }

    /**
     * Method handle the click of login button, performing the client side validations for input
     * Created By       :       Abhishek Kumar Sharma
     * Created Date     :       12 May 2020
     */
    handleLoginButton() {
        try {
            console.log('this.userDetails ===: ' + JSON.stringify(this.userDetails));
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
            console.log('user input valid ::' + isUserInputValid);
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
     * Created Date     :       17 May 2020
     */
    handleCloseErrorButton() {
        try {
            this.showLoginError = false;
        } catch (error) {
            console.error('Error occurred while handling the close button click. Please refresh the page. \n Message ::', error);

        }
    }



}