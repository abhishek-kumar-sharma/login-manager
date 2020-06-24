import { LightningElement, api, track } from 'lwc';

export default class DataTableLwc extends LightningElement {
    @api flexipageRegionWidth;
    tableHeading = ''; // table heading

    //Entries controlling attribute section start
    disableEntriesOptions = false; // enable/disable the select box for entries
    defaultNoOfEntriesToShow = '5'; // No of entries to show the default
    @track entriesOptions = [
        { label: '5', value: '5' },
        { label: '10', value: '10', selected: true },
        { label: '50', value: '50' },
        { label: '100', value: '100' }
    ]; // entries select options values
    //Entries controlling attribute section end

    // Search input box controlling attribute section start
    searchString; // Attribute to hold the value for search input
    disableSearchBox = false; // Attribute to enable/disable the search box
    // Search input box controlling attribute section end

    /**
     * Connected call back to initialize the values
     * Created By       :       Abhishek Kumar Sharma
     * Created Date     :       24 June 2020
     */
    connectedCallback() {
        try {

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