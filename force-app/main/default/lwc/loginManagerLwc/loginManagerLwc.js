import { LightningElement, track } from 'lwc';

export default class LoginManagerLwc extends LightningElement {

    showHeader = false;
    showLogin = false;
    showDataTable = false;
    @track userDetails = {
        username: null,
        password: null
    }

    /**
     * Initalizing the values and checking the previous session
     * Created By       :       Abhishek Kumar Sharma
     * Created Date     :       12 May 2020
     */
    connectedCallback() {
        try {

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
                this.userDetails[event.target.name] = event.target.value;
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
            var usernameClass = this.template.querySelector(".usernameClass");
            var passwordClass = this.template.querySelector(".passwordClass");
            if (this.userDetails.username === null || this.userDetails.username === undefined) {
                usernameClass.setCustomValidity("username is needed");
                usernameClass.reportValidity();
            } else {
                usernameClass.setCustomValidity("");
                usernameClass.reportValidity();
            }
            if (this.userDetails.password === null || this.userDetails.password === undefined) {
                passwordClass.setCustomValidity("password is needed");
                passwordClass.reportValidity();
            } else {
                passwordClass.setCustomValidity("");
                passwordClass.reportValidity();
            }

        } catch (error) {
            console.error('Exception occurred while handling the login button. Please reload the page and try again. \n Message ::', error.message);

        }
    }



}