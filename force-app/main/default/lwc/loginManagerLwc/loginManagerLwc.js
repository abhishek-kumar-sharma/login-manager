import { LightningElement ,track } from 'lwc';

export default class LoginManagerLwc extends LightningElement {

showHeader = false;
showLogin = false;
showDataTable = false;

/**
 * Initalizing the values and checking the previous session
 * Created By       :       Abhishek Kumar Sharma
 * Created Date     :       12 May 2020
 */
connectedCallback(){
    try {
        console.log('called ---->');
        Cache.session.put('hello','world');
        console.log(Cache.session.get('hello'));
    } catch (error) {
        
    }
}


}