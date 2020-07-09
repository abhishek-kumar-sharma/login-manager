import { LightningElement, api, track } from 'lwc';
import getTableDataFrom_Apex from '@salesforce/apex/dataTableCtrl.getDataForTable_Apex';

export default class DataTableLwc extends LightningElement {
    @api flexipageRegionWidth;
    @api viewAllPermissionForUser;
    @api loggedInUserId;
    tableHeading = ''; // table heading


    //Entries controlling attribute section start
    fromEntries = 1; // from entry
    toEntries = 1; // to entry
    currentPage = 1; // to entry
    disableEntriesOptions = false; // enable/disable the select box for entries
    defaultNoOfEntriesToShow = '5'; // No of entries to show the default
    totalNumberOfRows; // total no of rows
    totalPages; // total pages
    sortedBy; // table sorted by
    sortedDirection; // table sorted direction
    @track entriesOptions = [
        { label: '5', value: '5', selected: true },
        { label: '10', value: '10' },
        { label: '50', value: '50' },
        { label: '100', value: '100' },
        { label: '200', value: '200' },
        { label: '500', value: '500' }
    ]; // entries select options values
    //Entries controlling attribute section end

    // Search input box controlling attribute section start
    searchString; // Attribute to hold the value for search input
    disableSearchBox = false; // Attribute to enable/disable the search box
    // Search input box controlling attribute section end

    @track tableResponseData = {}; // table response data
    @track tableDataFiltered = {}; // table response data filtered form for showing the end user
    dataTableFieldForColumn = [
        {
            label: 'Project Name',
            fieldName: 'Project_Name__c',
            type: 'text',
            sortable: true
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
    externalSpinner = false; // show external spinner except data table inline loading option
    showSpinner = false; // data table is loading spinner
    showTableError = false; //Switch for handling the data table error template
    tableErrorMessage; // data table error message
    disableFirstButton = false; // Switch to control the enable/disable for first button
    disablePreviousButton = false; // Switch to control the enable/disable for previous button
    disableNextButton = false; // Switch to control the enable/disable for next button 
    disableLastButton = false; // Switch to control the enable/disable for last button

    /**
     * Connected call back to initialize the values
     * Created By       :       Abhishek Kumar Sharma
     * Created Date     :       24 June 2020
     */
    connectedCallback() {
        try {
            this.externalSpinner = true;
            this.showSpinner = true;
            getTableDataFrom_Apex({
                objectApiName: this.dataTableObjectApiName,
                viewAllPermissionForUser: this.viewAllPermissionForUser,
                loggedInUserId: this.loggedInUserId
            })
                .then(result => {
                    if (result.isSuccess === true) {
                        this.showTableError = false;
                        this.showSpinner = false;
                        this.tableResponseData = result.responseData;
                        this.totalNumberOfRows = result.responseData.length;
                        this.tableDataFiltered = result.responseData;
                        // Entries cal
                        this.fromEntries = 1;
                        if (this.toEntries < this.totalNumberOfRows) {
                            this.toEntries = this.defaultNoOfEntriesToShow;
                        } else {
                            this.toEntries = this.totalNumberOfRows;
                        }
                        this.disableFirstButton = true;
                        this.disablePreviousButton = true;
                        // calling show record
                        this.showRecords();
                    } else {
                        this.showSpinner = false;
                        this.showTableError = true;
                        this.disableEntriesOptions = true;
                        this.disableSearchBox = true;
                        this.tableErrorMessage = result.errorMessage;
                    }
                })
                .catch(error => {
                    console.error('Error while getting data from apex in data table connected call back. \n Message ::', error);
                })
        } catch (error) {
            console.error('Error occurred while initalizing the data table. \n Message ::', error);
        }
    }

    /**
     * Method to handle the record display
     * Created By       :       Abhishek Kumar Sharma
     * Created Date     :       02 July 2020
     */
    showRecords() {
        try {
            var finalRecords = [];
            for (var i = 1; i <= this.defaultNoOfEntriesToShow; i++) {
                if (i <= this.tableResponseData.length) {
                    finalRecords.push(this.tableResponseData[i - 1]);
                } else {
                    break;
                }
            }
            this.currentPage = 1;
            if (this.tableResponseData.length === 0) {
                this.fromEntries = 0;
                this.currentPage = 0;
            } else {
                this.fromEntries = 1;
            }
            this.totalPages = Math.ceil(this.tableResponseData.length) / this.defaultNoOfEntriesToShow;
            this.tableDataFiltered = finalRecords;
            this.externalSpinner = false;
        } catch (error) {
            console.error('Error in show record.s \n Message ::', error);
        }
    }

    /**
     * Method to handle the entries option change
     * Created By       :       Abhishek Kumar Sharma
     * Created Date     :       24 June 2020
     * @param {*} event 
     */
    handleShowEntriesChange(event) {
        try {
            if (event.target.value !== null && event.target.value !== undefined) {
                this.defaultNoOfEntriesToShow = event.target.value;
                this.externalSpinner = true;
                this.showRecords();
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

    /**
     * Method to handle the data table data sorting 
     * Created By       :       Abhishek Kumar Sharma
     * Created Date     :       02 July 2020
     * @param {*} event
     */
    updateDataAfterSort(event) {
        try {
            this.externalSpinner = true;
            // field name
            this.sortedBy = event.detail.fieldName;
            // sort direction
            this.sortedDirection = event.detail.sortDirection;
            // calling sort Data In Asc Or Desc function to sort the data based on direction and selected field
            this.sortDataInAscOrDesc(event.detail.fieldName, event.detail.sortDirection);

        } catch (error) {
            console.error('Exception occurred while sorting the data. \n Message ::', error);
        }
    }

    /**
     * Method handle the internal sorting and compare
     * Created By       :       Abhishek Kumar Sharma
     * Created Date     :       02 July 2020
     * @param {*} fieldName 
     * @param {*} direction 
     */
    sortDataInAscOrDesc(fieldName, direction) {
        try {
            // serialize the data before calling sort function
            let parseData = JSON.parse(JSON.stringify(this.tableDataFiltered));
            // Return the value stored in the field
            let keyValue = (a) => {
                return a[fieldName];
            };
            let isReverse = direction === 'asc' ? 1 : -1;
            // sorting data 
            parseData.sort((x, y) => {
                x = keyValue(x) ? keyValue(x) : ''; // handling null values
                y = keyValue(y) ? keyValue(y) : '';
                // sorting values based on direction
                return isReverse * ((x > y) - (y > x));
            });
            // set the sorted data to data table data
            this.tableDataFiltered = parseData;
            this.externalSpinner = false;
        } catch (error) {

        }
    }

    goToFirstPage() {
        try {
            this.currentPage = 1;
            var recordToShowEnd = this.currentPage * this.defaultNoOfEntriesToShow;
            var recordToShowStart = recordToShowEnd - this.defaultNoOfEntriesToShow;
            var filteredRecords = this.tableResponseData;
            var newRecordsToShow = [];
            for (var i = 0; i < filteredRecords.length; i++) {
                var filteredRecord = filteredRecords[i];
                if (i >= recordToShowStart && i < recordToShowEnd) {
                    newRecordsToShow.push(filteredRecord);
                }
            }
            this.tableDataFiltered = newRecordsToShow;
            this.fromEntries = recordToShowStart + 1;
            if (recordToShowEnd > filteredRecords.length) {
                this.toEntries = filteredRecords.length;
            } else {
                this.toEntries = recordToShowEnd;
            }
            if (this.currentPage === 1) {
                this.disableFirstButton = true;
                this.disablePreviousButton = true;
                this.disableNextButton = false;
                this.disableLastButton = false;
                return;
            }
        } catch (error) {
            console.error('Error occurred while handling the page change to first. \n Message ::', error);
        }
    }
    goToPreviousPage() {
        try {
            this.currentPage = this.currentPage - 1;
            var recordToShowEnd = this.currentPage * this.defaultNoOfEntriesToShow;
            var recordToShowStart = recordToShowEnd - this.defaultNoOfEntriesToShow;
            var filteredRecords = this.tableResponseData;
            var newRecordsToShow = [];
            for (var i = 0; i < filteredRecords.length; i++) {
                var filteredRecord = filteredRecords[i];
                if (i >= recordToShowStart && i < recordToShowEnd) {
                    newRecordsToShow.push(filteredRecord);
                }
            }
            this.tableDataFiltered = newRecordsToShow;
            this.fromEntries = recordToShowStart + 1;
            if (recordToShowEnd > filteredRecords.length) {
                this.toEntries = filteredRecords.length;
            } else {
                this.toEntries = recordToShowEnd;
            }
            if (this.currentPage === 1) {
                this.disableFirstButton = true;
                this.disablePreviousButton = true;
                return;
            }else{
                this.disableNextButton = false;
                this.disableLastButton = false;

            }
        } catch (error) {
            console.error('Error occurred while handling the page change to previous. \n Message ::', error);
        }
    }
    goToNextPage() {
        try {
            this.currentPage = this.currentPage + 1;
            var recordToShowEnd = this.currentPage * this.defaultNoOfEntriesToShow;
            var recordToShowStart = recordToShowEnd - this.defaultNoOfEntriesToShow;
            var filteredRecords = this.tableResponseData;
            var newRecordsToShow = [];
            for (var i = 0; i < filteredRecords.length; i++) {
                var filteredRecord = filteredRecords[i];
                if (i >= recordToShowStart && i < recordToShowEnd) {
                    newRecordsToShow.push(filteredRecord);
                }
            }
            this.tableDataFiltered = newRecordsToShow;
            this.fromEntries = recordToShowStart + 1;
            if (recordToShowEnd > filteredRecords.length) {
                this.toEntries = filteredRecords.length;
            } else {
                this.toEntries = recordToShowEnd;
            }
            if (this.currentPage === this.totalPages) {
                this.disableNextButton = true;
                this.disableLastButton = true;
                return;
            }else{
                this.disableFirstButton = false;
                this.disablePreviousButton = false;
            }
        } catch (error) {
            console.error('Error occurred while handling the page change to next. \n Message ::', error);
        }
    }
    goToLastPage() {
        try {
            this.currentPage = this.totalPages;
            var recordToShowEnd = this.currentPage * this.defaultNoOfEntriesToShow;
            var recordToShowStart = recordToShowEnd - this.defaultNoOfEntriesToShow;
            var filteredRecords = this.tableResponseData;
            var newRecordsToShow = [];
            for (var i = 0; i < filteredRecords.length; i++) {
                var filteredRecord = filteredRecords[i];
                if (i >= recordToShowStart && i < recordToShowEnd) {
                    newRecordsToShow.push(filteredRecord);
                }
            }
            this.tableDataFiltered = newRecordsToShow;
            this.fromEntries = recordToShowStart + 1;
            if (recordToShowEnd > filteredRecords.length) {
                this.toEntries = filteredRecords.length;
            } else {
                this.toEntries = recordToShowEnd;
            }

            if (this.currentPage === this.totalPages) {
                this.disableNextButton = true;
                this.disableLastButton = true;
                this.disableFirstButton = false;
                this.disablePreviousButton = false;
                return;
            }
        } catch (error) {
            console.error('Error occurred while handling the page change to last. \n Message ::', error);
        }
    }
}