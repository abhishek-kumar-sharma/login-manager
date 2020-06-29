import { LightningElement, api, track } from 'lwc';
import getTableDataFrom_Apex from '@salesforce/apex/dataTableCtrl.getDataForTable_Apex';

export default class DataTableLwc extends LightningElement {
    @api flexipageRegionWidth;
    @api viewAllPermissionForUser;
    @api loggedInUserId ;
    tableHeading = ''; // table heading

    //Entries controlling attribute section start
    disableEntriesOptions = false; // enable/disable the select box for entries
    defaultNoOfEntriesToShow = '5'; // No of entries to show the default
    @track entriesOptions = [
        { label: '5', value: '5' , selected: true},
        { label: '10', value: '10' },
        { label: '50', value: '50' },
        { label: '100', value: '100' }
    ]; // entries select options values
    //Entries controlling attribute section end


    // Search input box controlling attribute section start
    searchString; // Attribute to hold the value for search input
    disableSearchBox = false; // Attribute to enable/disable the search box
    // Search input box controlling attribute section end

    @track tableResponseData = {}; // table response data
    dataTableFieldForColumn = [
        {
            label: 'Project Name',
            fieldName:'Project_Name__c',
            type:'text',
            sortable:true
        },
        {
            label: 'Org Name',
            fieldName: 'Org_name__c',
            type: 'text',
            sortable: true
        },
        {
            label: 'Username',
            fieldName: 'Username__c',
            type: 'text',
            sortable: true
        },
        {
            label: 'Password',
            fieldName: 'Password__c',
            type: 'text',
            sortable: true
        },
        {
            label: 'Security Token',
            fieldName: 'Security_Token__c',
            type: 'text',
            sortable: true
        },
        {
            label: 'Is Sandbox ?',
            fieldName: 'Is_Sandbox__c',
            type: 'checkbox',
            sortable: true
        },
        {
            label: 'Is SF Credentials ?',
            fieldName: 'Is_Salesforce_Credentials__c',
            type: 'checkbox',
            sortable: true
        },
        {
            label: 'Last Validity Check',
            fieldName: 'Last_Validity_Check__c',
            type: 'datetime',
            sortable: true
        },
        {
            label: 'Valid ?',
            fieldName: 'Validity__c',
            type: 'checkbox',
            sortable: true
        }
        
    ]; // table columns
    dataTableObjectApiName = 'Login_Credential__c'; // object API name

    /**
     * Connected call back to initialize the values
     * Created By       :       Abhishek Kumar Sharma
     * Created Date     :       24 June 2020
     */
    connectedCallback() {
        try {
            getTableDataFrom_Apex({
                objectApiName : this.dataTableObjectApiName,
                viewAllPermissionForUser : this.viewAllPermissionForUser,
                loggedInUserId : this.loggedInUserId
            })
            .then( result => {
                console.log('result ==>',JSON.stringify(result));
                //this.tableResponseData = result.responseData; 
            })
            .catch(error => {
                console.error('Error while getting data from apex in data table connected call back. \n Message ::',error);
            })
        } catch (error) {
            console.error('Error occurred while initalizing the data table. \n Message ::', error);
        }
    }

    /**
     * Method to handle the entries option change
     * Created By       :       Abhishek Kumar Sharma
     * Created Date     :       24 June 2020
     */
    handleShowEntriesChange(event) {
        try {
            if (event.target.value !== null && event.target.value !== undefined) {
                this.defaultNoOfEntriesToShow = event.target.value;
            }
        } catch (error) {
            console.error('Error while handling the change entries. \n Message ::', error);

        }
    }

    /**
     * Method to handle the changes in the search box at top of the table
     * Created By       :       Abhishek Kumar Sharma
     * Created Date     :       24 June 2020
     */
    handleSearchStringChange() {
        try {
            if (event.target.value !== null && event.target.value !== undefined) {
                this.searchString = event.target.value;
            }
        } catch (error) {
            console.log('Error while handling the search string change. \n Message ::', error);
        }
    }

    /**
     * Method to handle the data refresh from server for data table
     * Created By       :       Abhishek Kumar Sharma
     * Created Date     :       24 June 2020
     */
    handleRefreshTableContent() {
        try {

        } catch (error) {
            console.error('Error occurred while handling the table refresh button. \n Message ::', error);

        }
    }
}